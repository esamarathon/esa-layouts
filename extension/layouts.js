"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const countdown_1 = __importDefault(require("@shared/extension/countdown"));
const helpers_1 = require("./util/helpers");
const nodecg_1 = require("./util/nodecg");
const obs_1 = __importDefault(require("./util/obs"));
const replicants_1 = require("./util/replicants");
const speedcontrol_1 = require("./util/speedcontrol");
const config = (0, nodecg_1.get)().bundleConfig;
new countdown_1.default((0, nodecg_1.get)()); // eslint-disable-line no-new
// CSS ID -> OBS source name mapping
const gameCaptures = Array.isArray(config.obs.names.sources.gameCaptures)
    ? config.obs.names.sources.gameCaptures
    : [config.obs.names.sources.gameCaptures];
const cameraCaptures = Array.isArray(config.obs.names.sources.cameraCaptures)
    ? config.obs.names.sources.cameraCaptures
    : [config.obs.names.sources.cameraCaptures];
const obsSourceKeys = {
    GameCapture1: gameCaptures[0],
    GameCapture2: gameCaptures[1],
    GameCapture3: gameCaptures[2],
    GameCapture4: gameCaptures[3],
    CameraCapture1: cameraCaptures[0],
    CameraCapture2: cameraCaptures[1],
    CameraCapture3: cameraCaptures[2],
};
// Controls the name cycling ticks for user information.
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
// Change the game layout based on information supplied via the run data.
let layoutInit = false;
speedcontrol_1.sc.runDataActiveRun.on('change', (newVal, oldVal) => {
    // This shouldn't trigger on initial start up, so should only happen on an *actual* run change.
    if (newVal && layoutInit) {
        // If there's no old run or we changed to a different run, try to automatically set the layout.
        if (!oldVal || newVal.id !== oldVal.id) {
            const layout = replicants_1.gameLayouts.value.available
                .find((l) => { var _a; return l.code.toLowerCase() === ((_a = newVal.customData.layout) === null || _a === void 0 ? void 0 : _a.toLowerCase()); });
            replicants_1.gameLayouts.value.selected = layout === null || layout === void 0 ? void 0 : layout.code;
            if (newVal.customData.layout && !layout) {
                (0, nodecg_1.get)().log.warn('[Layouts] Run specified game layout with code %s but none available', newVal.customData.layout);
            }
            else if (newVal.customData.layout && layout) {
                (0, nodecg_1.get)().log.info(`[Layouts] Game layout changed to ${layout.name} (${layout.code})`);
            }
        }
    }
    else if (!newVal && layoutInit) {
        // If the active run is removed, return to selecting "nothing"
        // (graphic will reselect the default).
        delete replicants_1.gameLayouts.value.selected;
    }
    layoutInit = true;
});
// Listens to the replicant that stores the "capture positions" for various graphics
// sent by the browser (as of writing, only game-layout), to know where to move OBS items.
let positionsInit = false;
replicants_1.capturePositions.on('change', async (val) => {
    // Ignore first emitted event on start up.
    if (!positionsInit) {
        positionsInit = true;
        return;
    }
    // Don't run if OBS integration is disabled or we are not connected.
    if (!config.obs.enabled || !obs_1.default.connected)
        return;
    // Don't run this code at all if only on "partial" online support
    // or there's no game-layout values.
    if (config.event.online === 'partial' || !val['game-layout'])
        return;
    // Loops through all possible sources to move and does the work.
    for (const [key, value] of Object.entries(obsSourceKeys)) {
        if (value) { // Only continue if key -> value pair is set
            const crop = { top: 0, right: 0, bottom: 0, left: 0 }; // Default crop values
            // If this is a camera, it may need cropping.
            if (key.includes('Camera') && val['game-layout'][key]) {
                try {
                    // Cameras need cropping if not exactly 16:9.
                    // Widerneed top/bottom cropping.
                    // Thinner need left/right cropping.
                    const sceneItemProperties = await obs_1.default.conn.send('GetSceneItemProperties', {
                        'scene-name': config.obs.names.scenes.gameLayout,
                        item: { name: value },
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
                    (0, helpers_1.logError)('[Layouts] Cannot find camera source to crop [%s]', err, key);
                }
            }
            try {
                // Special game capture source cropping for sm64-psp-2p game layout.
                if (['GameCapture1', 'GameCapture2'].includes(key)
                    && replicants_1.gameLayouts.value.selected === 'sm64-psp-2p') {
                    const sceneItemProperties = await obs_1.default.conn.send('GetSceneItemProperties', {
                        'scene-name': config.obs.names.scenes.gameLayout,
                        item: { name: value },
                    });
                    crop.right = key === 'GameCapture1' ? sceneItemProperties.sourceWidth / 2 : 0;
                    crop.left = key === 'GameCapture2' ? sceneItemProperties.sourceWidth / 2 : 0;
                }
                await obs_1.default.configureSceneItem(config.obs.names.scenes.gameLayout, // Scene
                value, // Item
                (() => {
                    // Special game capture settings for DS-1p, 3DS-1p and sm64-psp-2p when online.
                    if (config.event.online && key.startsWith('GameCapture')
                        && ['DS-1p', '3DS-1p', 'sm64-psp-2p'].includes(replicants_1.gameLayouts.value.selected || '')) {
                        // sm64-psp-2p.
                        if (replicants_1.gameLayouts.value.selected === 'sm64-psp-2p'
                            && ['GameCapture1', 'GameCapture2'].includes(key)) {
                            return {
                                x: key === 'GameCapture2' ? config.obs.canvasResolution.width / 2 : 0,
                                y: 0,
                                width: config.obs.canvasResolution.width / 2,
                                height: config.obs.canvasResolution.height,
                            };
                        }
                        // All others.
                        if (key === 'GameCapture1') {
                            return {
                                x: 0,
                                y: 0,
                                width: config.obs.canvasResolution.width,
                                height: config.obs.canvasResolution.height,
                            };
                        }
                        return undefined;
                    }
                    return val['game-layout'][key];
                })(), crop, // Crop
                (() => {
                    // Special game capture settings for DS-1p, 3DS-1p and sm64-psp-2p when online.
                    if (config.event.online && key.startsWith('GameCapture')
                        && ['DS-1p', '3DS-1p', 'sm64-psp-2p'].includes(replicants_1.gameLayouts.value.selected || '')) {
                        if (key === 'GameCapture1')
                            return true;
                        if (key === 'GameCapture2' && replicants_1.gameLayouts.value.selected === 'sm64-psp-2p') {
                            return true;
                        }
                        return false;
                    }
                    return !!val['game-layout'][key];
                })());
            }
            catch (err) {
                (0, helpers_1.logError)('[Layouts] Cannot successfully configure capture position [%s]', err, key);
            }
        }
    }
});
