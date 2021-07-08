"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const speedcontrol_util_1 = __importDefault(require("speedcontrol-util"));
const helpers_1 = require("./util/helpers");
const logging_1 = require("./util/logging");
const nodecg_1 = require("./util/nodecg");
const obs_1 = __importDefault(require("./util/obs"));
const rabbitmq_1 = require("./util/rabbitmq");
const replicants_1 = require("./util/replicants");
const config = nodecg_1.get().bundleConfig;
const sc = new speedcontrol_util_1.default(nodecg_1.get());
let ranAdLastTime = false;
setInterval(async () => {
    if (ranAdLastTime) {
        ranAdLastTime = false;
        return;
    }
    const today = new Date();
    const currentMinute = today.getMinutes();
    const run = sc.getCurrentRun();
    if (run && run.externalID && run.externalID === 'BTRLDOOM'
        && [15, 30, 45, 0].includes(currentMinute)) {
        try {
            await sc.sendMessage('twitchStartCommercial', { duration: 60 });
            ranAdLastTime = true;
            nodecg_1.get().log.info('[Misc] Triggered commercial for BTRLDOOM');
        }
        catch (err) {
            nodecg_1.get().log.warn('[Misc] Could not successfully trigger commercial for BTRLDOOM');
            nodecg_1.get().log.debug('[Misc] Could not successfully trigger commercial for BTRLDOOM:', err);
        }
    }
}, 60 * 1000);
// Screened data from our moderation tool.
rabbitmq_1.mq.evt.on('newScreenedSub', (data) => {
    nodecg_1.get().log.debug('[Misc] Received new subscription');
    nodecg_1.get().sendMessage('newSub', data);
});
rabbitmq_1.mq.evt.on('newScreenedTweet', (data) => {
    nodecg_1.get().log.debug('[Misc] Received new tweet');
    nodecg_1.get().sendMessage('newTweet', data);
});
rabbitmq_1.mq.evt.on('newScreenedCheer', (data) => {
    nodecg_1.get().log.debug('[Misc] Received new cheer');
    nodecg_1.get().sendMessage('newCheer', data);
});
rabbitmq_1.mq.evt.on('newScreenedCrowdControl', (data) => {
    if (config.event.thisEvent === 1) {
        nodecg_1.get().log.debug('[Misc] Received new crowd control message');
        nodecg_1.get().sendMessage('newCrowdControl', data);
    }
});
// Information that should come from our 2nd stream.
rabbitmq_1.mq.evt.on('runChanged', (data) => {
    if (helpers_1.getOtherStreamEventShort() === data.event) {
        replicants_1.otherStreamData.value.runData = data.run || null;
        nodecg_1.get().log.debug('[Misc] Received modified run data from other stream');
    }
});
rabbitmq_1.mq.evt.on('gameSceneChanged', (data) => {
    if (helpers_1.getOtherStreamEventShort() === data.event) {
        nodecg_1.get().log.debug('[Misc] Received game scene change from other stream:', data.action);
        if (data.action === 'start') {
            replicants_1.otherStreamData.value.show = true;
        }
        else if (data.action === 'end') {
            replicants_1.otherStreamData.value.show = false;
        }
    }
});
// When someone scans in on one of the big timer buttons.
// Currently only used for commentators.
rabbitmq_1.mq.evt.on('bigbuttonTagScanned', (data) => {
    if (helpers_1.getCurrentEventShort() === data.flagcarrier.group) {
        const name = data.user.displayName;
        nodecg_1.get().sendMessage('bigbuttonTagScanned', data);
        if (!replicants_1.commentators.value.includes(name)) {
            replicants_1.commentators.value.push(name);
            nodecg_1.get().log.debug('[Misc] Added new commentator:', name);
        }
    }
});
let init = false;
sc.runDataActiveRun.on('change', (newVal, oldVal) => {
    // Reset the commentators when the run changes and
    // not on the game layout scene (if OBS is connected).
    if ((oldVal === null || oldVal === void 0 ? void 0 : oldVal.id) !== (newVal === null || newVal === void 0 ? void 0 : newVal.id) && ((!obs_1.default.connected && init) || (obs_1.default.connected
        && !obs_1.default.isCurrentScene(config.obs.names.scenes.gameLayout)))) {
        replicants_1.commentators.value.length = 0;
        nodecg_1.get().log.debug('[Misc] Cleared commentators');
    }
    // This will also be triggered on server start up.
    logging_1.logRunChange(newVal);
    init = true;
});
async function searchSrcomPronouns(val) {
    var _a;
    const name = val.replace(/\((.*?)\)/g, '').trim();
    let pronouns = (_a = (val.match(/\((.*?)\)/g) || [])[0]) === null || _a === void 0 ? void 0 : _a.replace(/[()]/g, '');
    if (!pronouns) {
        const data = await sc.sendMessage('srcomSearchForUserDataMultiple', [
            { type: 'twitch', val: name },
            { type: 'name', val: name },
        ]);
        pronouns = helpers_1.formatPronouns((data === null || data === void 0 ? void 0 : data.pronouns) || '') || '';
    }
    return pronouns ? `${name} (${pronouns})` : name;
}
nodecg_1.get().listenFor('commentatorAdd', async (val, ack) => {
    if (val && !replicants_1.commentators.value.includes(val)) {
        replicants_1.commentators.value.push(await searchSrcomPronouns(val));
    }
    if (ack && !ack.handled) {
        ack(null);
    }
});
nodecg_1.get().listenFor('readerModify', async (val, ack) => {
    if (!val) {
        replicants_1.donationReader.value = null;
    }
    else {
        replicants_1.donationReader.value = await searchSrcomPronouns(val);
    }
    if (ack && !ack.handled) {
        ack(null);
    }
});
// Set the upcoming intermission video.
sc.on('timerStopped', () => {
    const run = sc.getCurrentRun();
    if (run === null || run === void 0 ? void 0 : run.customData.intermission) {
        const videoNames = run.customData.intermission.split(',');
        const assets = videoNames
            .map((n) => replicants_1.assetsVideos.value.find((v) => v.name === n.trim()))
            .filter(Boolean);
        if (assets.length) {
            replicants_1.videoPlayer.value.playlist = assets
                .map((a) => ({ sum: a.sum, commercial: 0 })); // TODO: apply ad lengths
            const successfulVideos = assets.map((a) => a.name).join(', ');
            nodecg_1.get().log.info(`[Misc] Automatically set video player for: ${successfulVideos}`);
        }
        else {
            nodecg_1.get().log.warn('[Misc] Cannot automatically set video player for any:'
                + ` ${videoNames.join(', ')}`);
        }
    }
});
// Switch back to the last scene when the video player finishes.
nodecg_1.get().listenFor('videoPlayerFinished', async () => {
    try {
        await obs_1.default.changeScene(config.obs.names.scenes.intermission);
    }
    catch (err) {
        nodecg_1.get().log.warn('[Misc] Could not return to intermission after video finished');
        nodecg_1.get().log.debug('[Misc] Could not return to intermission after video finished:', err);
    }
});
replicants_1.videoPlayer.on('change', (newVal, oldVal) => {
    if (newVal.current && newVal.current !== (oldVal === null || oldVal === void 0 ? void 0 : oldVal.current)) {
        logging_1.logVideoPlay(newVal.current);
    }
});
