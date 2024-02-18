"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCookies = exports.eventInfo = void 0;
const needle_1 = __importDefault(require("needle"));
const nodecg_1 = require("../util/nodecg");
const rabbitmq_1 = require("../util/rabbitmq");
const replicants_1 = require("../util/replicants");
exports.eventInfo = [];
const eventConfig = (0, nodecg_1.get)().bundleConfig.event;
const config = (0, nodecg_1.get)().bundleConfig.tracker;
const { useTestData } = (0, nodecg_1.get)().bundleConfig;
let cookies;
let tiltifyApiBackupTimeout;
const tiltifyApiBackupLength = 5 * 60 * 1000;
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
async function updateDonationTotalFromAPITiltify(init = false) {
    try {
        let total = 0;
        // TODO: REMOVE ESAW24 AND URL HARDCODING!
        const resp = await (0, needle_1.default)('get', 'https://app.esamarathon.com/tiltify/campaigns/team/esaw2024');
        if (resp.statusCode === 200) {
            const eventTotal = resp.body.total_amount_raised.value
                ? parseFloat(resp.body.total_amount_raised.value)
                : 0;
            // event.total = eventTotal; // I hope this isn't important?
            total += eventTotal;
        }
        if (init || replicants_1.donationTotal.value < total) {
            const diff = total - replicants_1.donationTotal.value;
            (0, nodecg_1.get)().sendMessage('donationTotalUpdated', { total, diff, showAlert: false });
            (0, nodecg_1.get)().log.info('[Tracker] API donation total changed: $%s', total);
            replicants_1.donationTotal.value = total;
            // If we checked the donation total on an interval and it was different, the MQ
            // messages may be failing. Using a Discord Webhook to notify someone for ease of use.
            const webhookUrl = (0, nodecg_1.get)().bundleConfig.tiltify.errorDiscordWebhook;
            const userId = (0, nodecg_1.get)().bundleConfig.tiltify.errorDiscordWebhookUserIdToPing;
            if (!init && webhookUrl) {
                try {
                    await (0, needle_1.default)('post', webhookUrl, {
                        content: `${userId ? `<@${userId}> ` : ''}There may be an issue with the esa-layouts `
                            + 'Tiltify integration with RabbitMQ messages! '
                            + `(sent from stream ${(0, nodecg_1.get)().bundleConfig.event.thisEvent})`,
                    });
                    (0, nodecg_1.get)().log.debug('[Tracker] Discord webhook sent');
                }
                catch (err) {
                    (0, nodecg_1.get)().log.debug('[Tracker] Discord webhook failed:', err);
                }
            }
        }
    }
    catch (err) {
        (0, nodecg_1.get)().log.warn('[Tracker] Error updating donation total from API');
        (0, nodecg_1.get)().log.debug('[Tracker] Error updating donation total from API:', err);
    }
    tiltifyApiBackupTimeout = setTimeout(updateDonationTotalFromAPITiltify, tiltifyApiBackupLength);
}
// Triggered when a donation total is updated in our tracker.
// THIS WORKS EVEN IF TRACKER CONFIG IS DISABLED! WHICH IS GOOD FOR TILTIFY!
rabbitmq_1.mq.evt.on('donationTotalUpdated', (data) => {
    let total = 0;
    // HARDCODED FOR NOW!
    if (data.event === 'esaw2024') {
        clearInterval(tiltifyApiBackupTimeout);
        total += data.new_total;
        tiltifyApiBackupTimeout = setTimeout(updateDonationTotalFromAPITiltify, tiltifyApiBackupLength);
    }
    if (replicants_1.donationTotal.value < total) {
        const diff = total - replicants_1.donationTotal.value;
        (0, nodecg_1.get)().sendMessage('donationTotalUpdated', { total, diff, showAlert: true });
        (0, nodecg_1.get)().log.debug('[Tracker] Updated donation total received: $%s', total.toFixed(2));
        replicants_1.donationTotal.value = total;
    }
});
// DISABLED FOR NOW (ESAW24)
// Triggered when a new donation is fully processed on the tracker.
/* mq.evt.on('donationFullyProcessed', (data) => {
  if (data.comment_state === 'APPROVED') {
    // eslint-disable-next-line no-underscore-dangle
    nodecg().log.debug('[Tracker] Received new donation with ID %s', data._id);
    nodecg().sendMessage('newDonation', data);
    if (data.amount >= 20) { // Notable donations are over $20
      notableDonations.value.unshift(clone(data));
      notableDonations.value.length = Math.min(notableDonations.value.length, 20);
    }
  }
}); */
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
        const events = (() => {
            const cfg = eventConfig.shorts;
            return (Array.isArray(cfg)) ? cfg : [cfg];
        })();
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
else {
    // FOR TILTIFY USE!
    // Get initial total from API (function also sets a timeout as a fallback).
    updateDonationTotalFromAPITiltify(true);
}
