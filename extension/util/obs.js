"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeScene = exports.canChangeScene = void 0;
const obs_1 = __importDefault(require("@shared/extension/obs"));
const helpers_1 = require("./helpers");
const nodecg_1 = require("./nodecg");
const replicants_1 = require("./replicants");
const config = (0, nodecg_1.get)().bundleConfig.obs;
const obs = new obs_1.default((0, nodecg_1.get)(), config);
let sceneChangeCodeTriggered = 0;
function canChangeScene({ scene, force = false }) {
    // Don't change scene if identical, we're currently transitioning, transitioning is disabled,
    // or if we triggered a scene change here in the last 2 seconds.
    if (sceneChangeCodeTriggered > (Date.now() - 2000)
        || obs.isCurrentScene(scene)
        || (!force && (replicants_1.obsData.value.transitioning
            || replicants_1.obsData.value.disableTransitioning))) {
        return false;
    }
    return true;
}
exports.canChangeScene = canChangeScene;
async function changeScene({ scene, force = false }) {
    // Don't change scene if identical, we're currently transitioning, transitioning is disabled,
    // or if we triggered a scene change here in the last 2 seconds.
    if (sceneChangeCodeTriggered > (Date.now() - 2000)
        || obs.isCurrentScene(scene)
        || (!force && (replicants_1.obsData.value.transitioning
            || replicants_1.obsData.value.disableTransitioning))) {
        return false;
    }
    try {
        if (replicants_1.currentRunDelay.value.audio === 0
            || (!obs.isCurrentScene(config.names.scenes.gameLayout)
                && obs.findScene(scene) !== config.names.scenes.gameLayout)) {
            await obs.changeScene(scene);
            sceneChangeCodeTriggered = Date.now();
        }
        else {
            const delay = replicants_1.currentRunDelay.value.audio;
            replicants_1.obsData.value.disableTransitioning = true;
            replicants_1.obsData.value.transitionTimestamp = Date.now() + delay;
            // Simple server-to-server message we need.
            (0, nodecg_1.get)().sendMessage('obsTransitionQueued', scene);
            try {
                await new Promise((res) => { setTimeout(res, delay); });
                replicants_1.obsData.value.disableTransitioning = false;
                await obs.changeScene(scene);
                sceneChangeCodeTriggered = Date.now();
            }
            catch (err) {
                (0, helpers_1.logError)('[Layouts] Could not change scene (on delay) [name: %s]', err, scene);
            }
        }
    }
    catch (err) {
        (0, helpers_1.logError)('[Layouts] Could not change scene [name: %s]', err, scene);
    }
    return true;
}
exports.changeScene = changeScene;
(0, nodecg_1.get)().listenFor('obsChangeScene', changeScene);
exports.default = obs;
