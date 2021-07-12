"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeScene = void 0;
const extension_1 = __importDefault(require("@esamarathon/esa-layouts-shared/countdown/extension"));
const clone_1 = __importDefault(require("clone"));
const speedcontrol_util_1 = __importDefault(require("speedcontrol-util"));
const helpers_1 = require("./util/helpers");
const nodecg_1 = require("./util/nodecg");
const obs_1 = __importDefault(require("./util/obs"));
const replicants_1 = require("./util/replicants");
const evtConfig = nodecg_1.get().bundleConfig.event;
const obsConfig = nodecg_1.get().bundleConfig.obs;
const sc = new speedcontrol_util_1.default(nodecg_1.get());
const countdown = new extension_1.default(nodecg_1.get()); // eslint-disable-line @typescript-eslint/no-unused-vars
// Increase max listeners on the nodecg-speedcontrol timer a bit to stop errors.
// This may want to be moved to that bundle directly in the future? It impacts all bundles!
sc.timer.setMaxListeners(20);
// CSS ID -> OBS source name mapping
const obsSourceKeys = {
    GameCapture1: obsConfig.names.sources.gameCapture1,
    GameCapture2: obsConfig.names.sources.gameCapture2,
    GameCapture3: obsConfig.names.sources.gameCapture3,
    GameCapture4: obsConfig.names.sources.gameCapture4,
    CameraCapture1: obsConfig.names.sources.cameraCapture1,
    CameraCapture2: obsConfig.names.sources.cameraCapture2,
    CameraCapture3: obsConfig.names.sources.cameraCapture3,
};
// Controls the name cycling ticks for players/hosts
function cycleNames(reset = false) {
    let cycle = 0;
    if (!reset) {
        cycle = replicants_1.nameCycle.value + 1;
    }
    if (cycle === 0) { // Name
        setTimeout(cycleNames, 45 * 1000);
    }
    else if (cycle === 1) { // Twitch
        setTimeout(cycleNames, 15 * 1000);
    }
    else {
        cycleNames(true);
        return;
    }
    replicants_1.nameCycle.value = cycle;
}
cycleNames(true);
// This code keeps a delayed copy of the timer synced to a delay value from OBS.Ninja.
const timerDelayTO = [];
replicants_1.delayedTimer.value = clone_1.default(sc.timer.value);
replicants_1.currentRunDelay.on('change', (newVal, oldVal) => {
    var _a;
    if (newVal.video !== (oldVal === null || oldVal === void 0 ? void 0 : oldVal.video) && timerDelayTO.length) {
        // Reset delayed timer to the same as normal timer.
        replicants_1.delayedTimer.value = clone_1.default(sc.timer.value);
        // Clear all the irrelevant timeouts currently active.
        const timeouts = [];
        for (let i = 0; i < timerDelayTO.length;) {
            if (timerDelayTO[i] && timerDelayTO[i].delay !== newVal.video) {
                timeouts.push((_a = timerDelayTO.shift()) === null || _a === void 0 ? void 0 : _a.timeout);
            }
            else {
                i += 1;
            }
        }
        timeouts.forEach((timeout) => clearTimeout(timeout));
    }
});
sc.timer.on('change', (val) => {
    const timerFreeze = clone_1.default(val);
    if (replicants_1.currentRunDelay.value.video === 0) {
        replicants_1.delayedTimer.value = timerFreeze;
    }
    else {
        timerDelayTO.push({
            delay: replicants_1.currentRunDelay.value.video,
            timeout: setTimeout(() => { replicants_1.delayedTimer.value = timerFreeze; }, replicants_1.currentRunDelay.value.video),
        });
    }
});
// Update replicant that stores the ID of the upcoming run,
// both on timer stopping, if you somehow have no current run
// (usually if you're at the start of the run list),
// and also via a "force" button on the dashboard.
sc.on('timerStopped', () => {
    replicants_1.upcomingRunID.value = sc.runDataActiveRunSurrounding.value.next || null;
});
sc.runDataActiveRunSurrounding.on('change', (newVal) => {
    if (!newVal.current) {
        replicants_1.upcomingRunID.value = newVal.next || null;
    }
});
nodecg_1.get().listenFor('forceUpcomingRun', (id) => {
    // Check supplied run ID exists in our array.
    const run = sc.runDataArray.value.find((r) => r.id === id);
    replicants_1.upcomingRunID.value = (run === null || run === void 0 ? void 0 : run.id) || null;
});
// Change the game layout based on information supplied via the run data.
let init = false;
sc.runDataActiveRun.on('change', (newVal, oldVal) => {
    // This shouldn't trigger on initial start up, so should only happen on an *actual* run change.
    if (newVal && init) {
        // If there's no old run or we changed to a different run, try to automatically set the layout.
        if (!oldVal || newVal.id !== oldVal.id) {
            const layout = replicants_1.gameLayouts.value.available.find((l) => l.code === newVal.customData.layout);
            replicants_1.gameLayouts.value.selected = layout === null || layout === void 0 ? void 0 : layout.code;
            if (newVal.customData.layout && !layout) {
                nodecg_1.get().log.warn('[Layouts] Run specified game layout with code '
                    + `${newVal.customData.layout} but none available`);
            }
            else if (newVal.customData.layout && layout) {
                nodecg_1.get().log.info(`[Layouts] Game layout changed to ${layout.name} (${layout.code})`);
            }
        }
    }
    else if (!newVal && init) {
        // If the active run is removed, return to selecting "nothing"
        // (graphic will reselect the default).
        delete replicants_1.gameLayouts.value.selected;
    }
    init = true;
});
replicants_1.capturePositions.on('change', async (val) => {
    if ((evtConfig.online && evtConfig.online === 'partial') || !val || !val['game-layout']) {
        return;
    }
    for (const key of Object.keys(obsSourceKeys)) {
        const crop = {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
        };
        // If this is a camera, it may need cropping.
        if (key.includes('Camera') && val['game-layout'][key]) {
            try {
                // Cameras need cropping if not exactly 16:9.
                // Bigger than 16:9 need top/bottom cropping.
                // Smaller than 16:9 need left/right cropping.
                const sceneItemProperties = await obs_1.default.conn.send('GetSceneItemProperties', {
                    'scene-name': obsConfig.names.scenes.gameLayout,
                    item: { name: obsSourceKeys[key] },
                });
                const cameraAR = sceneItemProperties.sourceWidth / sceneItemProperties.sourceHeight;
                const areaAR = val['game-layout'][key].width / val['game-layout'][key].height;
                if (areaAR > cameraAR) {
                    const newHeight = sceneItemProperties.sourceWidth / areaAR;
                    const cropAmount = Math.floor((sceneItemProperties.sourceHeight - newHeight) / 2);
                    crop.top = cropAmount;
                    crop.bottom = cropAmount;
                }
                else if (areaAR < cameraAR) {
                    const newWidth = sceneItemProperties.sourceHeight * areaAR;
                    const cropAmount = Math.floor((sceneItemProperties.sourceWidth - newWidth) / 2);
                    crop.left = cropAmount;
                    crop.right = cropAmount;
                }
            }
            catch (err) {
                nodecg_1.get().log.warn(`[Layouts] Cannot successfuly find camera source to crop [${key}]`);
                nodecg_1.get().log
                    .debug(`[Layouts] Cannot successfuly find camera source to crop [${key}]:`, err);
            }
        }
        try {
            await obs_1.default.configureSceneItem(obsConfig.names.scenes.gameLayout, obsSourceKeys[key], (() => {
                if (key.startsWith('GameCapture')
                    && ['DS-1p', '3DS-1p'].includes(replicants_1.gameLayouts.value.selected || '')) {
                    if (key === 'GameCapture1') {
                        return {
                            x: 0, y: 0, width: 1920, height: 1080,
                        };
                    }
                    return undefined;
                }
                return val['game-layout'][key];
            })(), crop, (() => {
                if (key.startsWith('GameCapture')
                    && ['DS-1p', '3DS-1p'].includes(replicants_1.gameLayouts.value.selected || '')) {
                    if (key === 'GameCapture1') {
                        return true;
                    }
                    return false;
                }
                return !!val['game-layout'][key];
            })());
        }
        catch (err) {
            nodecg_1.get().log.warn(`[Layouts] Cannot successfully configure capture position [${key}]`);
            nodecg_1.get().log.debug(`[Layouts] Cannot successfully configure capture position [${key}]:`, err);
        }
    }
});
// Always disable transitioning when one begins.
obs_1.default.conn.on('TransitionBegin', () => {
    replicants_1.obsData.value.disableTransitioning = true;
});
sc.twitchCommercialTimer.on('change', async (newVal, oldVal) => {
    // Disable transitioning if on commercials scene and seconds are on the commercial timer.
    // Not used for ESA, but used for other events still (like UKSG).
    if (obs_1.default.isCurrentScene(obsConfig.names.scenes.commercials)) {
        replicants_1.obsData.value.disableTransitioning = newVal.secondsRemaining > 0;
    }
    // Switch to the video player scene if there is
    // a selected video when intermission commercials end.
    // Not currently used for ESA, may be used for other events?
    if (oldVal && oldVal.secondsRemaining > 0 && newVal.secondsRemaining <= 0
        && replicants_1.videoPlayer.value.playlist.length
        && obs_1.default.isCurrentScene(obsConfig.names.scenes.commercials)) {
        try {
            await obs_1.default.changeScene(obsConfig.names.scenes.videoPlayer);
            replicants_1.obsData.value.disableTransitioning = true;
        }
        catch (err) {
            nodecg_1.get().log.warn('[Layouts] Could not switch to video player scene'
                + ' after intermission commercials');
            nodecg_1.get().log.debug('[Layouts] Could not switch to video player scene'
                + ' after intermission commercials:', err);
        }
    }
});
let sceneChangeCodeTriggered = 0;
obs_1.default.on('currentSceneChanged', (current, last) => {
    // If switched to video player, disable transitioning.
    if (obs_1.default.isCurrentScene(obsConfig.names.scenes.videoPlayer)) {
        replicants_1.obsData.value.disableTransitioning = true;
        // If we switch from the video player to the intermission while a video is playing.
    }
    else if (last === obs_1.default.findScene(obsConfig.names.scenes.videoPlayer)
        && obs_1.default.isCurrentScene(obsConfig.names.scenes.intermission)) {
        // Tell the video player to stop. Th will only trigger if we didn't trigger
        // the change in the last 2 seconds.
        if (sceneChangeCodeTriggered < (Date.now() - 2000)) {
            nodecg_1.get().sendMessage('endVideoPlayer');
            replicants_1.obsData.value.disableTransitioning = false;
            // Tell transition to stay disabled otherwise.
        }
        else {
            replicants_1.obsData.value.disableTransitioning = true;
        }
        // If the video player is playing and we switch from either video player or intermission,
        // tell the video player to stop.
    }
    else if (replicants_1.videoPlayer.value.playing && !obs_1.default.isCurrentScene(obsConfig.names.scenes.videoPlayer)
        && !obs_1.default.isCurrentScene(obsConfig.names.scenes.intermission)) {
        nodecg_1.get().sendMessage('endVideoPlayer');
        replicants_1.obsData.value.disableTransitioning = false;
    }
    else {
        replicants_1.obsData.value.disableTransitioning = false;
    }
});
nodecg_1.get().listenFor('endVideoPlayer', () => {
    replicants_1.obsData.value.disableTransitioning = false;
});
async function changeScene(scene) {
    sceneChangeCodeTriggered = Date.now();
    await obs_1.default.changeScene(scene);
}
exports.changeScene = changeScene;
nodecg_1.get().listenFor('obsChangeScene', async ({ scene, force = false }) => {
    // Don't change scene if identical, we're currently transitioning, or transitioning is disabled.
    if (replicants_1.obsData.value.scene === scene
        || (!force && (replicants_1.obsData.value.transitioning
            || replicants_1.obsData.value.disableTransitioning))) {
        return;
    }
    try {
        if (replicants_1.currentRunDelay.value.audio === 0
            || (!obs_1.default.isCurrentScene(obsConfig.names.scenes.gameLayout)
                && obs_1.default.findScene(scene) !== obsConfig.names.scenes.gameLayout)) {
            await obs_1.default.changeScene(scene);
            sceneChangeCodeTriggered = Date.now();
        }
        else {
            const delay = replicants_1.currentRunDelay.value.audio;
            replicants_1.obsData.value.disableTransitioning = true;
            replicants_1.obsData.value.transitionTimestamp = Date.now() + delay;
            // Simple server-to-server message we need.
            nodecg_1.get().sendMessage('obsTransitionQueued', scene);
            setTimeout(async () => {
                try {
                    await obs_1.default.changeScene(scene);
                }
                catch (err) {
                    helpers_1.logError('[Layouts] Could not change scene (on delay) [name: %s]', err, scene);
                }
            }, delay);
        }
    }
    catch (err) {
        helpers_1.logError('[Layouts] Could not change scene [name: %s]', err, scene);
    }
});
