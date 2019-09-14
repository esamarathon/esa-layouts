"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const needle_1 = __importDefault(require("needle"));
const nodecgApiContext = __importStar(require("./util/nodecg-api-context"));
const nodecg_bundleconfig_1 = require("./util/nodecg-bundleconfig");
const rabbitmq_1 = require("./util/rabbitmq");
if (!nodecg_bundleconfig_1.bundleConfig.tracker.enable) {
    // @ts-ignore: Gonna do this anyway :)
    return;
}
const nodecg = nodecgApiContext.get();
let isFirstLogin = true;
exports.eventInfo = [];
exports.streamEvtNumber = nodecg_bundleconfig_1.bundleConfig.tracker.streamEvent - 1;
const donationTotal = nodecg.Replicant('donationTotal');
const recentDonations = nodecg.Replicant('recentDonations');
const evtShortRep = nodecg.Replicant('evtShort');
const otherStreamInfo = nodecg.Replicant('otherStreamInfo');
const otherStreamInfoShow = nodecg.Replicant('otherStreamInfoShow', { defaultValue: false });
init();
function init() {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Go through all events and compile the important info for them.
            const events = (Array.isArray(nodecg_bundleconfig_1.bundleConfig.tracker.events)) ? nodecg_bundleconfig_1.bundleConfig.tracker.events : [nodecg_bundleconfig_1.bundleConfig.tracker.events];
            try {
                for (var events_1 = __asyncValues(events), events_1_1; events_1_1 = yield events_1.next(), !events_1_1.done;) {
                    const short = events_1_1.value;
                    try {
                        const id = yield getEventIDFromShort(short);
                        exports.eventInfo.push({
                            id,
                            short,
                            total: 0,
                        });
                    }
                    catch (err) {
                        // silently drop it for now
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (events_1_1 && !events_1_1.done && (_a = events_1.return)) yield _a.call(events_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            if (!exports.eventInfo.length) {
                nodecg.log.warn('No events found to query the tracker for.');
                throw new Error('');
            }
            yield loginToTracker();
            // Get initial total from API and set an interval as a fallback.
            updateDonationTotalFromAPI();
            setInterval(updateDonationTotalFromAPI, 60000);
            evtShortRep.value = exports.eventInfo[exports.streamEvtNumber].short;
            require('./tracker-bids');
            require('./tracker-prizes');
            require('./tracker-donations');
        }
        catch (err) {
            nodecg.log.warn('Error setting up tracker, retrying in 60 seconds.');
            setTimeout(init, 60000);
        }
    });
}
function getEventIDFromShort(short) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            const resp = yield needle_1.default('get', `https://${nodecg.bundleConfig.tracker.address}/search/?short=${short}&type=event`, exports.cookies);
            if (!resp.body.length) {
                throw new Error(`Event ${short} does not exist on the tracker.`);
            }
            resolve(resp.body[0].pk);
        }
        catch (err) {
            reject(err);
        }
    }));
}
function updateDonationTotalFromAPI() {
    var e_2, _a;
    return __awaiter(this, void 0, void 0, function* () {
        let total = 0;
        try {
            for (var eventInfo_1 = __asyncValues(exports.eventInfo), eventInfo_1_1; eventInfo_1_1 = yield eventInfo_1.next(), !eventInfo_1_1.done;) {
                const event = eventInfo_1_1.value;
                try {
                    const resp = yield needle_1.default('get', `https://${nodecg.bundleConfig.tracker.address}/${event.id}?json`);
                    if (resp.statusCode === 200) {
                        const evtTotal = resp.body.agg.amount ? parseFloat(resp.body.agg.amount) : 0;
                        event.total = evtTotal;
                        total += evtTotal;
                    }
                }
                catch (err) {
                    // silently drop it for now
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (eventInfo_1_1 && !eventInfo_1_1.done && (_a = eventInfo_1.return)) yield _a.call(eventInfo_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        if (donationTotal.value !== total) {
            nodecg.log.info('API donation total changed: $%s', total);
            donationTotal.value = total;
        }
    });
}
if (nodecg.bundleConfig.fcb.enable) {
    nodecg.listenFor('updateFFZFollowing', 'nodecg-speedcontrol', updateFeaturedChannels);
}
// Used to update the featured channels on the bridge running on an external server.
function updateFeaturedChannels(usernames) {
    return __awaiter(this, void 0, void 0, function* () {
        const postKey = nodecg.bundleConfig.fcb.postKey;
        try {
            const resp = yield needle_1.default('post', `https://${nodecg.bundleConfig.fcb.address}/featured_channels?key=${postKey}`, JSON.stringify({
                channels: usernames,
            }), {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
            });
            if (resp.statusCode === 200) {
                nodecg.log.info('Successfully sent featured channels to FCB server.');
            }
            else {
                nodecg.log.warn('Failed to send featured channels to FCB server (%s).', resp.statusCode);
            }
        }
        catch (err) {
            nodecg.log.warn('Failed to send featured channels to FCB server.');
            nodecg.log.debug('Failed to send featured channels to FCB server:', err);
        }
    });
}
// When the donation total is updated, this is fired.
rabbitmq_1.mq.on('evt-donation-total', (data) => {
    let total = 0;
    for (const event of exports.eventInfo) {
        if (data.event === event.short) {
            event.total = data.new_total;
        }
        total += event.total;
    }
    if (donationTotal.value !== total) {
        donationTotal.value = total;
        nodecg.log.info('Updated donation total received: $%s', total.toFixed(2));
    }
});
// When a new donation is fully processed on the tracker, this is fired.
rabbitmq_1.mq.on('donation-fully-processed', (data) => {
    if (data.comment_state === 'APPROVED') {
        nodecg.log.info('Received new donation with ID %s.', data._id);
        nodecg.sendMessage('newDonation', data);
        if (data.amount >= 20) {
            recentDonations.value.unshift(data);
            recentDonations.value.length = Math.min(recentDonations.value.length, 20);
        }
    }
});
// Is this tracker stuff? Living here for now.
rabbitmq_1.mq.on('new-screened-sub', (data) => {
    nodecg.log.info('Received new subscriber.');
    nodecg.sendMessage('newSub', data);
});
rabbitmq_1.mq.on('new-screened-tweet', (data) => {
    nodecg.log.info('Received new tweet.');
    nodecg.sendMessage('newTweet', data);
});
rabbitmq_1.mq.on('new-screened-cheer', (data) => {
    nodecg.log.info('Received new cheer.');
    nodecg.sendMessage('newCheer', data);
});
rabbitmq_1.mq.on('new-screened-crowdcontrolexchange', (data) => {
    nodecg.log.info('Received new crowd control exchange.');
    nodecg.sendMessage('newCrowdControlExchange', data);
});
rabbitmq_1.mq.on('run-changed', (data) => { otherStreamInfo.value = data.run; });
rabbitmq_1.mq.on('game-scene-changed', (data) => {
    if (data.event !== exports.eventInfo[exports.streamEvtNumber].short) {
        if (data.action === 'start') {
            otherStreamInfoShow.value = true;
        }
        else if (data.action === 'end') {
            otherStreamInfoShow.value = false;
        }
    }
});
function loginToTracker() {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        if (isFirstLogin) {
            nodecg.log.info('Logging into the tracker as %s.', nodecg.bundleConfig.tracker.username);
        }
        else {
            // tslint:disable-next-line: max-line-length
            nodecg.log.info('Refreshing tracker login session as %s.', nodecg.bundleConfig.tracker.username);
        }
        const loginURL = `https://${nodecg.bundleConfig.tracker.address}/admin/login/`;
        try {
            // Access login page to get CSRF token.
            const resp1 = yield needle_1.default('get', loginURL);
            if (resp1.statusCode !== 200) {
                throw new Error('Could not access the tracker log in page.');
            }
            // POST using the CSRF token alongside the username/password.
            const resp2 = yield needle_1.default('post', loginURL, {
                username: nodecg.bundleConfig.tracker.username,
                password: nodecg.bundleConfig.tracker.password,
                csrfmiddlewaretoken: (resp1.cookies) ? resp1.cookies.csrftoken : undefined,
            }, {
                cookies: resp1.cookies,
                headers: {
                    referer: loginURL,
                },
            });
            // If we're not being redirected or there's no session token, the login failed.
            if (resp2.statusCode !== 302 || (resp2.cookies && !resp2.cookies.tracker_session)) {
                throw new Error('Log in to the tracker was unsuccessful, is your user/pass correct?');
            }
            // Store cookie for later use.
            exports.cookies = resp2.cookies;
            if (isFirstLogin) {
                isFirstLogin = false;
                nodecg.log.info('Logged into the tracker as %s.', nodecg.bundleConfig.tracker.username);
            }
            else {
                nodecg.log.info('Refreshed tracker session as %s.', nodecg.bundleConfig.tracker.username);
            }
            // Tracker logins expire every 2 hours. Re-login every 90 minutes.
            setTimeout(loginToTracker, 90 * 60 * 1000);
            resolve();
        }
        catch (err) {
            nodecg.log.warn('Error authenticating with the tracker.');
            nodecg.log.debug('Error authenticating with the tracker:', err);
            if (!isFirstLogin) {
                setTimeout(loginToTracker, 60000);
            }
            reject();
        }
    }));
}
//# sourceMappingURL=tracker.js.map