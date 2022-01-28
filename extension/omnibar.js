"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clone_1 = __importDefault(require("clone"));
const uuid_1 = require("uuid");
const nodecg_1 = require("./util/nodecg");
const obs_1 = __importDefault(require("./util/obs"));
const rabbitmq_1 = require("./util/rabbitmq");
const replicants_1 = require("./util/replicants");
const speedcontrol_1 = require("./util/speedcontrol");
const config = (0, nodecg_1.get)().bundleConfig;
// Stored caches but not persistent through NodeCG restarts.
let nextRunsCache = [];
let prizesCache = [];
// Gets next upcoming run from the cache (after refilling it if needed).
// TODO: Refill cache *again* after filtering if this isn't a first cycle.
function getUpcomingRun() {
    // Fill up cache if empty.
    if (!nextRunsCache.length)
        nextRunsCache = speedcontrol_1.sc.getNextRuns(4);
    // Filter out any already passed runs (according to schedule) from cache.
    nextRunsCache = nextRunsCache.filter((r) => !r.scheduledS || r.scheduledS >= (Date.now() / 1000));
    // Just return nothing if cache now happens to be empty.
    if (!nextRunsCache.length)
        return undefined;
    return nextRunsCache.shift();
}
// Gets next currently active prize from the cache (after refilling it if needed).
// TODO: Refill cache *again* after filtering if this isn't a first cycle.
function getPrize() {
    // Fill up cache if empty, only include currently active prizes.
    if (!prizesCache.length)
        prizesCache = (0, clone_1.default)(replicants_1.prizes.value);
    // Filter out any currently inactive prizes from cache.
    prizesCache = prizesCache.filter((prize) => !!prize.startTime && !!prize.endTime
        && Date.now() > prize.startTime && Date.now() < prize.endTime);
    // Just return nothing if cache now happens to be empty.
    if (!prizesCache.length)
        return undefined;
    return prizesCache.shift();
}
// Gets a random active milestone.
// TODO: Make this sequential?
// TODO: Implement original "weighted" code!
function getBid() {
    // Just return nothing if there are no bids to show.
    if (!replicants_1.bids.value.length)
        return undefined;
    const rand = Math.floor(Math.random() * replicants_1.bids.value.length);
    return (0, clone_1.default)(replicants_1.bids.value[rand]);
}
// Gets a random active milestone.
// TODO: Make this sequential?
function getMilestone() {
    const filtered = replicants_1.donationTotalMilestones.value.filter((m) => m.enabled && m.amount);
    // Just return nothing if there are no filtered milestones to show.
    if (!filtered.length)
        return undefined;
    const rand = Math.floor(Math.random() * filtered.length);
    return (0, clone_1.default)(filtered[rand]);
}
// TODO: Work out what to do if we get stuck on an infinite loop.
function showNext() {
    if (replicants_1.omnibar.value.alertQueue.length) {
        const alert = replicants_1.omnibar.value.alertQueue.shift();
        if (alert) {
            (0, nodecg_1.get)().log.debug('[Omnibar] Alert available, will show:', alert === null || alert === void 0 ? void 0 : alert.type);
            const { type, id, data } = alert;
            replicants_1.omnibar.value.current = {
                type,
                id,
                props: {
                    msg: data === null || data === void 0 ? void 0 : data.msg,
                    user: data === null || data === void 0 ? void 0 : data.user, // Tweet
                },
            };
        }
        else
            showNext();
    }
    else {
        // If nothing in the rotation anymore, just stop for now.
        if (!replicants_1.omnibar.value.rotation.length) {
            delete replicants_1.omnibar.value.lastId;
            replicants_1.omnibar.value.current = null;
            return;
        }
        const lastIndex = replicants_1.omnibar.value.rotation.findIndex((r) => r.id === replicants_1.omnibar.value.lastId);
        let nextIndex = lastIndex + 1;
        if (replicants_1.omnibar.value.rotation.length - 1 < nextIndex)
            nextIndex = 0;
        const next = replicants_1.omnibar.value.rotation[nextIndex];
        replicants_1.omnibar.value.lastId = next.id;
        if (next.type === 'UpcomingRun') {
            const run = getUpcomingRun();
            if (!run) {
                showNext();
                return;
            }
            replicants_1.omnibar.value.current = Object.assign(Object.assign({}, next), { props: Object.assign(Object.assign({}, next.props), { run }) });
        }
        else if (next.type === 'Prize') {
            const prize = getPrize();
            if (!prize) {
                showNext();
                return;
            }
            replicants_1.omnibar.value.current = Object.assign(Object.assign({}, next), { props: Object.assign(Object.assign({}, next.props), { prize }) });
        }
        else if (next.type === 'Milestone') {
            const milestone = getMilestone();
            if (!milestone) {
                showNext();
                return;
            }
            replicants_1.omnibar.value.current = Object.assign(Object.assign({}, next), { props: Object.assign(Object.assign({}, next.props), { milestone }) });
        }
        else if (next.type === 'Bid') {
            const bid = getBid();
            if (!bid) {
                showNext();
                return;
            }
            replicants_1.omnibar.value.current = Object.assign(Object.assign({}, next), { props: Object.assign(Object.assign({}, next.props), { bid }) });
        }
        else {
            replicants_1.omnibar.value.current = (0, clone_1.default)(next);
        }
        (0, nodecg_1.get)().log.debug('[Omnibar] Will now show message of type:', next.type);
    }
}
replicants_1.omnibar.on('change', (newVal, oldVal) => {
    // If nothing is currently being shown, and the rotation is filled from being empty,
    // or we get alerts in the queue, trigger the cycle to start up again.
    if (!newVal.current && oldVal
        && ((newVal.rotation.length && !oldVal.rotation.length)
            || (newVal.alertQueue.length && !oldVal.alertQueue.length))) {
        showNext();
    }
});
// Listens for messages from the graphic to change to the next message.
(0, nodecg_1.get)().listenFor('omnibarShowNext', (data, ack) => {
    showNext();
    if (ack && !(ack === null || ack === void 0 ? void 0 : ack.handled))
        ack();
});
// Listens for messages from the graphic to play the "donation" SFX via OBS source.
(0, nodecg_1.get)().listenFor('omnibarPlaySound', async (data, ack) => {
    if (config.obs.enabled && obs_1.default.connected) {
        try {
            await obs_1.default.conn.send('RestartMedia', { sourceName: config.obs.names.sources.donationSound });
        }
        catch (err) { /* catch */ }
    }
    if (ack && !(ack === null || ack === void 0 ? void 0 : ack.handled))
        ack();
});
// Screened data from our moderation tool, used for the omnibar.
rabbitmq_1.mq.evt.on('newScreenedTweet', (data) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const msgData = data.message; // TODO: Update MQ event!
    let message = msgData.full_text;
    // Regex removes multiple spaces/newlines from tweets.
    message = message.replace(/\s\s+|\n/g, ' ');
    // Regex removes Twitter URL shortener links.
    message = message.replace(/https:\/\/t\.co\/\w+/g, (match) => {
        var _a, _b;
        if (((_b = (_a = msgData.entities) === null || _a === void 0 ? void 0 : _a.urls) === null || _b === void 0 ? void 0 : _b.length) > 0) {
            const replacementUrl = msgData.entities.urls
                .find((urlInfo) => urlInfo.url === match);
            if (replacementUrl)
                return replacementUrl.display_url;
        }
        return '';
    });
    (0, nodecg_1.get)().log.debug('[Omnibar] Received new tweet from %s:', data.user.name, message);
    // Add Tweet to queue.
    replicants_1.omnibar.value.alertQueue.push({
        type: 'Tweet',
        id: (0, uuid_1.v4)(),
        data: {
            user: data.user.name,
            msg: message,
        },
    });
});
rabbitmq_1.mq.evt.on('newScreenedCrowdControl', (data) => {
    if (config.event.thisEvent === 1) {
        (0, nodecg_1.get)().log.debug('[Omnibar] Received new crowd control message:', data.message);
        // Add crowd control message to queue.
        replicants_1.omnibar.value.alertQueue.push({
            type: 'CrowdControl',
            id: (0, uuid_1.v4)(),
            data: {
                msg: data.message.trailing,
            },
        });
    }
});
