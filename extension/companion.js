"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const companion_1 = __importDefault(require("./util/companion"));
const nodecg_1 = require("./util/nodecg");
const replicants_1 = require("./util/replicants");
const speedcontrol_1 = require("./util/speedcontrol");
// Replicants only applicable to this file from another bundle.
const twitchCommercialsDisabled = (0, nodecg_1.get)().Replicant('disabled', 'esa-commercials');
// Sending replicant data on any changes.
speedcontrol_1.sc.timer.on('change', (value) => companion_1.default.send({ name: 'timer', value }));
speedcontrol_1.sc.timerChangesDisabled.on('change', (value) => (companion_1.default.send({ name: 'timerChangesDisabled', value })));
replicants_1.streamDeckData.on('change', (value) => companion_1.default.send({ name: 'streamDeckData', value }));
speedcontrol_1.sc.twitchCommercialTimer.on('change', (value) => (companion_1.default.send({ name: 'twitchCommercialTimer', value })));
twitchCommercialsDisabled.on('change', (value) => (companion_1.default.send({ name: 'twitchCommercialsDisabled', value })));
// Sending things on connection.
companion_1.default.evt.on('open', (socket) => {
    companion_1.default.send({ name: 'timer', value: speedcontrol_1.sc.timer.value }, socket);
    companion_1.default.send({ name: 'timerChangesDisabled', value: speedcontrol_1.sc.timerChangesDisabled.value }, socket);
    companion_1.default.send({ name: 'streamDeckData', value: replicants_1.streamDeckData.value });
    companion_1.default.send({ name: 'twitchCommercialTimer', value: speedcontrol_1.sc.twitchCommercialTimer.value });
    companion_1.default.send({ name: 'twitchCommercialsDisabled', value: twitchCommercialsDisabled.value });
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
    }
});
