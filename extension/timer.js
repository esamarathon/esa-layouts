"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const speedcontrol_util_1 = __importDefault(require("speedcontrol-util"));
const logging_1 = require("./util/logging");
const nodecg_1 = require("./util/nodecg");
const obs_1 = __importDefault(require("./util/obs"));
const rabbitmq_1 = require("./util/rabbitmq");
const config = (0, nodecg_1.get)().bundleConfig;
const sc = new speedcontrol_util_1.default((0, nodecg_1.get)());
// Controls the nodecg-speedcontrol timer when the big buttons are pressed.
rabbitmq_1.mq.evt.on('bigbuttonPressed', async (data) => {
    // Only listen to this event on stream 1.
    if (config.event.thisEvent !== 1) {
        return;
    }
    // If the button was pressed more than 10s ago, ignore it.
    if (data.time.unix < (Date.now() / 1000) - 10) {
        return;
    }
    // Stop/log warning if timestamp happens to be in the future.
    if (data.time.unix > (Date.now() / 1000) + 10) {
        (0, nodecg_1.get)().log.warn('[Timer] Big button unix timestamp in the future, this is bad!');
        return;
    }
    const run = sc.getCurrentRun();
    const buttonID = (run && run.teams.length > 1) ? data.button_id - 1 : 0;
    try {
        // Note: the nodecg-speedcontrol bundle will check if it *can* do these actions,
        // we do not need to check that here.
        switch (sc.timer.value.state) {
            case 'stopped':
            case 'paused':
                await sc.startTimer();
                break;
            case 'running':
                if (sc.timer.value.milliseconds > 10 * 1000) {
                    await sc.stopTimer(buttonID);
                }
                break;
            default:
                // Don't do anything
                break;
        }
    }
    catch (err) {
        // Drop for now
    }
});
// Enable/disable nodecg-speedcontrol timer changes if on/not on a game layout scene.
obs_1.default.on('currentSceneChanged', (current) => {
    if (current) {
        if (obs_1.default.isCurrentScene(config.obs.names.scenes.gameLayout)) {
            sc.enableTimerChanges();
        }
        else {
            sc.disableTimerChanges();
        }
    }
});
// Logs changes to the timer using helper function in logging.ts
sc.on('timerStarted', () => (0, logging_1.logTimerChange)('started'));
sc.on('timerPaused', () => (0, logging_1.logTimerChange)('paused'));
sc.on('timerResumed', () => (0, logging_1.logTimerChange)('resumed'));
sc.on('timerStopped', () => (0, logging_1.logTimerChange)('finished'));
sc.on('timerReset', () => (0, logging_1.logTimerChange)('reset'));
sc.on('timerEdited', () => (0, logging_1.logTimerChange)('edited'));
sc.on('timerTeamStopped', (id) => (0, logging_1.logTimerChange)('team_finished', id));
sc.on('timerTeamUndone', (id) => (0, logging_1.logTimerChange)('team_undid_finish', id));
