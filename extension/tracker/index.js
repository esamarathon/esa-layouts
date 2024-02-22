"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCookies = exports.eventInfo = void 0;
const helpers_1 = require("@esa-layouts/util/helpers");
const lodash_1 = require("lodash");
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
        total = (0, lodash_1.round)(total, 2);
        // Wait 10s to just check we're not getting a new total just before a MQ message.
        await (0, helpers_1.wait)(10 * 1000);
        if (init || replicants_1.donationTotal.value < total) {
            const oldTotal = replicants_1.donationTotal.value;
            (0, nodecg_1.get)().sendMessage('donationTotalUpdated', { total });
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
                            + `Stored total was ${oldTotal} but API said total was ${total}`
                            + ` (sent from stream ${(0, nodecg_1.get)().bundleConfig.event.thisEvent}`
                            + ` at ${(new Date().toISOString())})`,
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
    // HARDCODED FOR NOW!
    if (data.event === 'esaw2024') {
        clearInterval(tiltifyApiBackupTimeout);
        tiltifyApiBackupTimeout = setTimeout(updateDonationTotalFromAPITiltify, tiltifyApiBackupLength);
        const total = (0, lodash_1.round)(data.new_total, 2);
        if (replicants_1.donationTotal.value < total) {
            (0, nodecg_1.get)().sendMessage('donationTotalUpdated', { total });
            (0, nodecg_1.get)().log.debug('[Tracker] Updated donation total received: $%s', total);
            replicants_1.donationTotal.value = total;
        }
    }
});
const seenDonationIds = [];
// Fully processed donations for donations targeted towards this stream.
rabbitmq_1.mq.evt.on('donationFullyProcessedStream', (data) => {
    // eslint-disable-next-line no-underscore-dangle
    const id = data._id;
    if (!seenDonationIds.includes(id)) {
        seenDonationIds.push(id);
        (0, nodecg_1.get)().log.debug('[Tracker] Received new donation with ID %s', id);
        (0, nodecg_1.get)().sendMessage('newDonation', { amount: data.amount });
        if (data.amount >= 20) { // Notable donations are over $20
            replicants_1.notableDonations.value.unshift({
                event: data.event,
                // eslint-disable-next-line no-underscore-dangle
                _id: data._id,
                donor_visiblename: data.donor_visiblename,
                amount: data.amount,
                comment: data.comment,
            });
            replicants_1.notableDonations.value.length = Math.min(replicants_1.notableDonations.value.length, 20);
        }
    }
});
// Fully processed donations for donations targeted towards the main campaign.
// We only listen for this on stream 1.
if (eventConfig.thisEvent === 1) {
    rabbitmq_1.mq.evt.on('donationFullyProcessedTeam', (data) => {
        // eslint-disable-next-line no-underscore-dangle
        const id = data._id;
        if (!seenDonationIds.includes(id)) {
            seenDonationIds.push(id);
            (0, nodecg_1.get)().log.debug('[Tracker] Received new donation with ID %s', id);
            (0, nodecg_1.get)().sendMessage('newDonation', { amount: data.amount });
            if (data.amount >= 20) { // Notable donations are over $20
                replicants_1.notableDonations.value.unshift({
                    event: data.event,
                    // eslint-disable-next-line no-underscore-dangle
                    _id: data._id,
                    donor_visiblename: data.donor_visiblename,
                    amount: data.amount,
                    comment: data.comment,
                });
                replicants_1.notableDonations.value.length = Math.min(replicants_1.notableDonations.value.length, 20);
            }
        }
    });
}
// Used to log messages from the browser.
(0, nodecg_1.get)().listenFor('donationAlertsLogging', (msg) => {
    (0, nodecg_1.get)().log.debug('[Tracker] %s', msg);
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
