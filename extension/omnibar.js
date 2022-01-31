"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clone_1 = __importDefault(require("clone"));
const speedcontrol_util_1 = require("speedcontrol-util");
const uuid_1 = require("uuid");
const helpers_1 = require("./util/helpers");
const nodecg_1 = require("./util/nodecg");
const obs_1 = __importDefault(require("./util/obs"));
const rabbitmq_1 = require("./util/rabbitmq");
const replicants_1 = require("./util/replicants");
const speedcontrol_1 = require("./util/speedcontrol");
const config = (0, nodecg_1.get)().bundleConfig;
// Temporary storage for subscriptions/cheers/donations made during a run.
// TODO: Move this to a replicant so it survives restarts!
const runSubs = [];
const runCheers = [];
const runDonations = [];
// Filter helper used below.
function filterUpcomingRuns(run) {
    return !run.scheduledS || run.scheduledS >= (Date.now() / 1000);
}
// Gets next upcoming run from the cache (after refilling it if needed).
let upcomingRunsCache = [];
function getUpcomingRun() {
    // Filter out any already passed runs (according to schedule) from cache.
    upcomingRunsCache = upcomingRunsCache.filter(filterUpcomingRuns);
    // Fill up cache if empty, also run the filter again.
    if (!upcomingRunsCache.length)
        upcomingRunsCache = speedcontrol_1.sc.getNextRuns(4).filter(filterUpcomingRuns);
    // Just return nothing if cache now happens to be empty.
    if (!upcomingRunsCache.length)
        return undefined;
    return upcomingRunsCache.shift();
}
// Filter helper used below.
function filterPrizes(prize) {
    return !!prize.startTime && !!prize.endTime
        && Date.now() > prize.startTime && Date.now() < prize.endTime;
}
// Gets next currently active prize from the cache (after refilling it if needed).
let prizesCache = [];
function getPrize() {
    // Filter out any currently inactive prizes from cache.
    prizesCache = prizesCache.filter(filterPrizes);
    // Fill up cache if empty, also run the filter again.
    if (!prizesCache.length)
        prizesCache = (0, clone_1.default)(replicants_1.prizes.value).filter(filterPrizes);
    // Just return nothing if cache now happens to be empty.
    if (!prizesCache.length)
        return undefined;
    return prizesCache.shift();
}
// Gets a random (but weighted) active milestone.
let lastBidId = -1;
function getBid() {
    var _a;
    // Just return nothing if there are no bids to show.
    if (!replicants_1.bids.value.length)
        return undefined;
    let filtered = (0, clone_1.default)(replicants_1.bids.value).filter((b) => b.id !== lastBidId);
    if (!filtered.length)
        filtered = (0, clone_1.default)(replicants_1.bids.value);
    const choices = filtered.reduce((prev, bid) => {
        var _a, _b, _c;
        // Weight: (15 minutes / time between now and prize ending), to the power of itself.
        // This is also capped between 0 and 1. Basically, anything in the next
        // 15 minutes is weighted 1, and after that quickly
        // gets lower.
        let weight = Math.max(Math.min((15 * 60 * 1000)
            / Math.max(((_a = bid.endTime) !== null && _a !== void 0 ? _a : 0) - Date.now(), 0), 1), 0) ** 2;
        if (bid.id === lastBidId && replicants_1.bids.value.length > 1)
            weight = 0;
        prev.push({ bid, cumulativeWeight: ((_c = (_b = prev.slice(-1)[0]) === null || _b === void 0 ? void 0 : _b.cumulativeWeight) !== null && _c !== void 0 ? _c : 0) + weight });
        return prev;
    }, []);
    const rand = choices.slice(-1)[0].cumulativeWeight * Math.random();
    const choice = choices.find((opt) => opt.cumulativeWeight >= rand);
    lastBidId = (_a = choice === null || choice === void 0 ? void 0 : choice.bid.id) !== null && _a !== void 0 ? _a : -1;
    return choice === null || choice === void 0 ? void 0 : choice.bid;
}
// Gets a random active milestone.
let lastMilestoneId = '';
function getMilestone() {
    const active = (0, clone_1.default)(replicants_1.donationTotalMilestones.value).filter((m) => m.enabled && m.amount);
    // Just return nothing if there are no active milestones to show.
    if (!active.length)
        return undefined;
    let filtered = active.filter((m) => m.id !== lastMilestoneId);
    if (!filtered.length)
        filtered = active;
    const rand = Math.floor(Math.random() * filtered.length);
    const chosen = filtered[rand];
    lastMilestoneId = chosen.id;
    return chosen;
}
let loopsWithoutResult = 0;
async function showNext() {
    // If there is a pin to start showing.
    const { pin } = replicants_1.omnibar.value;
    if (pin) {
        let item;
        if (pin.type === 'Milestone') {
            item = replicants_1.donationTotalMilestones.value.find((m) => m.id === pin.id);
        }
        else if (pin.type === 'Bid') {
            item = replicants_1.bids.value.find((b) => b.id === pin.id);
        }
        if (item) {
            item = (0, clone_1.default)(item);
            (0, nodecg_1.get)().log.debug('[Omnibar] Pin available, will show:', pin.type);
            replicants_1.omnibar.value.current = {
                type: pin.type,
                id: (0, uuid_1.v4)(),
                props: {
                    seconds: -1,
                    bid: pin.type === 'Bid' ? item : undefined,
                    milestone: pin.type === 'Milestone' ? item : undefined,
                },
            };
        }
        else {
            // If the pin item wasn't found, erase it and continue on.
            replicants_1.omnibar.value.pin = null;
            // showNext(); This is done in the "omnibar" replicant change listener
        }
        // If there is alerts in the queue to show.
    }
    else if (replicants_1.omnibar.value.alertQueue.length) {
        const alert = replicants_1.omnibar.value.alertQueue.shift();
        if (alert) {
            (0, nodecg_1.get)().log.debug('[Omnibar] Alert available, will show:', alert === null || alert === void 0 ? void 0 : alert.type);
            const { type, id, data } = alert;
            replicants_1.omnibar.value.current = {
                type,
                id,
                props: {
                    seconds: (data === null || data === void 0 ? void 0 : data.seconds) || 15,
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
        // If we get stuck in a loop, pause for 10s, then try again.
        if (loopsWithoutResult >= replicants_1.omnibar.value.rotation.length) {
            await new Promise((res) => { setTimeout(res, 10 * 1000); });
            loopsWithoutResult = 0;
        }
        const lastIndex = replicants_1.omnibar.value.rotation.findIndex((r) => r.id === replicants_1.omnibar.value.lastId);
        let nextIndex = lastIndex + 1;
        if (replicants_1.omnibar.value.rotation.length - 1 < nextIndex)
            nextIndex = 0;
        const next = replicants_1.omnibar.value.rotation[nextIndex];
        replicants_1.omnibar.value.lastId = next.id;
        loopsWithoutResult += 1;
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
        loopsWithoutResult = 0;
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
    // If a pin is removed, continue cycle.
    if (oldVal && oldVal.pin && !newVal.pin) {
        (0, nodecg_1.get)().log.debug('[Omnibar] Pin removed, will continue');
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
        if (msgData.entities.urls.length > 0) {
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
// Pushes subscriptions/cheers/donations made during the run to the respective arrays.
rabbitmq_1.mq.evt.on('newScreenedSub', (data) => {
    runSubs.push(data);
});
rabbitmq_1.mq.evt.on('newScreenedCheer', (data) => {
    runCheers.push(data);
});
rabbitmq_1.mq.evt.on('donationFullyProcessed', (data) => {
    runDonations.push(data);
});
// Pushes our "mini credits" to the alert queue.
// TODO: Change what triggers this?
speedcontrol_1.sc.on('timerStopped', () => {
    var _a;
    (0, nodecg_1.get)().log.debug('[Omnibar] Timer stopped, generating mini credits');
    // If there's any credits in the queue, removes them.
    const oldCreditsIndex = replicants_1.omnibar.value.alertQueue.findIndex((a) => a.type === 'MiniCredits');
    if (oldCreditsIndex >= 0)
        replicants_1.omnibar.value.alertQueue.splice(oldCreditsIndex, 1);
    // If the current omnibar message is already mini credits, also remove those.
    if (((_a = replicants_1.omnibar.value.current) === null || _a === void 0 ? void 0 : _a.type) === 'MiniCredits') {
        showNext();
    }
    // Collect all information needed.
    // TODO: Remove (or add) pronouns where needed?
    const players = speedcontrol_1.sc.runDataActiveRun.value
        ? speedcontrol_util_1.SpeedcontrolUtil.formPlayerNamesStr(speedcontrol_1.sc.runDataActiveRun.value)
        : undefined;
    const comms = replicants_1.commentators.value.length
        ? replicants_1.commentators.value.join(', ')
        : undefined;
    const reader = replicants_1.donationReader.value;
    const screeners = 'PRESET_LIST_OF_NAMES'; // TODO: Get from config!
    const tech = 'PRESET_LIST_OF_NAMES'; // TODO: Get from config!
    const donators = runDonations.length // TODO: Group donation totals by name!
        ? runDonations.map((d) => `${d.donor_visiblename} (${(0, helpers_1.formatUSD)(d.amount)})`).join(', ')
        : undefined;
    const subscribers = runSubs.length // TODO: Update MQ event, change subgifts logic!
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? runSubs.map((s) => s.user.displayName).join(', ')
        : undefined;
    const cheers = runCheers.length
        ? runCheers // TODO: Group cheer totals by name!
            .map((c) => `${c.message.tags['display-name']} (${c.message.tags.bits} bits)`).join(', ')
        : undefined;
    // Push actual data to the queue.
    replicants_1.omnibar.value.alertQueue.push({
        type: 'MiniCredits',
        id: (0, uuid_1.v4)(),
        data: {
            seconds: 25,
            msg: [
                players ? `Runner(s): ${players}` : undefined,
                comms ? `Commentator(s): ${comms}` : undefined,
                reader ? `Donation Reader: ${reader}` : undefined,
                screeners ? `Donation Screeners: ${screeners}` : undefined,
                tech ? `Tech Crew: ${tech}` : undefined,
                donators ? `Donators: ${donators}` : undefined,
                subscribers ? `Subscribers: ${subscribers}` : undefined,
                cheers ? `Cheers: ${cheers}` : undefined,
            ].filter(Boolean).join(' --- '),
        },
    });
    // Erase the arrays storing the subscriptions/cheers/donations.
    // TODO: Figure out how to keep them in case the mini credits are cancelled.
    runSubs.length = 0;
    runCheers.length = 0;
    runDonations.length = 0;
});
