"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clone_1 = __importDefault(require("clone"));
const logging_1 = require("./util/logging");
const nodecg_1 = require("./util/nodecg");
const obs_1 = __importDefault(require("./util/obs"));
const replicants_1 = require("./util/replicants");
const evtConfig = nodecg_1.get().bundleConfig.event;
const config = nodecg_1.get().bundleConfig.obs;
let gameLayoutScreenshotInterval;
async function takeGameLayoutScreenshot() {
    try {
        const gameLayoutScreenshot = await obs_1.default.conn.send('TakeSourceScreenshot', {
            sourceName: config.names.scenes.gameLayout,
            embedPictureFormat: 'png',
            height: 360,
        });
        replicants_1.obsData.value.gameLayoutScreenshot = gameLayoutScreenshot.img;
    }
    catch (err) {
        nodecg_1.get().log.debug('[OBS Data] Cannot take screenshot of game layout:', err);
    }
}
obs_1.default.on('connectionStatusChanged', (connected) => {
    replicants_1.obsData.value.connected = connected;
    if (connected) {
        if (evtConfig.online) {
            takeGameLayoutScreenshot();
            gameLayoutScreenshotInterval = setInterval(takeGameLayoutScreenshot, 1 * 1000);
        }
    }
    else {
        clearInterval(gameLayoutScreenshotInterval);
    }
});
obs_1.default.on('streamingStatusChanged', (streaming) => {
    replicants_1.obsData.value.streaming = streaming;
    logging_1.logStreamingStatusChange(streaming);
});
obs_1.default.on('currentSceneChanged', (current, last) => {
    replicants_1.obsData.value.scene = current;
    if (last) {
        logging_1.logSceneSwitch(last, 'end');
    }
    if (current) {
        logging_1.logSceneSwitch(current, 'start');
    }
});
obs_1.default.on('sceneListChanged', (list) => {
    // Don't include scenes after the first that starts with "---".
    const stopIndex = list.findIndex((s) => s.startsWith('---'));
    replicants_1.obsData.value.sceneList = clone_1.default(list).slice(0, stopIndex >= 0 ? stopIndex : undefined);
});
// This logic assumes the duration supplied is correct, which isn't always the case.
// Not too important for now; a "TransitionEnd" event will be added in a later version.
let transitioningTimeout;
obs_1.default.conn.on('TransitionBegin', (data) => {
    replicants_1.obsData.value.transitioning = true;
    clearTimeout(transitioningTimeout);
    transitioningTimeout = setTimeout(() => { replicants_1.obsData.value.transitioning = false; }, data.duration);
    if (data.name === 'Stinger')
        nodecg_1.get().sendMessage('showTransition');
});
