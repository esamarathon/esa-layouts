"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleLiveMics = exports.setFaderName = void 0;
const helpers_1 = require("./util/helpers");
const nodecg_1 = require("./util/nodecg");
const obs_1 = __importDefault(require("./util/obs"));
const replicants_1 = require("./util/replicants");
const x32_1 = __importDefault(require("./util/x32"));
const config = (0, nodecg_1.get)().bundleConfig;
function getNonGameScenes() {
    // These scenes will *not* have "LIVE Game/Mics" DCAs audible.
    return [
        obs_1.default.findScene(config.obs.names.scenes.commercials),
        obs_1.default.findScene(config.obs.names.scenes.intermission),
        obs_1.default.findScene(config.obs.names.scenes.videoPlayer),
        obs_1.default.findScene(config.obs.names.scenes.countdown),
    ].filter(Boolean);
}
function setFaderName(fader, name) {
    var _a;
    if (config.x32.enabled) {
        (_a = x32_1.default.conn) === null || _a === void 0 ? void 0 : _a.send({
            address: `${fader}/config/name`,
            args: [{ type: 's', value: name }],
        });
    }
}
exports.setFaderName = setFaderName;
function toggleFadeHelper(address, scenes, data, mute = true, nofade = false) {
    try {
        let scene1 = scenes.includes(data['to-scene']);
        let scene2 = scenes.includes(data['from-scene']);
        if (!mute) {
            scene1 = scenes.includes(data['from-scene']);
            scene2 = scenes.includes(data['to-scene']);
        }
        if (scene1 && !scene2) {
            if (nofade) {
                x32_1.default.setFader(address, 0);
            }
            else {
                x32_1.default.fade(address, 0.75, 0, 1000);
            }
        }
        else if (!scene1 && scene2) {
            if (nofade) {
                x32_1.default.setFader(address, 0.75);
            }
            else {
                x32_1.default.fade(address, 0, 0.75, 1000);
            }
        }
    }
    catch (err) {
        (0, helpers_1.logError)('[Mixer] Error toggling fader [address: %s, scenes: %s, data: %s]', err, address, scenes, data);
    }
}
function toggleLiveMics(scene) {
    const nonGameScenes = getNonGameScenes();
    const fromScene = replicants_1.obsData.value.scene;
    const toScene = obs_1.default.findScene(scene);
    if (fromScene && toScene) {
        toggleFadeHelper('/dca/2/fader', nonGameScenes, {
            'from-scene': fromScene, 'to-scene': toScene,
        });
    }
}
exports.toggleLiveMics = toggleLiveMics;
obs_1.default.conn.on('TransitionBegin', async (data) => {
    if (config.x32.enabled && config.event.online !== 'partial') {
        const nonGameScenes = getNonGameScenes(); // These scenes will *not* have "LIVE" DCAs audible.
        const intermissionScenes = [
            obs_1.default.findScene(config.obs.names.scenes.commercials),
            obs_1.default.findScene(config.obs.names.scenes.intermission),
        ];
        toggleFadeHelper('/dca/1/fader', nonGameScenes, data);
        if (replicants_1.currentRunDelay.value.audio > 0) {
            setTimeout(() => {
                toggleFadeHelper('/dca/2/fader', nonGameScenes, data, true, true);
            }, 1500);
        }
        else {
            toggleFadeHelper('/dca/2/fader', nonGameScenes, data);
        }
        toggleFadeHelper('/dca/3/fader', intermissionScenes, data, false);
    }
});
