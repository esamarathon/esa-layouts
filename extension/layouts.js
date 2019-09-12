"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const speedcontrol_util_1 = __importDefault(require("speedcontrol-util"));
const nodecgApiContext = __importStar(require("./util/nodecg-api-context"));
const nodecg_bundleconfig_1 = require("./util/nodecg-bundleconfig");
const obs_1 = __importDefault(require("./util/obs"));
const rabbitmq_1 = require("./util/rabbitmq");
const nodecg = nodecgApiContext.get();
const sc = new speedcontrol_util_1.default(nodecg);
const currentScene = nodecg.Replicant('currentOBSScene'); // temp
const currentLayout = nodecg.Replicant('currentLayout'); // schema this!
const currentLayoutOverridden = nodecg.Replicant('currentLayoutOverridden');
const commentators = nodecg.Replicant('commentators');
let lastScene;
// CSS ID -> OBS group name mapping
const obsGroupKeys = {
    GameCapture1: nodecg_bundleconfig_1.bundleConfig.obs.names.groups.gameCapture1,
    GameCapture2: nodecg_bundleconfig_1.bundleConfig.obs.names.groups.gameCapture2,
    GameCapture3: nodecg_bundleconfig_1.bundleConfig.obs.names.groups.gameCapture3,
    GameCapture4: nodecg_bundleconfig_1.bundleConfig.obs.names.groups.gameCapture4,
    CameraCapture1: nodecg_bundleconfig_1.bundleConfig.obs.names.groups.cameraCapture1,
    CameraCapture2: nodecg_bundleconfig_1.bundleConfig.obs.names.groups.cameraCapture2,
};
const obsGameLayoutScene = nodecg_bundleconfig_1.bundleConfig.obs.names.scenes.gameLayout;
const obsIntermissionScene = nodecg_bundleconfig_1.bundleConfig.obs.names.scenes.intermission;
// nodecg-speedcontrol no longer sends forceRefreshIntermission so doing it here instead
sc.timer.on('change', (newVal, oldVal) => {
    // Timer just finished.
    if (oldVal && oldVal.state !== 'finished' && newVal.state === 'finished') {
        nodecg.sendMessage('forceRefreshIntermission');
    }
});
obs_1.default.on('SwitchScenes', (data) => {
    lastScene = currentScene.value;
    currentScene.value = data['scene-name'];
    // Trigger Twitch ads when on the relevant scene.
    if (currentScene.value === nodecg_bundleconfig_1.bundleConfig.obs.names.scenes.ads) {
        // TODO: add this to speedcontrol-util.
        nodecg.sendMessageToBundle('twitchStartCommercial', 'nodecg-speedcontrol');
    }
    // Enable/disable nodecg-speedcontrol timer changes if on/not on a game layout scene.
    if (currentScene.value.includes(nodecg_bundleconfig_1.bundleConfig.obs.names.scenes.gameLayout)) {
        sc.enableTimerChanges();
    }
    else {
        sc.disableTimerChanges();
    }
});
// Switch back to the last scene when the sponsor video finishes.
nodecg.listenFor('videoFinished', () => {
    obs_1.default.changeScene(obsIntermissionScene).catch((err) => { });
});
// Triggered when the game layout page is opened;
// we need to toggle the visibility to off for all captures.
nodecg.listenFor('hideAllCaptures', (value, ack) => __awaiter(this, void 0, void 0, function* () {
    var e_1, _a;
    const keyMap = Object.keys(obsGroupKeys).map((key) => {
        return obsGroupKeys[key];
    });
    try {
        for (var keyMap_1 = __asyncValues(keyMap), keyMap_1_1; keyMap_1_1 = yield keyMap_1.next(), !keyMap_1_1.done;) {
            const item = keyMap_1_1.value;
            try {
                yield obs_1.default.hideItemInScene(item, obsGameLayoutScene);
            }
            catch (err) { }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (keyMap_1_1 && !keyMap_1_1.done && (_a = keyMap_1.return)) yield _a.call(keyMap_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    if (ack && !ack.handled) {
        ack(null);
    }
}));
// Triggered when the capture parts of the game layout in the browser move around.
nodecg.listenFor('captureChange', (opts) => __awaiter(this, void 0, void 0, function* () {
    // If no sizes are specified, we want to disable it's visibility.
    if (!opts.sizes) {
        try {
            yield obs_1.default.hideItemInScene(obsGroupKeys[opts.cssID], obsGameLayoutScene);
        }
        catch (err) { }
    }
    else {
        try {
            const crop = { top: 0, right: 0, bottom: 0, left: 0 };
            // If this is a camera, it may need cropping.
            if (opts.cssClass === 'CameraCapture') {
                // Cameras need cropping if not exactly 16:9.
                // Bigger than 16:9 need top/bottom cropping.
                // Smaller than 16:9 need left/right cropping.
                const webcamAR = opts.sizes.width / opts.sizes.height;
                if (webcamAR > (16 / 9)) {
                    const newHeight = 1920 / webcamAR;
                    const cropAmount = Math.floor((1080 - newHeight) / 2);
                    crop.top = cropAmount;
                    crop.bottom = cropAmount;
                }
                else if (webcamAR < (16 / 9)) {
                    const newWidth = 1080 * webcamAR;
                    const cropAmount = Math.floor((1920 - newWidth) / 2);
                    crop.left = cropAmount;
                    crop.right = cropAmount;
                }
            }
            yield obs_1.default.setUpCaptureInScene(obsGroupKeys[opts.cssID], obsGameLayoutScene, {
                x: opts.sizes.x,
                y: opts.sizes.y,
                width: opts.sizes.width,
                height: opts.sizes.height,
                croptop: crop.top,
                cropright: crop.right,
                cropbottom: crop.bottom,
                cropleft: crop.left,
            });
        }
        catch (err) { }
    }
}));
// When someone scans in on one of the big timer buttons.
// Currently only used for commentators.
rabbitmq_1.mq.on('bigbutton-tag-scanned', (data) => {
    const name = data.user.displayName;
    if (!commentators.value.includes(name)) {
        commentators.value.push(name);
    }
});
sc.runDataActiveRun.on('change', (newVal, oldVal) => {
    // Reset the commentators when the run changes and not on the game layout scene.
    if ((!newVal || (newVal && oldVal && oldVal.id !== newVal.id))
        && currentScene.value && !currentScene.value.includes(obsGameLayoutScene)) {
        commentators.value.length = 0;
    }
    // Change the game layout based on information supplied via the run data.
    if (newVal) {
        if (oldVal && currentLayoutOverridden.value && newVal.id !== oldVal.id) {
            currentLayoutOverridden.value = false;
        }
        if (!currentLayoutOverridden.value && (!oldVal || newVal.id !== oldVal.id)) {
            const layoutCode = (newVal.customData && newVal.customData.layout) ? newVal.customData.layout : '4x3-1p';
            currentLayout.value = `/${layoutCode}`;
        }
    }
});
//# sourceMappingURL=layouts.js.map