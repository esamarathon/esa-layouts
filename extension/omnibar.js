"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clone_1 = __importDefault(require("clone"));
const lodash_1 = require("lodash");
const path_1 = require("path");
const process_1 = require("process");
const uuid_1 = require("uuid");
const nodecg_1 = require("./util/nodecg");
const obs_1 = __importDefault(require("./util/obs"));
const rabbitmq_1 = require("./util/rabbitmq");
const replicants_1 = require("./util/replicants");
const speedcontrol_1 = require("./util/speedcontrol");
const config = (0, nodecg_1.get)().bundleConfig;
// Temporary storage used for mini credits subscriptions/cheers/alerts while they are playing.
let tempMiniCreditsStorage = {
    runSubs: [],
    runCheers: [],
    runDonations: [],
};
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
                    user: data === null || data === void 0 ? void 0 : data.user,
                    // MiniCredits
                    players: data === null || data === void 0 ? void 0 : data.players,
                    comms: data === null || data === void 0 ? void 0 : data.comms,
                    reader: data === null || data === void 0 ? void 0 : data.reader,
                    screeners: data === null || data === void 0 ? void 0 : data.screeners,
                    tech: data === null || data === void 0 ? void 0 : data.tech,
                    donators: data === null || data === void 0 ? void 0 : data.donators,
                    subscribers: data === null || data === void 0 ? void 0 : data.subscribers,
                    cheers: data === null || data === void 0 ? void 0 : data.cheers,
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
    var _a;
    // If omnibar was just showing mini credits and ended successfully, erase temp storage.
    if (((_a = replicants_1.omnibar.value.current) === null || _a === void 0 ? void 0 : _a.type) === 'MiniCredits') {
        tempMiniCreditsStorage = { runSubs: [], runCheers: [], runDonations: [] };
    }
    showNext();
    if (ack && !(ack === null || ack === void 0 ? void 0 : ack.handled))
        ack();
});
// Listens for messages from the graphic to play the "donation" SFX via OBS source.
(0, nodecg_1.get)().listenFor('omnibarPlaySound', async (data, ack) => {
    if (config.obs.enabled && obs_1.default.connected) {
        try {
            (0, nodecg_1.get)().log.debug('omnibarPlaySound called with amount %s', (data === null || data === void 0 ? void 0 : data.amount) || 'none');
            const alert = (0, lodash_1.orderBy)(replicants_1.donationAlerts.value, (v) => v.threshold, 'desc')
                .find((v) => { var _a; return v.threshold <= ((_a = data === null || data === void 0 ? void 0 : data.amount) !== null && _a !== void 0 ? _a : 0); });
            const asset = replicants_1.assetsDonationAlertAssets.value.find((a) => alert && a.name === (alert === null || alert === void 0 ? void 0 : alert.sound));
            (0, nodecg_1.get)().log.debug('[Omnibar] omnibarPlaySound called, alert %s, asset %s', (alert === null || alert === void 0 ? void 0 : alert.sound) || 'not found', (asset === null || asset === void 0 ? void 0 : asset.name) || 'not found');
            if (alert && asset) {
                const source = await obs_1.default.conn.send('GetSourceSettings', {
                    sourceName: config.obs.names.sources.donationSound,
                });
                (0, nodecg_1.get)().log.debug('[Omnibar] omnibarPlaySound OBS source found');
                const location = (0, path_1.join)((0, process_1.cwd)(), `assets/${asset.namespace}/${asset.category}/${asset.base}`);
                (0, nodecg_1.get)().log.debug('[Omnibar] omnibarPlaySound location of sound:', location);
                // Set volume of source.
                await obs_1.default.conn.send('SetVolume', {
                    source: config.obs.names.sources.donationSound,
                    volume: Math.min(alert.volume, 0),
                    useDecibel: true,
                });
                (0, nodecg_1.get)().log.debug('[Omnibar] omnibarPlaySound volume set to %s', Math.min(alert.volume, 0));
                // File is the same as before, just restart it.
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if (source.sourceSettings.local_file === location) {
                    await obs_1.default.conn.send('RestartMedia', {
                        sourceName: config.obs.names.sources.donationSound,
                    });
                    (0, nodecg_1.get)().log.debug('[Omnibar] omnibarPlaySound media restarted');
                    // If different, explicitily set it. This also starts the playback.
                }
                else {
                    await obs_1.default.conn.send('SetSourceSettings', {
                        sourceName: config.obs.names.sources.donationSound,
                        sourceSettings: {
                            is_local_file: true,
                            local_file: location,
                            looping: false,
                            restart_on_active: false,
                        },
                    });
                    (0, nodecg_1.get)().log.debug('[Omnibar] omnibarPlaySound source settings set');
                }
            }
        }
        catch (err) {
            (0, nodecg_1.get)().log.error('[Omnibar] omnibarPlaySound error:', err);
        }
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
    const overriddenTypes = data; // TODO: Update MQ event!
    replicants_1.omnibar.value.miniCredits.runSubs.push((0, clone_1.default)(overriddenTypes));
});
rabbitmq_1.mq.evt.on('newScreenedCheer', (data) => {
    const overriddenTypes = data;
    replicants_1.omnibar.value.miniCredits.runCheers.push((0, clone_1.default)(overriddenTypes));
});
rabbitmq_1.mq.evt.on('donationFullyProcessedStream', (data) => {
    const overriddenTypes = data;
    replicants_1.omnibar.value.miniCredits.runDonations.push((0, clone_1.default)(overriddenTypes));
});
// Fully processed donations for donations targeted towards the main campaign.
// We only listen for this on stream 1.
if (config.event.thisEvent === 1) {
    rabbitmq_1.mq.evt.on('donationFullyProcessedTeam', (data) => {
        const overriddenTypes = data;
        replicants_1.omnibar.value.miniCredits.runDonations.push((0, clone_1.default)(overriddenTypes));
    });
}
// Pushes our "mini credits" to the alert queue.
speedcontrol_1.sc.on('timerStopped', () => {
    var _a, _b;
    if (config.event.shorts === 'swcf')
        return;
    (0, nodecg_1.get)().log.debug('[Omnibar] Timer stopped, generating mini credits');
    // If there's any credits in the queue, removes them.
    const oldCreditsIndex = replicants_1.omnibar.value.alertQueue.findIndex((a) => a.type === 'MiniCredits');
    if (oldCreditsIndex >= 0)
        replicants_1.omnibar.value.alertQueue.splice(oldCreditsIndex, 1);
    // If the current omnibar message is already mini credits, also remove those.
    if (((_a = replicants_1.omnibar.value.current) === null || _a === void 0 ? void 0 : _a.type) === 'MiniCredits') {
        showNext();
    }
    // Adds the collected subscriptions/cheers/donations in a local object.
    // These arrays will be empty if the last mini credits were ran successfully.
    tempMiniCreditsStorage.runSubs.push(...(0, clone_1.default)(replicants_1.omnibar.value.miniCredits.runSubs));
    tempMiniCreditsStorage.runCheers.push(...(0, clone_1.default)(replicants_1.omnibar.value.miniCredits.runCheers));
    tempMiniCreditsStorage.runDonations.push(...(0, clone_1.default)(replicants_1.omnibar.value.miniCredits.runDonations));
    // Erase the ones stored in the replicant.
    replicants_1.omnibar.value.miniCredits = { runSubs: [], runCheers: [], runDonations: [] };
    // Collect all information needed.
    const { runSubs, runCheers, runDonations } = tempMiniCreditsStorage;
    const run = speedcontrol_1.sc.getRunDataArray().find((r) => { var _a; return r.id === ((_a = speedcontrol_1.sc.runDataActiveRun.value) === null || _a === void 0 ? void 0 : _a.id); });
    const players = run
        ? run.teams.reduce((prev, team) => {
            prev.push(...team.players.map((p) => p.name));
            return prev;
        }, [])
        : undefined;
    const comms = replicants_1.commentatorsNew.value.length
        ? replicants_1.commentatorsNew.value.map((c) => c.name)
        : undefined;
    const reader = (_b = replicants_1.donationReaderNew.value) === null || _b === void 0 ? void 0 : _b.name;
    const donators = runDonations.length
        ? (0, lodash_1.orderBy)(// Groups donation totals amounts by name and sorts descending.
        Object.entries(runDonations.reduce((prev, curr) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const current = curr;
            const obj = prev;
            if (!obj[current.donor_visiblename])
                obj[current.donor_visiblename] = 0;
            obj[current.donor_visiblename] += Number(curr.amount);
            return obj;
        }, {})).filter(([, v]) => v > 0), ([, v]) => v, 'desc')
        : undefined;
    const subscribers = runSubs.length // TODO: Update MQ event, change subgifts logic!
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // ? runSubs.map((s) => (s as unknown as { [k: string]: any }).user.displayName)
        ? (0, lodash_1.orderBy)(// Groups subs/giftsub bombs by name, counts them and sorts descending.
        Object.entries(runSubs.reduce((prev, curr) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const current = curr;
            const obj = prev;
            if (!obj[current.user.displayName]) {
                obj[current.user.displayName] = 0;
            }
            obj[current.user.displayName] += 1;
            return obj;
        }, {})).filter(([, v]) => v > 0), ([, v]) => v, 'desc')
        : undefined;
    const cheers = runCheers.length
        ? (0, lodash_1.orderBy)(// Groups cheer amounts by name and sorts descending.
        Object.entries(runCheers.reduce((prev, curr) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const current = curr;
            const obj = prev;
            if (!obj[current.message.tags['display-name']]) {
                obj[current.message.tags['display-name']] = 0;
            }
            obj[current.message.tags['display-name']] += Number(current.message.tags.bits);
            return obj;
        }, {})).filter(([, v]) => v > 0), ([, v]) => v, 'desc')
        : undefined;
    // DISABLED FOR NOW (ESAW24).
    // Push actual data to the queue.
    /* omnibar.value.alertQueue.push({
      type: 'MiniCredits',
      id: uuid(),
      data: {
        seconds: 25,
        players,
        comms,
        reader,
        screeners: config.omnibar?.miniCredits?.screeners,
        tech: config.omnibar?.miniCredits?.tech,
        donators,
        subscribers,
        cheers,
      },
    }); */
});
