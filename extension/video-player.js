"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopEarly = exports.startPlaylist = void 0;
const clone_1 = __importDefault(require("clone"));
const get_video_duration_1 = require("get-video-duration");
const process_1 = require("process");
const speedcontrol_util_1 = __importDefault(require("speedcontrol-util"));
const layouts_1 = require("./layouts"); // eslint-disable-line import/no-cycle
const logging_1 = require("./util/logging");
const nodecg_1 = require("./util/nodecg");
const obs_1 = __importDefault(require("./util/obs"));
const replicants_1 = require("./util/replicants");
const config = (0, nodecg_1.get)().bundleConfig;
const sc = new speedcontrol_util_1.default((0, nodecg_1.get)());
let index = 0;
let playlist = [];
let currVideo = null;
replicants_1.videoPlayer.value.playing = false;
replicants_1.videoPlayer.value.current = null;
// Set the upcoming intermission videos.
sc.on('timerStopped', () => {
    const run = sc.getCurrentRun();
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
        (0, nodecg_1.get)().log.info('[Video Player] Automatically set playlist from run data');
    }
});
// Move this into below code?
replicants_1.videoPlayer.on('change', (newVal, oldVal) => {
    if (newVal.current && newVal.current !== (oldVal === null || oldVal === void 0 ? void 0 : oldVal.current)) {
        (0, logging_1.logVideoPlay)(newVal.current);
    }
    if (!newVal.playing && (oldVal === null || oldVal === void 0 ? void 0 : oldVal.playing)) {
        // obsData.value.disableTransitioning = false;
    }
});
async function waitForCommercialEnd() {
    if (sc.twitchCommercialTimer.value.secondsRemaining > 2
        && !obs_1.default.isCurrentScene(config.obs.names.scenes.intermission)) {
        await (0, layouts_1.obsChangeScene)({ scene: config.obs.names.scenes.intermission, force: true });
    }
    return new Promise((res, rej) => {
        if (sc.twitchCommercialTimer.value.secondsRemaining <= 0)
            res();
        else {
            const func = (val) => {
                if (!replicants_1.videoPlayer.value.playing) {
                    rej();
                }
                if (val.secondsRemaining <= 0) {
                    res();
                    sc.twitchCommercialTimer.removeListener('change', func);
                }
            };
            sc.twitchCommercialTimer.on('change', func);
        }
    });
}
async function playVideo(video) {
    const source = await obs_1.default.conn.send('GetSourceSettings', {
        sourceName: config.obs.names.sources.videoPlayer,
    });
    const location = `${(0, process_1.cwd)()}/assets/${video.namespace}/${video.category}/${video.base}`;
    if (source.sourceType === 'ffmpeg_source') {
        await obs_1.default.conn.send('SetSourceSettings', {
            sourceName: config.obs.names.sources.videoPlayer,
            sourceSettings: {
                is_local_file: true,
                local_file: location,
                looping: false,
                restart_on_activate: false,
            },
        });
    }
    else if (source.sourceType === 'vlc_source') {
        await obs_1.default.conn.send('SetSourceSettings', {
            sourceName: config.obs.names.sources.videoPlayer,
            sourceSettings: {
                loop: false,
                shuffle: false,
                playback_behavior: 'always_play',
                playlist: [
                    {
                        hidden: false,
                        selected: false,
                        value: location,
                    },
                ],
            },
        });
    }
    else {
        (0, nodecg_1.get)().log.error('[Video Player] No video player source found in OBS to trigger!');
    }
    /* await obs.conn.send('PlayPauseMedia', {
      sourceName: config.obs.names.sources.videoPlayer,
      playPause: false, // Yes, false actually means play.
    }); */
}
async function playNext() {
    try {
        const commercialLength = playlist[index].commercial;
        let commercialSuccess = false;
        if (commercialLength > 0) {
            await waitForCommercialEnd();
            try {
                await sc.sendMessage('twitchStartCommercial', { duration: commercialLength });
                commercialSuccess = true;
            }
            catch (err) { /* err */ }
        }
        const video = replicants_1.assetsVideos.value.find((v) => v.sum === playlist[index].sum);
        replicants_1.videoPlayer.value.current = (video === null || video === void 0 ? void 0 : video.sum) || null;
        if (video) {
            currVideo = (0, clone_1.default)(video);
            if (!obs_1.default.isCurrentScene(config.obs.names.scenes.videoPlayer)) {
                await (0, layouts_1.obsChangeScene)({ scene: config.obs.names.scenes.videoPlayer, force: true });
            }
            // nodecg().sendMessage('playVideo', { url: video.url, ext: video.ext });
            playVideo(video);
        }
        else {
            // This else block happens for both "commercial w/o video" and non-found assets.
            currVideo = null;
            if (commercialLength > 0 && commercialSuccess)
                await waitForCommercialEnd();
            else
                await new Promise((res) => setTimeout(res, 2500));
            videoEnded(); // eslint-disable-line @typescript-eslint/no-use-before-define
        }
    }
    catch (err) {
        // catch
    }
}
async function startPlaylist() {
    replicants_1.obsData.value.disableTransitioning = true;
    replicants_1.videoPlayer.value.playing = true;
    index = 0;
    playlist = (0, clone_1.default)(replicants_1.videoPlayer.value.playlist);
    playNext();
    // Calculating how long the playlist will actually take (estimated).
    let totalLength = 0;
    let leftOverCommercialLength = 0;
    for (const item of playlist) {
        const asset = replicants_1.assetsVideos.value.find((a) => a.sum === item.sum);
        if (asset) {
            let length = 0;
            try {
                length = await (0, get_video_duration_1.getVideoDurationInSeconds)(`${(0, process_1.cwd)()}/assets/${asset.namespace}/${asset.category}/${asset.base}`);
            }
            catch (err) { /* err */ }
            totalLength += length;
            leftOverCommercialLength += item.commercial;
            leftOverCommercialLength = Math.max(leftOverCommercialLength - length, 0);
        }
        else if (item.commercial > 0) {
            totalLength += leftOverCommercialLength + item.commercial;
            leftOverCommercialLength = 0;
        }
    }
    totalLength += leftOverCommercialLength;
    replicants_1.videoPlayer.value.estimatedFinishTimestamp = Date.now() + (totalLength * 1000);
}
exports.startPlaylist = startPlaylist;
function stopPlaylist() {
    index = 0;
    playlist.length = 0;
    currVideo = null;
    replicants_1.videoPlayer.value.playing = false;
    replicants_1.videoPlayer.value.current = null;
    replicants_1.obsData.value.disableTransitioning = false;
}
async function videoEnded() {
    // Update play count if needed.
    if (currVideo) {
        if (!replicants_1.videoPlayer.value.plays[currVideo.sum]) {
            replicants_1.videoPlayer.value.plays[currVideo.sum] = 1;
        }
        else {
            replicants_1.videoPlayer.value.plays[currVideo.sum] += 1;
        }
    }
    if (playlist.length - 1 > index) {
        index += 1;
        playNext();
    }
    else {
        // End of playlist.
        stopPlaylist();
        replicants_1.videoPlayer.value.playlist.length = 0;
        (0, nodecg_1.get)().sendMessage('videoPlayerFinished'); // Simple server-to-server message we need.
        if (!obs_1.default.isCurrentScene(config.obs.names.scenes.intermission)) {
            await (0, layouts_1.obsChangeScene)({ scene: config.obs.names.scenes.intermission, force: true });
        }
    }
}
async function stopEarly() {
    if (replicants_1.videoPlayer.value.playing) {
        stopPlaylist();
        await obs_1.default.conn.send('StopMedia', { sourceName: config.obs.names.sources.videoPlayer });
    }
}
exports.stopEarly = stopEarly;
// Used if a user manually switches to the video player scene in OBS.
(0, nodecg_1.get)().listenFor('startVideoPlayer', async () => {
    const asset = replicants_1.assetsVideos.value.find((v) => { var _a; return v.sum === ((_a = replicants_1.videoPlayer.value.playlist[0]) === null || _a === void 0 ? void 0 : _a.sum); });
    if (!replicants_1.videoPlayer.value.playlist.length || !asset) {
        await new Promise((res) => setTimeout(res, 2 * 1000));
        if (!obs_1.default.isCurrentScene(config.obs.names.scenes.intermission)) {
            await (0, layouts_1.obsChangeScene)({ scene: config.obs.names.scenes.intermission, force: true });
        }
    }
    if (replicants_1.videoPlayer.value.playlist.length) {
        startPlaylist();
    }
});
obs_1.default.conn.on('MediaEnded', (data) => {
    if (data.sourceName === config.obs.names.sources.videoPlayer) {
        videoEnded();
    }
});
// Triggered when a video ends playback in the browser.
// nodecg().listenFor('videoEnded', videoEnded);
// Triggered from the video player control to stop early.
(0, nodecg_1.get)().listenFor('stopVideoPlayerEarly', () => {
    stopEarly();
    if (!obs_1.default.isCurrentScene(config.obs.names.scenes.intermission)) {
        (0, layouts_1.obsChangeScene)({ scene: config.obs.names.scenes.intermission, force: true });
    }
});
