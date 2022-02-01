"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCookies = exports.eventInfo = void 0;
const clone_1 = __importDefault(require("clone"));
const needle_1 = __importDefault(require("needle"));
const nodecg_1 = require("../util/nodecg");
const rabbitmq_1 = require("../util/rabbitmq");
const replicants_1 = require("../util/replicants");
exports.eventInfo = [];
const eventConfig = (0, nodecg_1.get)().bundleConfig.event;
const config = (0, nodecg_1.get)().bundleConfig.tracker;
const { useTestData } = (0, nodecg_1.get)().bundleConfig;
let cookies;
/**
 * Returns tracker cookies, if set.
 */
function getCookies() {
    return cookies;
}
exports.getCookies = getCookies;
/**
 * Translates the short event name into the numerical ID from the tracker, if it exists.
 * @param short Short event name in the tracker.
 */
async function getEventIDFromShort(short) {
    const resp = await (0, needle_1.default)('get', `https://${config.address}/search/?short=${short}&type=event`, cookies);
    if (!resp.body.length) {
        throw new Error(`Event "${short}" does not exist on the tracker`);
    }
    return resp.body[0].pk;
}
/**
 * Updates donation total from the API as a backup for the RabbitMQ messages.
 */
async function updateDonationTotalFromAPI(init = false) {
    try {
        let total = 0;
        for (const event of exports.eventInfo) {
            const resp = await (0, needle_1.default)('get', `https://${config.address}/${event.id}?json`);
            if (resp.statusCode === 200) {
                const eventTotal = resp.body.agg.amount ? parseFloat(resp.body.agg.amount) : 0;
                event.total = eventTotal;
                total += eventTotal;
            }
        }
        if (init || replicants_1.donationTotal.value < total) {
            (0, nodecg_1.get)().log.info('[Tracker] API donation total changed: $%s', total);
            replicants_1.donationTotal.value = total;
        }
    }
    catch (err) {
        (0, nodecg_1.get)().log.warn('[Tracker] Error updating donation total from API');
        (0, nodecg_1.get)().log.debug('[Tracker] Error updating donation total from API:', err);
    }
}
// Triggered when a donation total is updated in our tracker.
rabbitmq_1.mq.evt.on('donationTotalUpdated', (data) => {
    let total = 0;
    for (const event of exports.eventInfo) {
        if (data.event === event.short) {
            event.total = data.new_total;
        }
        total += event.total;
    }
    if (replicants_1.donationTotal.value < total) {
        (0, nodecg_1.get)().log.debug('[Tracker] Updated donation total received: $%s', total.toFixed(2));
        replicants_1.donationTotal.value = total;
    }
});
// Triggered when a new donation is fully processed on the tracker.
rabbitmq_1.mq.evt.on('donationFullyProcessed', (data) => {
    if (data.comment_state === 'APPROVED') {
        // eslint-disable-next-line no-underscore-dangle
        (0, nodecg_1.get)().log.debug('[Tracker] Received new donation with ID %s', data._id);
        (0, nodecg_1.get)().sendMessage('newDonation', data);
        if (data.amount >= 20) { // Notable donations are over $20
            replicants_1.notableDonations.value.unshift((0, clone_1.default)(data));
            replicants_1.notableDonations.value.length = Math.min(replicants_1.notableDonations.value.length, 20);
        }
    }
});
let isFirstLogin = true;
async function loginToTracker() {
    if (isFirstLogin)
        (0, nodecg_1.get)().log.info('[Tracker] Logging in');
    else
        (0, nodecg_1.get)().log.info('[Tracker] Refreshing session');
    const loginURL = `https://${config.address}/admin/login/`;
    try {
        // Access login page to get CSRF token.
        const resp1 = await (0, needle_1.default)('get', loginURL);
        if (resp1.statusCode !== 200) {
            throw new Error('Could not access the tracker log in page');
        }
        // POST using the CSRF token alongside the username/password.
        const resp2 = await (0, needle_1.default)('post', loginURL, {
            username: config.username,
            password: config.password,
            csrfmiddlewaretoken: (resp1.cookies) ? resp1.cookies.csrftoken : undefined,
        }, {
            cookies: resp1.cookies,
            headers: {
                referer: loginURL,
            },
        });
        // If we're not being redirected or there's no session token, the login failed.
        if (resp2.statusCode !== 302 || (resp2.cookies && !resp2.cookies.tracker_session)) {
            throw new Error('Log in was unsuccessful, is your username/password correct?');
        }
        // Store cookie for later use.
        cookies = resp2.cookies;
        if (isFirstLogin) {
            isFirstLogin = false;
            (0, nodecg_1.get)().log.info('[Tracker] Successfully logged in');
        }
        else {
            (0, nodecg_1.get)().log.info('[Tracker] Successfully refreshed session');
        }
        // Tracker logins expire every 2 hours (apparently?). Re-login every 90 minutes.
        setTimeout(loginToTracker, 90 * 60 * 1000);
    }
    catch (err) {
        (0, nodecg_1.get)().log.warn('[Tracker] Error authenticating');
        (0, nodecg_1.get)().log.debug('[Tracker] Error authenticating:', err);
        if (!isFirstLogin) {
            setTimeout(loginToTracker, 60 * 1000);
        }
        else {
            throw new Error('Could not log in successfully');
        }
    }
}
async function setup() {
    if (!eventConfig.shorts.length) {
        (0, nodecg_1.get)().log.warn('[Tracker] No events found in configuration to query for');
        return;
    }
    try {
        (0, nodecg_1.get)().log.info('[Tracker] Setting up');
        // Log into the tracker first.
        if (!useTestData)
            await loginToTracker();
        // Go through all events and compile the important info for them.
        const events = (Array.isArray(eventConfig.shorts)) ? eventConfig.shorts : [eventConfig.shorts];
        for (const [index, short] of events.entries()) {
            const id = !useTestData ? await getEventIDFromShort(short) : index + 1;
            exports.eventInfo.push({
                id,
                short,
                total: !useTestData ? 0 : Math.random() * 1000,
            });
        }
        if (!useTestData) {
            // Get initial total from API and set an interval as a fallback.
            updateDonationTotalFromAPI(true);
            setInterval(updateDonationTotalFromAPI, 60 * 1000);
        }
        else {
            replicants_1.donationTotal.value = exports.eventInfo.reduce((p, e) => p + e.total, 0);
        }
        /* eslint-disable @typescript-eslint/no-var-requires, global-require */
        require('./bids').setup();
        require('./prizes').setup();
        require('./donations').setup();
        /* eslint-enable */
    }
    catch (err) {
        (0, nodecg_1.get)().log.warn('[Tracker] Error setting up');
        (0, nodecg_1.get)().log.debug('[Tracker] Error setting up:', err);
    }
}
if (config.enabled) {
    setup();
}
