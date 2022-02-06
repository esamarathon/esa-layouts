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
const clone_1 = __importDefault(require("clone"));
const sharp_1 = __importDefault(require("sharp"));
const intermission_player_1 = require("./intermission-player");
const mqLogging = __importStar(require("./util/mq-logging"));
const nodecg_1 = require("./util/nodecg");
const obs_1 = __importStar(require("./util/obs"));
const replicants_1 = require("./util/replicants");
const speedcontrol_1 = require("./util/speedcontrol");
const streamdeck_1 = __importDefault(require("./util/streamdeck"));
const evtConfig = (0, nodecg_1.get)().bundleConfig.event;
const config = (0, nodecg_1.get)().bundleConfig.obs;
/**
 * Correctly changes the title text on the Stream Deck "Scene Cycle" buttons.
 */
function changeSceneCyclerSDTitle() {
    const { disableTransitioning, transitioning, connected } = replicants_1.obsData.value;
    const text = (() => {
        if (disableTransitioning || transitioning || !connected
            || ['running', 'paused'].includes(speedcontrol_1.sc.timer.value.state)
            || (obs_1.default.isCurrentScene(config.names.scenes.readerIntroduction)
                && replicants_1.readerIntroduction.value.current !== 'RunInfo')) {
            return '⚠\nCannot\nChange\nScene';
        }
        if (obs_1.default.isCurrentScene(config.names.scenes.intermission)) {
            return 'Go to\nIntro\nScene';
        }
        if (obs_1.default.isCurrentScene(config.names.scenes.readerIntroduction)) {
            return 'Go to\nGame\nScene';
        }
        if (obs_1.default.isCurrentScene(config.names.scenes.gameLayout)) {
            return 'Go to\nInter-\nmission';
        }
        return '⌛';
    })();
    streamdeck_1.default.setTextOnAllButtonsWithAction('com.esamarathon.streamdeck.scenecycler', text);
}
/**
 * Tries to start video playlist, if playlist is empty then acts as if there isn't one.
 */
async function startIntermission() {
    if (replicants_1.videoPlayer.value.playlist.length) {
        await (0, intermission_player_1.startPlaylist)();
    }
    else if (obs_1.default.findScene(config.names.scenes.commercials)) {
        await (0, obs_1.changeScene)({ scene: config.names.scenes.commercials });
    }
    else {
        await (0, obs_1.changeScene)({ scene: config.names.scenes.intermission });
    }
}
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
    mqLogging.logStreamingStatusChange(streaming);
});
obs_1.default.on('currentSceneChanged', (current, last) => {
    replicants_1.obsData.value.scene = current;
    // Slightly hacky way of not sending ".gamescene" at the end of a RabbitMQ routing key
    // if we are going between 2 different "game scenes", needed for VodManager.
    let currentIsGameScene = current === obs_1.default.findScene(config.names.scenes.gameLayout)
        || current === obs_1.default.findScene(config.names.scenes.readerIntroduction);
    let lastIsGameScene = last === obs_1.default.findScene(config.names.scenes.gameLayout)
        || last === obs_1.default.findScene(config.names.scenes.readerIntroduction);
    if (currentIsGameScene && lastIsGameScene) {
        currentIsGameScene = false;
        lastIsGameScene = false;
    }
    if (last) {
        mqLogging.logSceneSwitch(last, 'end', lastIsGameScene);
    }
    if (current) {
        mqLogging.logSceneSwitch(current, 'start', currentIsGameScene);
    }
});
obs_1.default.on('sceneListChanged', (list) => {
    // Don't include scenes after the first that starts with "---".
    const stopIndex = list.findIndex((s) => s.startsWith('---'));
    replicants_1.obsData.value.sceneList = (0, clone_1.default)(list).slice(0, stopIndex >= 0 ? stopIndex : undefined);
});
obs_1.default.conn.on('TransitionBegin', (data) => {
    replicants_1.obsData.value.transitioning = true;
    if (data.name === 'Stinger')
        (0, nodecg_1.get)().sendMessage('showTransition');
});
obs_1.default.conn.on('TransitionEnd', () => {
    replicants_1.obsData.value.transitioning = false;
});
// Disable transitioning when commercials are running and no videos are playing.
// (Intermission player controls this itself, so don't want to touch it during that).
speedcontrol_1.sc.twitchCommercialTimer.on('change', async (newVal) => {
    if (!replicants_1.videoPlayer.value.playing) {
        replicants_1.obsData.value.disableTransitioning = newVal.secondsRemaining > 0;
    }
});
// Triggered via button in "OBS Control" dashboard panel.
(0, nodecg_1.get)().listenFor('startIntermission', async () => {
    await startIntermission();
});
// Triggers a Stream Deck title text update when certain replicants change.
replicants_1.obsData.on('change', (newVal, oldVal) => {
    if (newVal.disableTransitioning !== (oldVal === null || oldVal === void 0 ? void 0 : oldVal.disableTransitioning)
        || newVal.transitioning !== oldVal.transitioning
        || newVal.scene !== oldVal.scene
        || newVal.connected !== oldVal.connected) {
        changeSceneCyclerSDTitle();
    }
});
speedcontrol_1.sc.timer.on('change', (newVal, oldVal) => {
    if (newVal.state !== (oldVal === null || oldVal === void 0 ? void 0 : oldVal.state)) {
        changeSceneCyclerSDTitle();
    }
});
replicants_1.readerIntroduction.on('change', (newVal, oldVal) => {
    if (newVal.current !== (oldVal === null || oldVal === void 0 ? void 0 : oldVal.current)) {
        changeSceneCyclerSDTitle();
    }
});
// What to do once Stream Deck connection is initialised.
streamdeck_1.default.on('init', () => {
    changeSceneCyclerSDTitle();
});
// What to do when a button "appears" in the Stream Deck software,
// usually after dragging on a new instance.
streamdeck_1.default.on('willAppear', (data) => {
    if (data.action.endsWith('scenecycler')) {
        changeSceneCyclerSDTitle();
    }
});
// What to do when any key is lifted on a connected Stream Deck.
streamdeck_1.default.on('keyUp', async (data) => {
    if (data.action.endsWith('scenecycler')) {
        const { disableTransitioning, transitioning, connected } = replicants_1.obsData.value;
        if (disableTransitioning || transitioning || !connected
            || ['running', 'paused'].includes(speedcontrol_1.sc.timer.value.state)) {
            return;
        }
        if (obs_1.default.isCurrentScene(config.names.scenes.intermission)) {
            const success = await (0, obs_1.changeScene)({ scene: config.names.scenes.readerIntroduction });
            if (success)
                streamdeck_1.default.send({ event: 'showOk', context: data.context });
        }
        if (obs_1.default.isCurrentScene(config.names.scenes.readerIntroduction)
            && replicants_1.readerIntroduction.value.current === 'RunInfo') {
            const success = await (0, obs_1.changeScene)({ scene: config.names.scenes.gameLayout });
            if (success)
                streamdeck_1.default.send({ event: 'showOk', context: data.context });
        }
        if (obs_1.default.isCurrentScene(config.names.scenes.gameLayout)) {
            // TODO: Confirm this worked before sending "showOk".
            await startIntermission();
            streamdeck_1.default.send({ event: 'showOk', context: data.context });
        }
    }
});
