"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clone_1 = __importDefault(require("clone"));
const sharp_1 = __importDefault(require("sharp"));
const logging_1 = require("./util/logging");
const nodecg_1 = require("./util/nodecg");
const obs_1 = __importDefault(require("./util/obs"));
const replicants_1 = require("./util/replicants");
const evtConfig = (0, nodecg_1.get)().bundleConfig.event;
const config = (0, nodecg_1.get)().bundleConfig.obs;
replicants_1.serverTimestamp.value = Date.now();
setInterval(() => { replicants_1.serverTimestamp.value = Date.now(); }, 100);
let gameLayoutScreenshotInterval;
async function takeGameLayoutScreenshot() {
    try {
        const gameLayoutScreenshot = await obs_1.default.conn.send('TakeSourceScreenshot', {
            sourceName: config.names.scenes.gameLayout,
            embedPictureFormat: 'png',
            height: 360,
        });
        const compressed = await (0, sharp_1.default)(Buffer.from(gameLayoutScreenshot.img.split(',')[1], 'base64'))
            .jpeg({ mozjpeg: true }).toBuffer();
        replicants_1.obsData.value.gameLayoutScreenshot = `data:image/jpeg;base64,${compressed.toString('base64')}`;
    }
    catch (err) {
        (0, nodecg_1.get)().log.debug('[OBS Data] Cannot take screenshot of game layout:', err);
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
    (0, logging_1.logStreamingStatusChange)(streaming);
});
obs_1.default.on('currentSceneChanged', (current, last) => {
    replicants_1.obsData.value.scene = current;
    if (last) {
        (0, logging_1.logSceneSwitch)(last, 'end');
    }
    if (current) {
        (0, logging_1.logSceneSwitch)(current, 'start');
    }
});
obs_1.default.on('sceneListChanged', (list) => {
    // Don't include scenes after the first that starts with "---".
    const stopIndex = list.findIndex((s) => s.startsWith('---'));
    replicants_1.obsData.value.sceneList = (0, clone_1.default)(list).slice(0, stopIndex >= 0 ? stopIndex : undefined);
});
obs_1.default.conn.on('TransitionBegin', (data) => {
    // obsData.value.disableTransitioning = true; // Always disable transitioning when one begins.
    replicants_1.obsData.value.transitioning = true;
    if (data.name === 'Stinger')
        (0, nodecg_1.get)().sendMessage('showTransition');
});
obs_1.default.conn.on('TransitionEnd', () => {
    replicants_1.obsData.value.transitioning = false;
});
