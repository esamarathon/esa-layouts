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
// Hardcoded (for now) sets of keys to use for sources/groups/cropping for XKeys panel.
const gameCaptureKeys = [61, 62, 63, 64];
const gameSourceKeys = [69, 70, 71, 72];
const gameCropKeys = [77, 78, 79, 80];
const gameCropResetKeys = { selected: 76, all: 68 };
const cameraCaptureKeys = [13, 14, 15, 16];
const cameraSourceKeys = [5, 6, 7, 8];
const cameraPositionResetKey = 24;
// Stores current cropping values.
const gameCropValues = Array(gameCaptures.length)
    .fill({ top: 0, right: 0, bottom: 0, left: 0 });
const cameraCropValues = Array(cameraCaptures.length)
    .fill({ top: 0, right: 0, bottom: 0, left: 0 });
let currShuttlePos = 0; // Stores current shuttle position for use by other functions
// Things that are currently "selected", mostly used by XKeys for backlights.
const selected = {
    gameCapture: -1,
    gameSource: Array(gameCaptures.length).fill(-1),
    gameCrop: -1,
    cameraCapture: -1,
    cameraSource: Array(cameraCaptures.length).fill(-1),
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
            let crop = { top: 0, right: 0, bottom: 0, left: 0 }; // Default crop values
            // If this a game capture, use cropping we have stored.
            if (key.includes('Game')) {
                const index = gameCaptures.indexOf(value);
                crop = gameCropValues[index];
            }
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
                    (0, helpers_1.logError)('[Layouts] Could not find camera source to crop [%s]', err, key);
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
                    crop = {
                        top: 0,
                        right: key === 'GameCapture1' ? sceneItemProperties.sourceWidth / 2 : 0,
                        bottom: 0,
                        left: key === 'GameCapture2' ? sceneItemProperties.sourceWidth / 2 : 0,
                    };
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
                (0, helpers_1.logError)('[Layouts] Could not successfully configure capture position [%s]', err, key);
            }
        }
    }
});
// Things to do on OBS initial connection/authentication.
// This should also trigger even if authentication is turned off, after initial connection.
obs_1.default.conn.on('AuthenticationSuccess', async () => {
    // Game
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
            (0, helpers_1.logError)('[Layouts] Could not get initial game capture cropping values [%s]', err, capName);
        }
        // Gets source visibility value and stores it on initial connection.
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
                (0, helpers_1.logError)('[Layouts] Could not get initial game source visibility values [%s: %s]', err, capName, sourceName);
            }
        }
    }
    // Camera
    for (const camName of cameraCaptures) {
        // Gets cropping values and stores them on initial connection.
        try {
            const itemProperties = await obs_1.default.conn.send('GetSceneItemProperties', {
                'scene-name': config.obs.names.scenes.gameLayout,
                item: { name: camName },
            });
            cameraCropValues[cameraCaptures.indexOf(camName)] = itemProperties.crop;
        }
        catch (err) {
            (0, helpers_1.logError)('[Layouts] Could not get initial camera capture cropping values [%s]', err, camName);
        }
        // Gets source visibility value and stores it on initial connection.
        for (const sourceName of cameraSources) {
            try {
                const itemProperties = await obs_1.default.conn.send('GetSceneItemProperties', {
                    'scene-name': camName,
                    item: { name: sourceName },
                });
                if (itemProperties.visible) {
                    selected.cameraSource[cameraCaptures.indexOf(camName)] = cameraSources
                        .indexOf(sourceName);
                }
            }
            catch (err) {
                (0, helpers_1.logError)('[Layouts] Could not get initial camera source visibility values [%s: %s]', err, camName, sourceName);
            }
        }
    }
});
/**
 * Turns of all button lights and functionality.
 */
function clearAllKeys() {
    // Turn off capture keys.
    xkeys_1.default.setBacklight(gameCaptureKeys[selected.gameCapture], false);
    xkeys_1.default.setBacklight(cameraCaptureKeys[selected.cameraCapture], false);
    // Turn off all other keys.
    gameSourceKeys.concat(gameCropKeys, cameraSourceKeys).forEach((key) => {
        xkeys_1.default.setBacklight(key, false);
    });
    selected.gameCapture = -1;
    selected.gameCrop = -1;
    selected.cameraCapture = -1;
}
/**
 * Sets up a timer to turn off the button lights and functionality after 30s,
 * if no other keys are pressed.
 */
let captureTO;
function setupIdleTimeout() {
    if (captureTO)
        clearTimeout(captureTO);
    captureTO = setTimeout(() => { clearAllKeys(); }, 30 * 1000);
}
/**
 * Helper function to calculate game crop used below to calculate overall crop value for a source.
 * @param side Crop amount already applied.
 * @param value Amount to crop, usually from the position of the jog/shutter.
 * @returns Calculated value.
 */
function calculateGameCrop(side, value) {
    let amount = side + value;
    if (amount < 0)
        amount = 0;
    return amount;
}
/**
 * Helper function to calculate camera crop used below to calculate overall crop value for a source.
 * @param aCurrent Cropping amount for top/left already applied.
 * @param bCurrent Cropping amount for bottom/right already applied.
 * @param value Amount to crop, usually from the position of the jog/shutter.
 * @returns Calculated value.
 */
function calculateCameraCrop(aCurrent, bCurrent, value) {
    // Work out the cropping values.
    let aCrop = aCurrent + value;
    let bCrop = bCurrent - value;
    // Cap the cropping values if they went negative.
    if (aCrop < 0) {
        bCrop += aCrop;
        aCrop = 0;
    }
    else if (bCrop < 0) {
        aCrop += bCrop;
        bCrop = 0;
    }
    return [aCrop, bCrop];
}
/**
 * Calculates and applies the cropping for a group when ran.
 * @param value Amount to crop from the selected slide.
 * @param cap Override the capture that is cropped.
 */
async function changeCrop(value, cap) {
    const mode = selected.gameCrop >= 0 ? 'game' : 'camera';
    let capture;
    if (mode === 'game') {
        capture = selected.gameCapture >= 0 ? selected.gameCapture : cap;
        if (typeof capture === 'undefined' || capture < 0)
            return;
        if (value && selected.gameCrop >= 0) {
            switch (selected.gameCrop) {
                case 0:
                    gameCropValues[capture].top = calculateGameCrop(gameCropValues[capture].top, value);
                    break;
                case 1:
                    gameCropValues[capture].right = calculateGameCrop(gameCropValues[capture].right, value);
                    break;
                case 2:
                    gameCropValues[capture].bottom = calculateGameCrop(gameCropValues[capture].bottom, value);
                    break;
                case 3:
                    gameCropValues[capture].left = calculateGameCrop(gameCropValues[capture].left, value);
                    break;
                default:
                // nothing
            }
            // If no value is supplied, reset the cropping instead.
        }
        else {
            gameCropValues[capture] = { top: 0, right: 0, bottom: 0, left: 0 };
        }
    }
    else if (mode === 'camera') {
        capture = selected.cameraCapture >= 0 ? selected.cameraCapture : cap;
        if (value && typeof capture !== 'undefined' && capture >= 0) {
            const crop = cameraCropValues[selected.cameraCapture];
            // Top/bottom cropping.
            if (crop.top > 0 || crop.bottom > 0) {
                const croppingValues = calculateCameraCrop(crop.top, crop.bottom, value);
                [
                    cameraCropValues[selected.cameraCapture].top,
                    cameraCropValues[selected.cameraCapture].bottom,
                ] = croppingValues;
            }
            // Left/right cropping.
            if (crop.left > 0 || crop.right > 0) {
                const croppingValues = calculateCameraCrop(crop.left, crop.right, value);
                [
                    cameraCropValues[selected.cameraCapture].left,
                    cameraCropValues[selected.cameraCapture].right,
                ] = croppingValues;
            }
        }
    }
    if (typeof capture === 'undefined' || capture < 0)
        return;
    const captures = mode === 'game' ? gameCaptures : cameraCaptures;
    const cropValues = mode === 'game' ? gameCropValues : cameraCropValues;
    try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore: Typings say we need to specify more than we actually do.
        await obs_1.default.conn.send('SetSceneItemProperties', {
            'scene-name': config.obs.names.scenes.gameLayout,
            item: { name: captures[capture] },
            crop: cropValues[capture],
        });
    }
    catch (err) {
        (0, helpers_1.logError)('[Layouts] Could not change capture crop values [%s]', err, captures[capture]);
    }
}
let resetAllGameCropConfirm = false;
let resetAllGameCropTO;
xkeys_1.default.on('down', async (keyIndex) => {
    // Lots of stuff to determine if this is a "game" key or a "camera" key.
    // Most of the functionality is identical between each, so they share big parts of code.
    const mode = (() => {
        if (gameCaptureKeys
            .concat(gameSourceKeys, gameCropKeys, Object.values(gameCropResetKeys))
            .includes(keyIndex)) {
            return 'game';
        }
        if (cameraCaptureKeys.concat(cameraSourceKeys, cameraPositionResetKey).includes(keyIndex)) {
            return 'camera';
        }
        return undefined;
    })();
    if (!mode)
        return;
    const captureKeys = mode === 'game' ? gameCaptureKeys : cameraCaptureKeys;
    const sourceKeys = mode === 'game' ? gameSourceKeys : cameraSourceKeys;
    const captures = mode === 'game' ? gameCaptures : cameraCaptures;
    const sources = mode === 'game' ? gameSources : cameraSources;
    // If changing from one "mode" to another, clear all key functionality.
    if ((gameCaptureKeys.includes(keyIndex) && selected.cameraCapture >= 0)
        || (cameraCaptureKeys.includes(keyIndex) && selected.gameCapture >= 0)) {
        clearAllKeys();
    }
    // A Capture key was pressed.
    if (captureKeys.includes(keyIndex)) {
        const capture = captureKeys.indexOf(keyIndex);
        // If capture has been changed.
        if (capture !== selected[`${mode}Capture`]) {
            // Turn old key off, turn new key on.
            xkeys_1.default.setBacklight(captureKeys[selected[`${mode}Capture`]], false);
            xkeys_1.default.setBacklight(captureKeys[capture], true, true);
            // Make relevant source keys blink, except the currently selected one.
            sourceKeys.forEach((key) => {
                if (key === sourceKeys[selected[`${mode}Source`][capture]]) {
                    xkeys_1.default.setBacklight(key, true, true);
                }
                else {
                    xkeys_1.default.setBacklight(key, true, false, true);
                }
            });
            // Make cropping keys blink.
            if (mode === 'game') {
                gameCropKeys.forEach((key) => {
                    xkeys_1.default.setBacklight(key, true, false, true);
                });
                selected.gameCrop = -1;
            }
            // Update the camera capture cropping in case it is now different due to game-layout changes.
            if (mode === 'camera') {
                const itemProperties = await obs_1.default.conn.send('GetSceneItemProperties', {
                    'scene-name': config.obs.names.scenes.gameLayout,
                    item: { name: captures[capture] },
                });
                cameraCropValues[capture] = itemProperties.crop;
            }
            // Set new key as current.
            selected[`${mode}Capture`] = capture;
            setupIdleTimeout();
        }
        else {
            // Turn off capture key.
            xkeys_1.default.setBacklight(captureKeys[capture], false);
            // Turn off source keys.
            sourceKeys.forEach((key) => {
                xkeys_1.default.setBacklight(key, false);
            });
            // Turn off crop keys.
            if (mode === 'game') {
                gameCropKeys.forEach((key) => {
                    xkeys_1.default.setBacklight(key, false);
                });
            }
            // Unset capture/cropping.
            // Source values not removed; kept in memory for future use.
            selected[`${mode}Capture`] = -1;
            if (mode === 'game')
                selected.gameCrop = -1;
        }
        // A Source key was pressed and a Capture is selected.
    }
    else if (sourceKeys.includes(keyIndex) && selected[`${mode}Capture`] >= 0) {
        const source = sourceKeys.indexOf(keyIndex);
        // If source has been changed.
        if (source !== selected[`${mode}Source`][selected[`${mode}Capture`]]) {
            // Make relevant source keys blink, except the newly selected one.
            sourceKeys.forEach((key) => {
                if (key === sourceKeys[source]) {
                    xkeys_1.default.setBacklight(key, true, true);
                }
                else {
                    xkeys_1.default.setBacklight(key, true, false, true);
                }
            });
            // Loops through the sources and toggles their visibility for the selected capture.
            for (const name of sources) {
                try {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore: Typings say we need to specify more than we actually do.
                    await obs_1.default.conn.send('SetSceneItemProperties', {
                        'scene-name': captures[selected[`${mode}Capture`]],
                        item: { name },
                        visible: sources.indexOf(name) === source,
                    });
                }
                catch (err) {
                    (0, helpers_1.logError)('[Layouts] Could not change source visibility [%s: %s]', err, captures[selected[`${mode}Capture`]], name);
                }
            }
            // Set new as current.
            selected[`${mode}Source`][selected[`${mode}Capture`]] = source;
            setupIdleTimeout();
        }
        // A Game Cropping key was pressed and a Capture is selected.
    }
    else if (mode === 'game' && gameCropKeys.includes(keyIndex) && selected.gameCapture >= 0) {
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
        setupIdleTimeout();
        // The button to reset cropping on selected game capture was pressed and a Capture is selected.
    }
    else if (mode === 'game' && gameCropResetKeys.selected === keyIndex
        && selected.gameCapture >= 0) {
        // Turn on backlight while key is held down.
        xkeys_1.default.setBacklight(keyIndex, true, true);
        await changeCrop();
        // The "reset all game cropping" key was pressed.
        // This has a double check so you can't accidentally press it.
    }
    else if (mode === 'game' && gameCropResetKeys.all === keyIndex) {
        if (!resetAllGameCropConfirm) {
            // Make the key blink red.
            xkeys_1.default.setBacklight(gameCropResetKeys.all, true, true, true);
            resetAllGameCropTO = setTimeout(() => {
                // Turn off key and reset confirm value.
                xkeys_1.default.setBacklight(gameCropResetKeys.all, false);
                resetAllGameCropConfirm = false;
            }, 10 * 1000);
            resetAllGameCropConfirm = true;
        }
        else {
            // Turn off key, clear timeout, reset crop on all captures that we have.
            xkeys_1.default.setBacklight(keyIndex, false);
            if (resetAllGameCropTO)
                clearTimeout(resetAllGameCropTO);
            for (let i = 0; i < gameCaptures.length; i += 1) {
                await changeCrop(undefined, i);
            }
            resetAllGameCropConfirm = false;
        }
    }
    else if (mode === 'camera') {
        // The button to reset camera "crop" if we have a camera capture selected.
        // TODO: Store value generated when game-layout changes and use that instead if possible!
        if (cameraPositionResetKey === keyIndex && selected.cameraCapture >= 0) {
            xkeys_1.default.setBacklight(keyIndex, true, true);
            // Calculate the centre to the cropping.
            const crop = cameraCropValues[selected.cameraCapture];
            const cropH = (crop.left + crop.right) / 2;
            const cropV = (crop.top + crop.bottom) / 2;
            const newCrop = { top: cropV, right: cropH, bottom: cropV, left: cropH };
            cameraCropValues[selected.cameraCapture] = newCrop; // Update local cropping values.
            await changeCrop(undefined, selected.cameraCapture);
        }
    }
});
xkeys_1.default.on('up', (keyIndex) => {
    // Turns off "reset selected capture cropping" and "reset camera position" button.
    if (keyIndex === gameCropResetKeys.selected || keyIndex === cameraPositionResetKey) {
        xkeys_1.default.setBacklight(keyIndex, false);
    }
});
xkeys_1.default.on('jog', async (index, position) => {
    if (selected.gameCrop >= 0 || selected.cameraCapture >= 0) {
        setupIdleTimeout();
        await changeCrop(position);
    }
});
let shuttleInterval;
xkeys_1.default.on('shuttle', (index, position) => {
    // If returned to 0, clear interval.
    if (position === 0 && shuttleInterval) {
        clearInterval(shuttleInterval);
        // If was at one and has now turned, start the 100ms interval.
        // This then runs the crop function every 100ms with the current position
        // at that time until the shuttle is returned to 0.
    }
    else if (currShuttlePos === 0 && position !== 0) {
        shuttleInterval = setInterval(async () => {
            if (selected.gameCrop >= 0 || selected.cameraCapture >= 0) {
                setupIdleTimeout();
                await changeCrop(currShuttlePos);
            }
        }, 100);
    }
    currShuttlePos = position;
});