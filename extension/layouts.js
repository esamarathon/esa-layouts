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
const xkeys_1 = __importDefault(require("./util/xkeys"));
const config = (0, nodecg_1.get)().bundleConfig;
new countdown_1.default((0, nodecg_1.get)()); // eslint-disable-line no-new
const gameCaptures = Array.isArray(config.obs.names.groups.gameCaptures)
    ? config.obs.names.groups.gameCaptures
    : [config.obs.names.groups.gameCaptures];
const cameraCaptures = Array.isArray(config.obs.names.groups.cameraCaptures)
    ? config.obs.names.groups.cameraCaptures
    : [config.obs.names.groups.cameraCaptures];
const gameSources = Array.isArray(config.obs.names.sources.gameSources)
    ? config.obs.names.sources.gameSources
    : [config.obs.names.sources.gameSources];
const cameraSources = Array.isArray(config.obs.names.sources.cameraSources)
    ? config.obs.names.sources.cameraSources
    : [config.obs.names.sources.cameraSources];
// CSS ID -> OBS source name mapping
const obsSourceKeys = {
    GameCapture1: gameCaptures[0],
    GameCapture2: gameCaptures[1],
    GameCapture3: gameCaptures[2],
    GameCapture4: gameCaptures[3],
    CameraCapture1: cameraCaptures[0],
    CameraCapture2: cameraCaptures[1],
    CameraCapture3: cameraCaptures[2],
    CameraCapture4: cameraCaptures[3],
    CameraCaptureCrowd: config.obs.names.sources.cameraSourceCrowd || undefined,
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
// Hardcoded (for now) sets of keys to use for sources/groups/cropping for XKeys panel.
const gameCaptureKeys = [61, 62, 63, 64];
const gameSourceKeys = [69, 70, 71, 72];
const gameCropKeys = [77, 78, 79, 80];
const gameCropResetKeys = { selected: 76, all: 68 };
const gameCropValues = Array(gameCaptures.length).fill({ top: 0, right: 0, bottom: 0, left: 0 });
const cameraCaptureKeys = [49, 57, 65, 73];
const cameraSourceKeys = [50, 58, 66, 74];
const selected = {
    gameCapture: -1,
    gameSource: Array(gameCaptures.length).fill(-1),
    gameCrop: -1,
    cameraCapture: -1,
    cameraSource: -1,
};
obs_1.default.conn.on('ConnectionOpened', async () => {
    for (const capName of gameCaptures) {
        // Gets cropping values and stores them on initial connection.
        try {
            const itemProperties = await obs_1.default.conn.send('GetSceneItemProperties', {
                'scene-name': config.obs.names.scenes.gameLayout,
                item: { name: capName },
            });
            gameCropValues[gameCaptures.indexOf(capName)] = itemProperties.crop;
        }
        catch (err) {
            // TODO: Log!
        }
        // Gets rack selection value and stores it on initial connection.
        for (const sourceName of gameSources) {
            try {
                const itemProperties = await obs_1.default.conn.send('GetSceneItemProperties', {
                    'scene-name': capName,
                    item: { name: sourceName },
                });
                if (itemProperties.visible) {
                    selected.gameSource[gameCaptures.indexOf(capName)] = gameSources.indexOf(sourceName);
                }
            }
            catch (err) {
                // TODO: Log!
            }
        }
    }
});
function calculateCrop(side, position) {
    let amount = side + position;
    if (amount < 0)
        amount = 0;
    return amount;
}
async function changeCrop(value) {
    const capture = selected.gameCapture;
    if (value && selected.gameCrop >= 0) {
        switch (selected.gameCrop) {
            case 0:
                gameCropValues[capture].top = calculateCrop(gameCropValues[capture].top, value);
                break;
            case 1:
                gameCropValues[capture].right = calculateCrop(gameCropValues[capture].right, value);
                break;
            case 2:
                gameCropValues[capture].bottom = calculateCrop(gameCropValues[capture].bottom, value);
                break;
            case 3:
                gameCropValues[capture].left = calculateCrop(gameCropValues[capture].left, value);
                break;
            default:
            // nothing
        }
        // If no value is supplied, reset the cropping instead.
    }
    else {
        gameCropValues[capture] = { top: 0, right: 0, bottom: 0, left: 0 };
    }
    try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore: Typings say we need to specify more than we actually do.
        await obs_1.default.conn.send('SetSceneItemProperties', {
            'scene-name': config.obs.names.scenes.gameLayout,
            item: { name: gameCaptures[selected.gameCapture] },
            crop: gameCropValues[capture],
        });
    }
    catch (err) {
        // TODO: Log!
    }
}
xkeys_1.default.on('down', async (keyIndex) => {
    // A Game Capture key was pressed.
    if (gameCaptureKeys.includes(keyIndex)) {
        const capture = gameCaptureKeys.indexOf(keyIndex);
        // If capture has been changed.
        if (capture !== selected.gameCapture) {
            // Turn old key off, turn new key on.
            xkeys_1.default.setBacklight(gameCaptureKeys[selected.gameCapture], false);
            xkeys_1.default.setBacklight(gameCaptureKeys[capture], true, true);
            // Make relevant source keys blink, except the currently selected one.
            gameSourceKeys.forEach((key) => {
                if (key === gameSourceKeys[selected.gameSource[capture]]) {
                    xkeys_1.default.setBacklight(key, true, true);
                }
                else {
                    xkeys_1.default.setBacklight(key, true, false, true);
                }
            });
            // Make cropping keys blink.
            gameCropKeys.forEach((key) => {
                xkeys_1.default.setBacklight(key, true, false, true);
            });
            // Set new key as current.
            selected.gameCapture = capture;
        }
        else {
            // Turn off capture key.
            xkeys_1.default.setBacklight(gameCaptureKeys[capture], false);
            // Turn off source keys.
            gameSourceKeys.forEach((key) => {
                xkeys_1.default.setBacklight(key, false);
            });
            // Turn off crop keys.
            gameCropKeys.forEach((key) => {
                xkeys_1.default.setBacklight(key, false);
            });
            // Unset game capture/cropping.
            // Source values not removed; kept in memory for future use.
            selected.gameCapture = -1;
            selected.gameCrop = -1;
        }
        // A Game Source key was pressed and a Capture is selected.
    }
    else if (gameSourceKeys.includes(keyIndex) && selected.gameCapture >= 0) {
        const source = gameSourceKeys.indexOf(keyIndex);
        // If source has been changed.
        if (source !== selected.gameSource[selected.gameCapture]) {
            // Make relevant source keys blink, except the newly selected one.
            gameSourceKeys.forEach((key) => {
                if (key === gameSourceKeys[source]) {
                    xkeys_1.default.setBacklight(key, true, true);
                }
                else {
                    xkeys_1.default.setBacklight(key, true, false, true);
                }
            });
            // Loops through the sources and toggles their visibility for the selected capture.
            for (const name of config.obs.names.sources.gameSources) {
                try {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore: Typings say we need to specify more than we actually do.
                    await obs_1.default.conn.send('SetSceneItemProperties', {
                        'scene-name': gameCaptures[selected.gameCapture],
                        item: { name },
                        visible: config.obs.names.sources.gameSources.indexOf(name) === source,
                    });
                }
                catch (err) {
                    // TODO: Log!
                }
            }
            // Set new as current.
            selected.gameSource[selected.gameCapture] = source;
        }
        // A Game Cropping key was pressed and a Capture is selected.
    }
    else if (gameCropKeys.includes(keyIndex) && selected.gameCapture >= 0) {
        const side = gameCropKeys.indexOf(keyIndex);
        // If side has been changed.
        if (side !== selected.gameCrop) {
            // Make relevant crop keys blink, except the newly selected one.
            gameCropKeys.forEach((key) => {
                if (key === gameCropKeys[side]) {
                    xkeys_1.default.setBacklight(key, true, true);
                }
                else {
                    xkeys_1.default.setBacklight(key, true, false, true);
                }
            });
            // Set new crop side as current.
            selected.gameCrop = side;
        }
        else {
            // Make this key go back to just blinking.
            xkeys_1.default.setBacklight(gameCropKeys[side], true, false, true);
            // Unset game cropping.
            selected.gameCrop = -1;
        }
        // The button to reset cropping on selected capture was pressed and a Capture is selected.
    }
    else if (gameCropResetKeys.selected === keyIndex && selected.gameCapture >= 0) {
        // Turn on backlight while key is held down.
        xkeys_1.default.setBacklight(keyIndex, true, true);
        await changeCrop();
    }
    // TODO: Reset cropping on *all* captures button.
});
xkeys_1.default.on('up', (keyIndex) => {
    // Turns off "reset selected capture" cropping button.
    if (keyIndex === gameCropResetKeys.selected) {
        xkeys_1.default.setBacklight(keyIndex, false);
    }
});
xkeys_1.default.on('jog', async (index, position) => {
    if (selected.gameCrop >= 0) {
        await changeCrop(position);
    }
});
let shuttleInterval;
let currShuttlePos = 0; // Stores current shuttle position for use by other functions
xkeys_1.default.on('shuttle', (index, position) => {
    if (selected.gameCrop >= 0) {
        // If returned to 0, clear interval.
        if (position === 0 && shuttleInterval) {
            clearInterval(shuttleInterval);
            // If was at one and has now turned, start the 100ms interval.
            // This then runs the crop function every 100ms with the current position
            // at that time until the shuttle is returned to 0.
        }
        else if (currShuttlePos === 0 && position !== 0) {
            shuttleInterval = setInterval(async () => {
                await changeCrop(currShuttlePos);
            }, 100);
        }
    }
    currShuttlePos = position;
});
