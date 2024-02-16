"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
const companion_1 = __importDefault(require("./util/companion"));
const nodecg_1 = require("./util/nodecg");
const obs_1 = __importStar(require("./util/obs"));
const replicants_1 = require("./util/replicants");
const speedcontrol_1 = require("./util/speedcontrol");
const config = (0, nodecg_1.get)().bundleConfig;
// Replicants only applicable to this file from another bundle.
const twitchCommercialsDisabled = (0, nodecg_1.get)().Replicant('disabled', 'esa-commercials');
// Sending replicant data on any changes.
speedcontrol_1.sc.timer.on('change', (value) => companion_1.default.send({ name: 'timer', value }));
speedcontrol_1.sc.timerChangesDisabled.on('change', (value) => (companion_1.default.send({ name: 'timerChangesDisabled', value })));
replicants_1.streamDeckData.on('change', (value) => companion_1.default.send({ name: 'streamDeckData', value }));
speedcontrol_1.sc.twitchCommercialTimer.on('change', (value) => (companion_1.default.send({ name: 'twitchCommercialTimer', value })));
twitchCommercialsDisabled.on('change', (value) => (companion_1.default.send({ name: 'twitchCommercialsDisabled', value })));
replicants_1.obsData.on('change', (value) => (companion_1.default.send({ name: 'obsData', value: Object.assign(Object.assign({}, value), { gameLayoutScreenshot: undefined }) })));
// Sending things on connection.
companion_1.default.evt.on('open', (socket) => {
    companion_1.default.send({ name: 'timer', value: speedcontrol_1.sc.timer.value }, socket);
    companion_1.default.send({ name: 'timerChangesDisabled', value: speedcontrol_1.sc.timerChangesDisabled.value }, socket);
    companion_1.default.send({ name: 'streamDeckData', value: replicants_1.streamDeckData.value });
    companion_1.default.send({ name: 'twitchCommercialTimer', value: speedcontrol_1.sc.twitchCommercialTimer.value });
    companion_1.default.send({ name: 'twitchCommercialsDisabled', value: twitchCommercialsDisabled.value });
    companion_1.default.send({ name: 'obsData', value: Object.assign(Object.assign({}, replicants_1.obsData.value), { gameLayoutScreenshot: undefined }) });
    companion_1.default.send({ name: 'cfgScenes', value: (0, nodecg_1.get)().bundleConfig.obs.names.scenes });
});
// Listening for any actions triggered from Companion.
companion_1.default.evt.on('action', async (name, value) => {
    // Controls the nodecg-speedcontrol timer.
    // Currently the "Stop Timer" state works if there's only 1 team.
    // TODO: Add team support.
    if (name === 'timer_toggle') {
        try {
            // Note: the nodecg-speedcontrol bundle will check if it *can* do these actions,
            // we do not need to check that here.
            switch (speedcontrol_1.sc.timer.value.state) {
                case 'stopped':
                case 'paused':
                    await speedcontrol_1.sc.startTimer();
                    break;
                case 'running':
                    await speedcontrol_1.sc.stopTimer();
                    break;
                case 'finished':
                    await speedcontrol_1.sc.resetTimer();
                    break;
                default:
                    // Don't do anything
                    break;
            }
        }
        catch (err) {
            // Drop for now
        }
        // Used to toggle the "Player HUD Trigger" type.
    }
    else if (name === 'player_hud_trigger_toggle') {
        const val = value;
        if (replicants_1.streamDeckData.value.playerHUDTriggerType === val) {
            delete replicants_1.streamDeckData.value.playerHUDTriggerType;
        }
        else {
            replicants_1.streamDeckData.value.playerHUDTriggerType = val;
        }
        // Used to disable the Twitch commercials for the remainder of a run.
    }
    else if (name === 'twitch_commercials_disable') {
        if (!twitchCommercialsDisabled.value
            && !['stopped', 'finished'].includes(speedcontrol_1.sc.timer.value.state)) {
            // Sends a message to the esa-commercials bundle.
            // Because we are using server-to-server messages, no confirmation yet.
            (0, nodecg_1.get)().sendMessageToBundle('disable', 'esa-commercials');
        }
        // Used to cycle scenes if applicable, usually used by hosts.
        // Some of this is copied from obs-data.ts
    }
    else if (name === 'scene_cycle') {
        const { disableTransitioning, transitioning, connected } = replicants_1.obsData.value;
        const { scenes } = config.obs.names;
        // If transitioning is disabled, or we *are* transitioning, and OBS is connected,
        // and the timer is not running or paused, we can trigger these actions.
        if (!disableTransitioning && !transitioning && connected
            && !['running', 'paused'].includes(speedcontrol_1.sc.timer.value.state)) {
            // If the current scene is any of the applicable intermission ones, the next scene
            // will be the game layout, so change to it.
            if (obs_1.default.isCurrentScene(scenes.commercials)
                || obs_1.default.isCurrentScene(scenes.intermission)
                || obs_1.default.isCurrentScene(scenes.intermissionCrowd)) {
                await (0, obs_1.changeScene)({ scene: config.obs.names.scenes.gameLayout });
                // If the current scene is the game layout, the next scene will be the intermission,
                // so change to it.
            }
            else if (obs_1.default.isCurrentScene(scenes.gameLayout)) {
                // If the commercial intermission scene exists, use that, if not, use the regular one.
                if (obs_1.default.findScene(scenes.commercials)) {
                    await (0, obs_1.changeScene)({ scene: scenes.commercials });
                }
                else {
                    await (0, obs_1.changeScene)({ scene: scenes.intermission });
                }
            }
        }
        // Used to change between intermission scenes using a supplied scene name config key.
    }
    else if (name === 'intermission_scene_change') {
        const { scenes } = config.obs.names;
        const val = value;
        const scene = scenes[val];
        await (0, obs_1.changeScene)({ scene, force: true });
    }
});
