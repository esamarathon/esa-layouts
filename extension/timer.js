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
const clone_1 = __importDefault(require("clone"));
const mqLogging = __importStar(require("./util/mq-logging"));
const nodecg_1 = require("./util/nodecg");
const obs_1 = __importDefault(require("./util/obs"));
const rabbitmq_1 = require("./util/rabbitmq");
const replicants_1 = require("./util/replicants");
const speedcontrol_1 = require("./util/speedcontrol");
const config = (0, nodecg_1.get)().bundleConfig;
// This code keeps a delayed copy of the timer synced to a delay value from external sources.
// If no delay is present (if not an online marathon), we just make a straight copy.
const timerDelayTO = [];
replicants_1.delayedTimer.value = (0, clone_1.default)(speedcontrol_1.sc.timer.value);
replicants_1.currentRunDelay.on('change', (newVal, oldVal) => {
    var _a;
    if (newVal.video !== (oldVal === null || oldVal === void 0 ? void 0 : oldVal.video) && timerDelayTO.length) {
        // Reset delayed timer to the same as normal timer.
        replicants_1.delayedTimer.value = (0, clone_1.default)(speedcontrol_1.sc.timer.value);
        // Clear all the irrelevant timeouts currently active.
        const timeouts = [];
        for (let i = 0; i < timerDelayTO.length;) {
            if (timerDelayTO[i] && timerDelayTO[i].delay !== newVal.video) {
                timeouts.push((_a = timerDelayTO.shift()) === null || _a === void 0 ? void 0 : _a.timeout);
            }
            else {
                i += 1;
            }
        }
        timeouts.forEach((timeout) => clearTimeout(timeout));
    }
});
speedcontrol_1.sc.timer.on('change', (val) => {
    const timerFreeze = (0, clone_1.default)(val);
    if (replicants_1.currentRunDelay.value.video === 0) {
        replicants_1.delayedTimer.value = timerFreeze;
    }
    else {
        timerDelayTO.push({
            delay: replicants_1.currentRunDelay.value.video,
            timeout: setTimeout(() => {
                replicants_1.delayedTimer.value = Object.assign(Object.assign({}, timerFreeze), { timestamp: Date.now() });
            }, replicants_1.currentRunDelay.value.video),
        });
    }
});
// Controls the nodecg-speedcontrol timer when the big buttons are pressed.
rabbitmq_1.mq.evt.on('bigbuttonPressed', async (data) => {
    var _a;
    // For stream 2, the buttons are offset by 4.
    const buttonId = config.event.thisEvent === 2
        ? data.button_id - 4
        : data.button_id;
    if (buttonId < 1 || (config.event.thisEvent === 1 && buttonId > 4))
        return;
    // If the button was pressed more than 10s ago, ignore it.
    if (data.time.unix < (Date.now() / 1000) - 10)
        return;
    // Stop/log warning if timestamp happens to be in the future.
    if (data.time.unix > (Date.now() / 1000) + 10) {
        (0, nodecg_1.get)().log.warn('[Timer] Big button unix timestamp is in the future, this is bad!');
        return;
    }
    const run = speedcontrol_1.sc.getCurrentRun();
    // Hardcoded different timer for Taskmaster.
    if (((_a = run === null || run === void 0 ? void 0 : run.game) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === 'taskmaster') {
        if (replicants_1.taskmasterTimestamps.value.start === null) { // Start
            replicants_1.taskmasterTimestamps.value.start = Date.now();
        }
        else if (replicants_1.taskmasterTimestamps.value.end === null) { // End
            replicants_1.taskmasterTimestamps.value.end = Date.now();
        }
        else {
            replicants_1.taskmasterTimestamps.value = { start: null, end: null }; // Reset
        }
        return;
    }
    let id = 0;
    // If more than 1 team, uses the big button player mapping to find out what team to stop.
    if (run && run.teams.length > 1) {
        const userTag = replicants_1.bigbuttonPlayerMap.value[buttonId];
        const teamIndex = run.teams.findIndex((t) => t.players.find((p) => userTag === null || userTag === void 0 ? void 0 : userTag.find((u) => u.user.displayName.toLowerCase() === p.name.toLowerCase())));
        if (teamIndex >= 0)
            id = teamIndex;
        else
            id = -1;
    }
    if (id < 0)
        return;
    try {
        // Note: the nodecg-speedcontrol bundle will check if it *can* do these actions,
        // we do not need to check that here.
        switch (speedcontrol_1.sc.timer.value.state) {
            case 'stopped':
            case 'paused':
                await speedcontrol_1.sc.startTimer();
                break;
            case 'running':
                // Only allow stop command to work if timer is more than 10s.
                if (speedcontrol_1.sc.timer.value.milliseconds > 10 * 1000) {
                    await speedcontrol_1.sc.stopTimer(id);
                }
                break;
            default:
                break;
        }
    }
    catch (err) {
        (0, nodecg_1.get)().log.debug('[Timer] Error changing timer state on bigbuttonPressed event:', err);
    }
});
// Enable/disable nodecg-speedcontrol timer changes if on/not on a game layout scene.
obs_1.default.on('currentSceneChanged', (current) => {
    if (current) {
        if (obs_1.default.isCurrentScene(config.obs.names.scenes.gameLayout)) {
            speedcontrol_1.sc.enableTimerChanges();
        }
        else {
            speedcontrol_1.sc.disableTimerChanges();
        }
    }
});
// Logs changes to the timer using helper function in logging.ts
// TODO: This may be changed!
speedcontrol_1.sc.on('timerStarted', () => mqLogging.logTimerChange('started'));
speedcontrol_1.sc.on('timerPaused', () => mqLogging.logTimerChange('paused'));
speedcontrol_1.sc.on('timerResumed', () => mqLogging.logTimerChange('resumed'));
speedcontrol_1.sc.on('timerStopped', () => mqLogging.logTimerChange('finished'));
speedcontrol_1.sc.on('timerReset', () => mqLogging.logTimerChange('reset'));
speedcontrol_1.sc.on('timerEdited', () => mqLogging.logTimerChange('edited'));
speedcontrol_1.sc.on('timerTeamStopped', (id) => mqLogging.logTimerChange('team_finished', id));
speedcontrol_1.sc.on('timerTeamUndone', (id) => mqLogging.logTimerChange('team_undid_finish', id));
