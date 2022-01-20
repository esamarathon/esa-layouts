"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startPlaylist = void 0;
const video_player_1 = __importDefault(require("@shared/extension/video-player"));
const uuid_1 = require("uuid");
const helpers_1 = require("./util/helpers");
const mqLogging = __importStar(require("./util/mq-logging"));
const nodecg_1 = require("./util/nodecg");
const obs_1 = __importStar(require("./util/obs"));
const replicants_1 = require("./util/replicants");
const speedcontrol_1 = require("./util/speedcontrol");
const config = (0, nodecg_1.get)().bundleConfig;
const player = new video_player_1.default(config.obs, obs_1.default);
// Reset replicant values on startup.
replicants_1.videoPlayer.value.playing = false;
replicants_1.videoPlayer.value.current = null;
// Helper function that returns a promise once commercials have ended.
async function waitForCommercialEnd() {
    // If we're not on the normal intermission scene when we should be, switch to it!
    if (speedcontrol_1.sc.twitchCommercialTimer.value.secondsRemaining > 2) {
        await (0, obs_1.changeScene)({ scene: config.obs.names.scenes.intermission, force: true });
    }
    return new Promise((res, rej) => {
        if (speedcontrol_1.sc.twitchCommercialTimer.value.secondsRemaining <= 0)
            res();
        else {
            const func = (val) => {
                if (!replicants_1.videoPlayer.value.playing)
                    rej();
                if (val.secondsRemaining <= 0) {
                    res();
                    speedcontrol_1.sc.twitchCommercialTimer.removeListener('change', func);
                }
            };
            speedcontrol_1.sc.twitchCommercialTimer.on('change', func);
        }
    });
}
// Converts our current playlist to shared format.
function generatePlaylist() {
    return replicants_1.videoPlayer.value.playlist.map(({ sum, commercial }) => ({
        id: (0, uuid_1.v4)(),
        video: replicants_1.assetsVideos.value.find((v) => v.sum === sum),
        commercial,
    }));
}
// eslint-disable-next-line import/prefer-default-export
async function startPlaylist() {
    const playlist = generatePlaylist();
    try {
        player.loadPlaylist(playlist);
        replicants_1.videoPlayer.value.playing = true;
        // Switch to correct scene depending on if first element has a video or not.
        if (playlist[0].video) {
            await (0, obs_1.changeScene)({ scene: config.obs.names.scenes.intermissionPlayer });
        }
        else {
            // Does not work if first element is not a video and we're already on the
            // intermission player scene, but waitForCommercialEnd handles that.
            await (0, obs_1.changeScene)({ scene: config.obs.names.scenes.intermission });
        }
        replicants_1.obsData.value.disableTransitioning = true;
        await player.playNext();
        // Calculates when this playlist should end.
        replicants_1.videoPlayer.value.estimatedFinishTimestamp = Date.now()
            + (await player.calculatePlaylistLength() * 1000);
    }
    catch (err) {
        (0, helpers_1.logError)('[Intermission Player] Could not be started', err);
        // Return to the intermission scene if there was an issue starting the playlist.
        await new Promise((res) => { setTimeout(res, 2000); });
        await (0, obs_1.changeScene)({ scene: config.obs.names.scenes.intermission });
    }
}
exports.startPlaylist = startPlaylist;
// Set the upcoming intermission videos.
// TODO: Improve this? (it's very hard to read, but works!)
speedcontrol_1.sc.on('timerStopped', () => {
    const run = speedcontrol_1.sc.getCurrentRun();
    if (run === null || run === void 0 ? void 0 : run.customData.intermission) {
        // Creates a compiled list of what videos should be played and
        // where commercials should be played if needed.
        const splitList = run.customData.intermission.split(',');
        const formattedList = [];
        for (let i = 0; i < splitList.length;) {
            if (splitList[i].startsWith('ad')) {
                const replaceStr = splitList[i].startsWith('adwait') ? 'adwait' : 'ad';
                const commercial = Number(splitList[i].replace(replaceStr, ''));
                if (commercial) {
                    let name;
                    if (!splitList[i].startsWith('adwait')) {
                        name = splitList[i + 1];
                        i += 2;
                    }
                    else {
                        i += 1;
                    }
                    formattedList.push({ name, commercial });
                }
            }
            else {
                formattedList.push({ name: splitList[i], commercial: 0 });
                i += 1;
            }
        }
        // This filters out any items that have no asset *and* no commercial, which are useless.
        replicants_1.videoPlayer.value.playlist = formattedList.reduce((prev, { name, commercial }) => {
            const asset = replicants_1.assetsVideos.value.find((v) => v.name === (name === null || name === void 0 ? void 0 : name.trim()));
            if (asset || commercial)
                prev.push({ sum: asset === null || asset === void 0 ? void 0 : asset.sum, commercial });
            return prev;
        }, []);
        (0, nodecg_1.get)().log.info('[Intermission Player] Automatically set playlist from run data');
    }
});
// RabbitMQ logging thing.
// TODO: Should this be moved?
replicants_1.videoPlayer.on('change', (newVal, oldVal) => {
    if (newVal.current && newVal.current !== (oldVal === null || oldVal === void 0 ? void 0 : oldVal.current)) {
        mqLogging.logVideoPlay(newVal.current);
    }
});
// Used if a user manually switches to the intermission player scene in OBS.
obs_1.default.conn.on('TransitionBegin', (data) => {
    if (obs_1.default.findScene(config.obs.names.scenes.intermissionPlayer) === data['to-scene']
        && !replicants_1.videoPlayer.value.playing) {
        startPlaylist();
    }
});
// Triggered from the intermission player control to stop early.
(0, nodecg_1.get)().listenFor('stopIntermissionPlayerEarly', () => {
    player.endPlaylistEarly();
});
player.on('videoStarted', async (item) => {
    var _a;
    replicants_1.videoPlayer.value.current = ((_a = item.video) === null || _a === void 0 ? void 0 : _a.sum) || null;
    // Change to intermission player scene if needed and not done already.
    if (item.video) {
        await (0, obs_1.changeScene)({ scene: config.obs.names.scenes.intermissionPlayer, force: true });
    }
    else {
        await (0, obs_1.changeScene)({ scene: config.obs.names.scenes.intermission, force: true });
    }
});
player.on('videoEnded', async (item) => {
    // Update video play count.
    if (item.video) {
        if (!replicants_1.videoPlayer.value.plays[item.video.sum]) {
            replicants_1.videoPlayer.value.plays[item.video.sum] = 1;
        }
        else {
            replicants_1.videoPlayer.value.plays[item.video.sum] += 1;
        }
    }
    // Double wrapped try/catch here so if player is stopped
    // during commercials, code stops and does not continue.
    try {
        if (item.commercial)
            await waitForCommercialEnd();
        try {
            await player.playNext();
        }
        catch (err) {
            (0, helpers_1.logError)('[Intermission Player] Could not play next video', err);
            player.endPlaylistEarly();
        }
    }
    catch (err) { /* do nothing */ }
});
player.on('playlistEnded', async (early) => {
    replicants_1.videoPlayer.value.playing = false;
    replicants_1.videoPlayer.value.current = null;
    if (!early)
        replicants_1.videoPlayer.value.playlist.length = 0;
    replicants_1.videoPlayer.value.estimatedFinishTimestamp = 0;
    replicants_1.obsData.value.disableTransitioning = false;
    // Simple server-to-server message we need; currently used for esa-commercials only.
    if (!early)
        (0, nodecg_1.get)().sendMessage('intermissionPlayerFinished');
    await (0, obs_1.changeScene)({ scene: config.obs.names.scenes.intermission, force: true });
});
player.on('playCommercial', async (item) => {
    try {
        await speedcontrol_1.sc.sendMessage('twitchStartCommercial', { duration: item.commercial });
    }
    catch (err) { /* catch */ }
});
