"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const countdown_1 = __importDefault(require("@shared/extension/countdown"));
const clone_1 = __importDefault(require("clone"));
const helpers_1 = require("./util/helpers");
const nodecg_1 = require("./util/nodecg");
const obs_1 = __importDefault(require("./util/obs"));
const replicants_1 = require("./util/replicants");
const speedcontrol_1 = require("./util/speedcontrol");
const xkeys_1 = __importDefault(require("./util/xkeys"));
const config = (0, nodecg_1.get)().bundleConfig;
new countdown_1.default((0, nodecg_1.get)()); // eslint-disable-line no-new
const obsNamesCfg = config.obs.names;
const gameCaptures = Array.isArray(obsNamesCfg.groups.gameCaptures)
    ? obsNamesCfg.groups.gameCaptures
    : [obsNamesCfg.groups.gameCaptures];
const cameraCaptures = Array.isArray(obsNamesCfg.groups.cameraCaptures)
    ? obsNamesCfg.groups.cameraCaptures
    : [obsNamesCfg.groups.cameraCaptures];
const allCaptures = gameCaptures.concat(cameraCaptures);
const gameSources = Array.isArray(obsNamesCfg.sources.gameSources)
    ? obsNamesCfg.sources.gameSources
    : [obsNamesCfg.sources.gameSources];
const cameraSources = Array.isArray(obsNamesCfg.sources.cameraSources)
    ? obsNamesCfg.sources.cameraSources
    : [obsNamesCfg.sources.cameraSources];
// For ease of use, we attach the type of the source to each name as well.
const allSources = (gameSources.map((v) => ({ name: v, type: 'game' }))
    .concat(cameraSources.map((v) => ({ name: v, type: 'camera' }))));
// CSS ID -> OBS source name mapping
// TODO: Make this be generated programatically.
const obsSourceKeys = {
    GameCapture1: gameCaptures[0],
    GameCapture2: gameCaptures[1],
    GameCapture3: gameCaptures[2],
    GameCapture4: gameCaptures[3],
    CameraCapture1: cameraCaptures[0],
    CameraCapture2: cameraCaptures[1],
    CameraCapture3: cameraCaptures[2],
    CameraCapture4: cameraCaptures[3],
    // CameraCaptureCrowd: config.obs.names.sources.cameraSourceCrowd || undefined,
};
// Hardcoded (for now) sets of keys to use for groups/sources/etc for XKeys panel.
// slice removes any that won't be applicable because of the current configuration.
const gameCaptureKeys = [1, 2, 3, 4].slice(0, Math.min(gameCaptures.length, 4));
const cameraCaptureKeys = [5, 6, 7, 8].slice(0, Math.min(cameraCaptures.length, 4));
const allCaptureKeys = gameCaptureKeys.concat(cameraCaptureKeys);
const gameSourceKeys = [9, 10, 11, 12, 17, 18, 19, 20].slice(0, Math.min(gameSources.length, 8));
const cameraSourceKeys = [13, 14, 15, 16, 21, 22, 23, 24]
    .slice(0, Math.min(cameraSources.length, 8));
const allSourceKeys = gameSourceKeys.concat(cameraSourceKeys);
const gameCropKeys = [70, 79, 72, 63]; // order: top, right, bottom, left
const gameCropResetKeys = { selected: 78, all: 62 };
const cameraPositionResetKey = 80;
const noIdleTimeoutKey = 25;
// Stores current cropping values for each mode.
// We fill up slots here for both "types" of capture as they are actually interchangable.
const gameCropValues = Array(gameCaptures.length + cameraCaptures.length)
    .fill({ top: 0, right: 0, bottom: 0, left: 0 });
const cameraCropValues = Array(gameCaptures.length + cameraCaptures.length)
    .fill({ top: 0, right: 0, bottom: 0, left: 0 });
// Things that are currently "selected", mostly used by XKeys for backlights.
// We fill up slots here for both "types" of capture as they are actually interchangable.
const selected = {
    captureIndex: -1,
    sourceIndex: Array(gameCaptures.length + cameraCaptures.length).fill(-1),
    gameCrop: -1,
};
let idleTimeout = true;
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
    var _a;
    // This shouldn't trigger on initial start up, so should only happen on an *actual* run change.
    if (newVal && layoutInit) {
        // If there's no old run or we changed to a different run, try to automatically set the layout.
        if (!oldVal || newVal.id !== oldVal.id) {
            // Overwrite code with new ESAW24 layout if 1 player.
            let code = (_a = newVal.customData.layout) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            if ((code === null || code === void 0 ? void 0 : code.endsWith('-1p')) && !code.startsWith('ds') && !code.startsWith('3ds')) {
                code = `esaw24-${code}`;
            }
            const layout = replicants_1.gameLayouts.value.available.find((l) => l.code.toLowerCase() === code);
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
/**
 * Used to retrieve the stored crop and area values for a capture depending on the source mode
 * and the area on the game layout.
 * @param mode What mode we are operating in for the relevant capture.
 * @param areaName CSS ID for the capture (e.g. "GameCapture1")
 * @param groupSourceName OBS source name for the capture (e.g. "Game Capture 1")
 * @returns Both the crop values and the area values if possible.
 */
async function getStoredCropAndAreaVals(mode, areaName, groupSourceName, recall = false) {
    const area = replicants_1.capturePositions.value['game-layout'][areaName];
    let crop = { top: 0, right: 0, bottom: 0, left: 0 }; // Default crop values
    // If this a game source, use cropping we have stored for those.
    if (mode === 'game')
        crop = gameCropValues[allCaptures.indexOf(groupSourceName)];
    // If this is a camera source, cropping is a little more complicated.
    if (mode === 'camera' && area) {
        const storedCrop = cameraCropValues[allCaptures.indexOf(groupSourceName)];
        // If "recall" is specified and we have a stored crop,
        // just return stored values and don't fully calculate them again.
        if (recall && storedCrop)
            crop = (0, clone_1.default)(storedCrop);
        else {
            try {
                // Cameras need cropping if not exactly 16:9.
                // Wider need top/bottom cropping.
                // Thinner need left/right cropping.
                const sceneItemProperties = await obs_1.default.conn.send('GetSceneItemProperties', {
                    'scene-name': config.obs.names.scenes.gameLayout,
                    item: { name: groupSourceName },
                });
                const cameraAR = sceneItemProperties.sourceWidth / sceneItemProperties.sourceHeight;
                const areaAR = area.width / area.height;
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
                cameraCropValues[allCaptures.indexOf(groupSourceName)] = (0, clone_1.default)(crop);
            }
            catch (err) {
                (0, helpers_1.logError)('[Layouts] Could not find camera source to crop [%s]', err, areaName);
            }
        }
    }
    return { crop, area };
}
// Listens to the replicant that stores the "capture positions" for various graphics
// sent by the browser (as of writing, only game-layout), to know where to move OBS items.
let positionsInit = false;
// let crowdCamPrevious = gameLayouts.value.crowdCamera;
replicants_1.capturePositions.on('change', async (val) => {
    var _a;
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
    // areaName: CSS ID (e.g. "GameCapture1")
    // groupSourceName: name of group source in OBS (e.g. "Game Capture 1")
    for (const [areaName, groupSourceName] of Object.entries(obsSourceKeys)) {
        if (groupSourceName) { // Only continue if key -> value pair is set
            // Check for mode of currently selected source for this capture.
            const mode = (_a = allSources[selected.sourceIndex[allCaptures.indexOf(groupSourceName)]]) === null || _a === void 0 ? void 0 : _a.type;
            // Get relevant crop values for this capture for the specific mode it's in.
            const { crop, area } = await getStoredCropAndAreaVals(mode, areaName, groupSourceName);
            try {
                // Special game capture source cropping for sm64-psp-2p game layout.
                // TODO: IF THIS GETS IN THE WAY OF CHANGES, JUST REMOVE IT!
                /* if (['GameCapture1', 'GameCapture2'].includes(areaName)
                && gameLayouts.value.selected === 'sm64-psp-2p') {
                  const sceneItemProperties = await obs.conn.send('GetSceneItemProperties', {
                    'scene-name': config.obs.names.scenes.gameLayout,
                    item: { name: groupSourceName },
                  });
                  crop = {
                    top: 0,
                    right: areaName === 'GameCapture1' ? sceneItemProperties.sourceWidth / 2 : 0,
                    bottom: 0,
                    left: areaName === 'GameCapture2' ? sceneItemProperties.sourceWidth / 2 : 0,
                  };
                } */
                await obs_1.default.configureSceneItem(config.obs.names.scenes.gameLayout, // Scene
                groupSourceName, // Item
                // eslint-disable-next-line arrow-body-style
                (() => {
                    // Special game capture settings for DS-1p, 3DS-1p and sm64-psp-2p when online.
                    // TODO: IF THIS GETS IN THE WAY OF CHANGES, JUST REMOVE IT!
                    /* if (config.event.online && areaName.startsWith('GameCapture')
                    && ['DS-1p', '3DS-1p', 'sm64-psp-2p'].includes(gameLayouts.value.selected || '')) {
                      // sm64-psp-2p.
                      if (gameLayouts.value.selected === 'sm64-psp-2p'
                      && ['GameCapture1', 'GameCapture2'].includes(areaName)) {
                        return {
                          x: areaName === 'GameCapture2' ? config.obs.canvasResolution.width / 2 : 0,
                          y: 0,
                          width: config.obs.canvasResolution.width / 2,
                          height: config.obs.canvasResolution.height,
                        };
                      }
                      // All others.
                      if (areaName === 'GameCapture1') {
                        return {
                          x: 0,
                          y: 0,
                          width: config.obs.canvasResolution.width,
                          height: config.obs.canvasResolution.height,
                        };
                      }
                      return undefined;
                    } */
                    return area;
                })(), crop, // Crop
                // eslint-disable-next-line arrow-body-style
                (() => {
                    // Special game capture settings for DS-1p, 3DS-1p and sm64-psp-2p when online.
                    // TODO: IF THIS GETS IN THE WAY OF CHANGES, JUST REMOVE IT!
                    /* if (config.event.online && areaName.startsWith('GameCapture')
                    && ['DS-1p', '3DS-1p', 'sm64-psp-2p'].includes(gameLayouts.value.selected || '')) {
                      if (areaName === 'GameCapture1') return true;
                      if (areaName === 'GameCapture2' && gameLayouts.value.selected === 'sm64-psp-2p') {
                        return true;
                      }
                      return false;
                    } */
                    return !!area;
                })());
            }
            catch (err) {
                (0, helpers_1.logError)('[Layouts] Could not successfully configure capture position [%s]', err, areaName);
            }
        }
    }
    // If crowd camera has changed since last time and we're on the game layout, transition.
    // TODO: IF THIS GETS IN THE WAY OF CHANGES, JUST REMOVE IT!
    /* try {
      if (crowdCamPrevious !== gameLayouts.value.crowdCamera) {
        if (obs.isCurrentScene(config.obs.names.scenes.gameLayout)) {
          // eslint-disable-next-line import/no-named-as-default-member
          await obs.changeScene(config.obs.names.scenes.gameLayout);
        }
        crowdCamPrevious = gameLayouts.value.crowdCamera;
      }
    } catch (err) {
      logError('[Layouts] Could not successfully update live Game Layout', err);
    } */
});
// Things to do on OBS initial connection/authentication.
// This should also trigger even if authentication is turned off, after initial connection.
// TODO: Any checks needed for "online" marathons? Some were removed; we don't care about
// them anymore anyway so not too much of an issue, not sure why the check was there
// in the first place.
obs_1.default.conn.on('AuthenticationSuccess', async () => {
    // Loop through all capture scenes.
    for (const [captureIndex, captureName] of allCaptures.entries()) {
        let mode;
        // Loop through all sources inside of this capture scene, and get properties from OBS.
        for (const [sourceIndex, { name: sourceName }] of allSources.entries()) {
            try {
                const itemProperties = await obs_1.default.conn.send('GetSceneItemProperties', {
                    'scene-name': captureName,
                    item: { name: sourceName },
                });
                // If this source in the capture scene is toggled as being visible, assume this is the
                // one that should be marked on the xkeys.
                if (itemProperties.visible) {
                    selected.sourceIndex[captureIndex] = sourceIndex;
                    // We check here if the current source selected is game or camera so we can fill in the
                    // current cropping information in the correct spot.
                    if (gameSources.indexOf(sourceName) >= 0)
                        mode = 'game';
                    else if (cameraSources.indexOf(sourceName) >= 0)
                        mode = 'camera';
                    break; // We no longer need to check any more sources.
                }
            }
            catch (err) {
                (0, helpers_1.logError)('[Layouts] Could not get initial source visibility values [%s: %s]', err, captureName, sourceName);
            }
        }
        try {
            // Get properties of capture source in game layout scene.
            const itemProperties = await obs_1.default.conn.send('GetSceneItemProperties', {
                'scene-name': config.obs.names.scenes.gameLayout,
                item: { name: captureName },
            });
            // Fill in cropping information based on the type of source selected in the capture scene.
            if (mode === 'game') {
                gameCropValues[captureIndex] = itemProperties.crop;
            }
            else if (mode === 'camera') {
                cameraCropValues[captureIndex] = itemProperties.crop;
            }
        }
        catch (err) {
            (0, helpers_1.logError)('[Layouts] Could not get initial capture cropping values [%s]', err, captureName);
        }
    }
});
/**
 * Turns off all button lights and functionality.
 */
function clearAllKeys() {
    // Turn off capture keys.
    xkeys_1.default.setBacklight(allCaptureKeys[selected.captureIndex], false);
    // Turn off all other keys.
    allSourceKeys.concat(gameCropKeys).forEach((key) => {
        xkeys_1.default.setBacklight(key, false);
    });
    selected.captureIndex = -1;
    selected.gameCrop = -1;
}
/**
 * Sets up a timer to turn off the button lights and functionality after 30s,
 * if no other keys are pressed.
 */
let captureTO;
function setupIdleTimeout() {
    if (captureTO)
        clearTimeout(captureTO);
    if (idleTimeout) {
        captureTO = setTimeout(() => { clearAllKeys(); }, 30 * 1000);
    }
}
/**
 * Helper function to calculate game crop used below to calculate overall crop value for a source.
 * @param side Crop amount already applied.
 * @param value Amount to crop, usually from the position of the jog/shutter.
 * @returns Calculated value.
 */
function calculateGameCrop(side, value) {
    return Math.max(side + value, 0);
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
 * @param mode Specify the mode this function will run with.
 */
async function changeCrop(value, cap, mode) {
    var _a;
    const capI = cap !== null && cap !== void 0 ? cap : selected.captureIndex;
    if (typeof capI === 'undefined' || capI < 0)
        return;
    if (mode === 'game') {
        if (value && selected.gameCrop >= 0) {
            switch (selected.gameCrop) {
                case 0:
                    gameCropValues[capI].top = calculateGameCrop(gameCropValues[capI].top, value);
                    break;
                case 1:
                    gameCropValues[capI].right = calculateGameCrop(gameCropValues[capI].right, value);
                    break;
                case 2:
                    gameCropValues[capI].bottom = calculateGameCrop(gameCropValues[capI].bottom, value);
                    break;
                case 3:
                    gameCropValues[capI].left = calculateGameCrop(gameCropValues[capI].left, value);
                    break;
                default:
                // nothing
            }
            // If no value is supplied, reset the cropping instead.
        }
        else {
            gameCropValues[capI] = { top: 0, right: 0, bottom: 0, left: 0 };
        }
    }
    else if (mode === 'camera') {
        if (value && capI >= 0) {
            const crop = cameraCropValues[capI];
            // Top/bottom cropping.
            if (crop.top > 0 || crop.bottom > 0) {
                const croppingValues = calculateCameraCrop(crop.top, crop.bottom, value);
                [
                    cameraCropValues[capI].top,
                    cameraCropValues[capI].bottom,
                ] = croppingValues;
            }
            // Left/right cropping.
            if (crop.left > 0 || crop.right > 0) {
                const croppingValues = calculateCameraCrop(crop.left, crop.right, value);
                [
                    cameraCropValues[capI].left,
                    cameraCropValues[capI].right,
                ] = croppingValues;
            }
        }
    }
    if (typeof capI === 'undefined' || capI < 0)
        return;
    const cropValues = mode === 'game' ? gameCropValues : cameraCropValues;
    // If the currently selected source for this capture is in the mode that has been supplied,
    // we also want to push those new values to the capture item in the OBS game layout.
    const currentCaptureMode = (_a = allSources[selected.sourceIndex[capI]]) === null || _a === void 0 ? void 0 : _a.type;
    if (currentCaptureMode === mode) {
        try {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore: Typings say we need to specify more than we actually do.
            await obs_1.default.conn.send('SetSceneItemProperties', {
                'scene-name': config.obs.names.scenes.gameLayout,
                item: { name: allCaptures[capI] },
                crop: cropValues[capI],
            });
        }
        catch (err) {
            (0, helpers_1.logError)('[Layouts] Could not change capture crop values [%s]', err, allCaptures[capI]);
        }
    }
}
let resetOneGameCropConfirm = false;
let resetOneGameCropTO;
let resetAllGameCropConfirm = false;
let resetAllGameCropTO;
let resetCameraPositionConfirm = false;
let resetCameraPositionTO;
xkeys_1.default.on('down', async (keyIndex) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    // A Capture key was pressed.
    if (allCaptureKeys.includes(keyIndex)) {
        const captureIndex = allCaptureKeys.indexOf(keyIndex);
        // Check for mode of currently selected source for this capture.
        const mode = (_a = allSources[selected.sourceIndex[captureIndex]]) === null || _a === void 0 ? void 0 : _a.type;
        // If capture has been changed.
        if (captureIndex !== selected.captureIndex) {
            // Turn old key off, turn new key on.
            xkeys_1.default.setBacklight(allCaptureKeys[selected.captureIndex], false);
            xkeys_1.default.setBacklight(allCaptureKeys[captureIndex], true, true);
            // Make relevant source keys blink, except the currently selected one.
            allSourceKeys.forEach((key) => {
                if (key === allSourceKeys[selected.sourceIndex[captureIndex]]) {
                    xkeys_1.default.setBacklight(key, true, true);
                }
                else {
                    xkeys_1.default.setBacklight(key, true, false, true);
                }
            });
            // Make cropping keys blink if "game" mode should be active.
            // If not, turn them off in case they're on.
            // TODO: ONLY TURN OFF IF THEY NEED TO BE!
            if (mode === 'game') {
                gameCropKeys.forEach((key) => {
                    xkeys_1.default.setBacklight(key, true, false, true);
                });
                selected.gameCrop = -1;
            }
            else {
                gameCropKeys.forEach((key) => {
                    xkeys_1.default.setBacklight(key, false);
                });
                selected.gameCrop = -1;
            }
            // Set new key as current.
            selected.captureIndex = captureIndex;
            setupIdleTimeout();
        }
        else {
            // Turn off capture key.
            xkeys_1.default.setBacklight(allCaptureKeys[captureIndex], false);
            // Turn off source keys.
            allSourceKeys.forEach((key) => {
                xkeys_1.default.setBacklight(key, false);
            });
            // Turn off crop keys if in "game" mode.
            if (mode === 'game') {
                gameCropKeys.forEach((key) => {
                    xkeys_1.default.setBacklight(key, false);
                });
            }
            // Unset capture/cropping.
            // Source values not removed; kept in memory for future use.
            selected.captureIndex = -1;
            if (mode === 'game')
                selected.gameCrop = -1;
        }
        // A Source key was pressed and a Capture is selected.
    }
    else if (allSourceKeys.includes(keyIndex) && selected.captureIndex >= 0) {
        const sourceIndex = allSourceKeys.indexOf(keyIndex);
        // Check for mode of what source button was pressed.
        const mode = (_b = allSources[sourceIndex]) === null || _b === void 0 ? void 0 : _b.type;
        // If source has been changed.
        if (sourceIndex !== selected.sourceIndex[selected.captureIndex]) {
            // Make relevant source keys blink, except the newly selected one.
            allSourceKeys.forEach((key) => {
                if (key === allSourceKeys[sourceIndex]) {
                    xkeys_1.default.setBacklight(key, true, true);
                }
                else {
                    xkeys_1.default.setBacklight(key, true, false, true);
                }
            });
            // Make cropping keys blink if "game" mode should be active.
            // If not, turn them off.
            if (mode === 'game') {
                gameCropKeys.forEach((key) => {
                    xkeys_1.default.setBacklight(key, true, false, true);
                });
                selected.gameCrop = -1;
            }
            else {
                gameCropKeys.forEach((key) => {
                    xkeys_1.default.setBacklight(key, false);
                });
                selected.gameCrop = -1;
            }
            // Configures the capture group item in the game layout scene to the correct cropping,
            // depending on if you switch to a game capture or a camera capture.
            const groupSourceName = allCaptures[selected.captureIndex];
            const areaName = (_c = Object.entries(obsSourceKeys)
                .find(([, v]) => groupSourceName && v === groupSourceName)) === null || _c === void 0 ? void 0 : _c[0];
            if (areaName && groupSourceName) {
                const { crop, area } = await getStoredCropAndAreaVals(mode, areaName, groupSourceName, true);
                await obs_1.default.configureSceneItem(config.obs.names.scenes.gameLayout, // Scene
                groupSourceName, // Item
                area, // Area
                crop, // Crop
                !!area);
            }
            // Loops through the sources and toggles their visibility for the selected source.
            for (const [index, { name }] of allSources.entries()) {
                try {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore: Typings say we need to specify more than we actually do.
                    await obs_1.default.conn.send('SetSceneItemProperties', {
                        'scene-name': allCaptures[selected.captureIndex],
                        item: { name },
                        visible: index === sourceIndex,
                    });
                }
                catch (err) {
                    (0, helpers_1.logError)('[Layouts] Could not change source visibility [%s: %s]', err, allCaptures[selected.captureIndex], name);
                }
            }
            // Set new as current.
            selected.sourceIndex[selected.captureIndex] = sourceIndex;
            setupIdleTimeout();
        }
        // A Game Cropping key was pressed and a Capture is selected.
    }
    else if (gameCropKeys.includes(keyIndex) && selected.captureIndex >= 0) {
        // Check for mode of currently selected source for currently selected capture.
        const mode = (_d = allSources[selected.sourceIndex[selected.captureIndex]]) === null || _d === void 0 ? void 0 : _d.type;
        // Only run this if applicable.
        if (mode === 'game') {
            const side = gameCropKeys.indexOf(keyIndex); // order: top, right, bottom, left
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
        }
        // The button to reset cropping on selected game capture was pressed and a Capture is selected.
    }
    else if (gameCropResetKeys.selected === keyIndex && selected.captureIndex >= 0) {
        // Check for mode of currently selected source for currently selected capture.
        const mode = (_e = allSources[selected.sourceIndex[selected.captureIndex]]) === null || _e === void 0 ? void 0 : _e.type;
        // Only run this if applicable.
        if (mode === 'game') {
            if (!resetOneGameCropConfirm) {
                // Make the key blink red.
                xkeys_1.default.setBacklight(gameCropResetKeys.selected, true, true, true);
                resetOneGameCropTO = setTimeout(() => {
                    // Turn off key and reset confirm value.
                    xkeys_1.default.setBacklight(gameCropResetKeys.selected, false);
                    resetOneGameCropConfirm = false;
                }, 10 * 1000);
                resetOneGameCropConfirm = true;
            }
            else {
                // Turn off key, clear timeout, reset crop on the selected capture.
                xkeys_1.default.setBacklight(keyIndex, false);
                if (resetOneGameCropTO)
                    clearTimeout(resetOneGameCropTO);
                await changeCrop(undefined, undefined, 'game');
                resetOneGameCropConfirm = false;
            }
        }
        // The "reset all game cropping" key was pressed.
        // This has a double check so you can't accidentally press it.
    }
    else if (gameCropResetKeys.all === keyIndex) {
        // Check for mode of currently selected source for currently selected capture.
        const mode = (_f = allSources[selected.sourceIndex[selected.captureIndex]]) === null || _f === void 0 ? void 0 : _f.type;
        // Only run this if applicable.
        if (mode === 'game') {
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
                for (let i = 0; i < allCaptures.length; i += 1) {
                    await changeCrop(undefined, i, 'game');
                }
                resetAllGameCropConfirm = false;
            }
        }
        // The button to reset camera "crop" if we have a camera capture selected.
    }
    else if (cameraPositionResetKey === keyIndex && selected.captureIndex >= 0) {
        // Check for mode of currently selected source for currently selected capture.
        const mode = (_g = allSources[selected.sourceIndex[selected.captureIndex]]) === null || _g === void 0 ? void 0 : _g.type;
        // Only run this if applicable.
        if (mode === 'camera') {
            if (!resetCameraPositionConfirm) {
                // Make the key blink red.
                xkeys_1.default.setBacklight(cameraPositionResetKey, true, true, true);
                resetCameraPositionTO = setTimeout(() => {
                    // Turn off key and reset confirm value.
                    xkeys_1.default.setBacklight(cameraPositionResetKey, false);
                    resetCameraPositionConfirm = false;
                }, 10 * 1000);
                resetCameraPositionConfirm = true;
            }
            else {
                // Turn off key, clear timeout, reset camera position.
                xkeys_1.default.setBacklight(keyIndex, false);
                if (resetCameraPositionTO)
                    clearTimeout(resetCameraPositionTO);
                // Configures the capture group item in the game layout scene to the correct cropping.
                const groupSourceName = allCaptures[selected.captureIndex];
                const areaName = (_h = Object.entries(obsSourceKeys)
                    .find(([, v]) => groupSourceName && v === groupSourceName)) === null || _h === void 0 ? void 0 : _h[0];
                if (areaName && groupSourceName) {
                    // Updates the stored value for the camera, no need to use returned values.
                    await getStoredCropAndAreaVals('camera', areaName, groupSourceName);
                    await changeCrop(undefined, undefined, 'camera');
                }
                resetCameraPositionConfirm = false;
            }
        }
        // The button to toggle the idle timeout functionality.
    }
    else if (noIdleTimeoutKey === keyIndex) {
        if (idleTimeout) {
            idleTimeout = false;
            if (captureTO)
                clearTimeout(captureTO);
            xkeys_1.default.setBacklight(keyIndex, true);
        }
        else {
            idleTimeout = true;
            setupIdleTimeout();
            xkeys_1.default.setBacklight(keyIndex, false);
        }
    }
});
xkeys_1.default.on('jog', async (index, position) => {
    var _a;
    // Check for mode of currently selected source for currently selected capture.
    const mode = (_a = allSources[selected.sourceIndex[selected.captureIndex]]) === null || _a === void 0 ? void 0 : _a.type;
    if ((mode === 'game' && selected.gameCrop >= 0)
        || (mode === 'camera' && selected.captureIndex >= 0)) {
        setupIdleTimeout();
        await changeCrop(position, undefined, mode);
    }
});
let shuttleInterval;
let currShuttlePos = 0;
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
            var _a;
            // Check for mode of currently selected source for currently selected capture.
            const mode = (_a = allSources[selected.sourceIndex[selected.captureIndex]]) === null || _a === void 0 ? void 0 : _a.type;
            if ((mode === 'game' && selected.gameCrop >= 0)
                || (mode === 'camera' && selected.captureIndex >= 0)) {
                setupIdleTimeout();
                await changeCrop(currShuttlePos, undefined, mode);
            }
        }, 100);
    }
    currShuttlePos = position;
});
