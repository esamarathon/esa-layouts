"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
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
const currentSponsorLogo = nodecg.Replicant('currentSponsorLogo', { persistent: false });
const obsGameLayoutScene = nodecg_bundleconfig_1.bundleConfig.obs.names.scenes.gameLayout;
let currentScene;
let lastScene;
let lastSponsorLogoSum;
let streaming = false;
// This will always be set due to there being a default in the configschema,
// make sure that is correct!
const evtString = (Array.isArray(nodecg_bundleconfig_1.bundleConfig.tracker.events)) ? nodecg_bundleconfig_1.bundleConfig.tracker.events[nodecg_bundleconfig_1.bundleConfig.tracker.streamEvent - 1] : nodecg_bundleconfig_1.bundleConfig.tracker.events;
obs_1.default.on('ConnectionOpened', () => __awaiter(this, void 0, void 0, function* () {
    try {
        const sceneData = yield obs_1.default.send('GetCurrentScene');
        const streamingData = yield obs_1.default.send('GetStreamingStatus');
        streaming = streamingData.streaming;
        lastScene = currentScene;
        currentScene = sceneData.name;
        if (lastScene === currentScene) {
            return;
        }
        if (lastScene) {
            logSceneSwitch(lastScene, 'end');
        }
        logSceneSwitch(currentScene, 'start');
        checkSponsorLogoVisibility();
    }
    catch (err) {
        // silently drop it for now
    }
}));
obs_1.default.on('SwitchScenes', (data) => {
    lastScene = currentScene;
    currentScene = data['scene-name'];
    if (lastScene === currentScene) {
        return;
    }
    logSceneSwitch(lastScene, 'end');
    logSceneSwitch(currentScene, 'start');
    checkSponsorLogoVisibility();
});
obs_1.default.on('StreamStarted', () => {
    streaming = true;
    checkSponsorLogoVisibility();
});
obs_1.default.on('StreamStopped', () => {
    streaming = false;
    logSponsorLogoChange();
});
// Currently also logs when the server starts up, do we need to change that?
sc.runDataActiveRun.on('change', logRunChange);
sc.on('timerStarted', () => logTimerChange('started'));
sc.on('timerPaused', () => logTimerChange('paused'));
sc.on('timerResumed', () => logTimerChange('resumed'));
sc.on('timerStopped', () => logTimerChange('finished'));
sc.on('timerReset', () => logTimerChange('reset'));
sc.on('timerEdited', () => logTimerChange('edited'));
sc.on('timerTeamStopped', id => logTimerChange('team_finished', id));
sc.on('timerTeamStopUndone', id => logTimerChange('team_undid_finish', id));
// Currently check to see if the sponsor logo is visible is "hardcoded" to certain layouts.
function checkSponsorLogoVisibility() {
    if (streaming && currentScene) {
        const scene = currentScene.toLowerCase();
        const intermission = nodecg_bundleconfig_1.bundleConfig.obs.names.scenes.intermission.toLowerCase();
        const gameLayout = nodecg_bundleconfig_1.bundleConfig.obs.names.scenes.gameLayout.toLowerCase();
        if ((scene.includes(intermission) && !scene.includes('hosts')) || scene.includes(gameLayout)) {
            logSponsorLogoChange(currentSponsorLogo.value);
        }
        else {
            logSponsorLogoChange();
        }
    }
}
currentSponsorLogo.on('change', () => {
    checkSponsorLogoVisibility();
});
function getTimeInfo() {
    const nowDate = new Date();
    return {
        unix: nowDate.getTime() / 1000,
        iso: nowDate.toISOString(),
    };
}
function logSceneSwitch(name, action = 'start') {
    const isGameScene = name === obsGameLayoutScene;
    const safeName = name.replace(/[. ]/g, '_');
    const gameSceneSuffix = isGameScene ? '.gamescene' : '';
    rabbitmq_1.send(`obs.scene.${safeName}.${action}${gameSceneSuffix}`, {
        action,
        event: evtString,
        scene: name,
        gameScene: isGameScene,
        time: getTimeInfo(),
    });
}
function logTimerChange(desc, teamID) {
    const teamFix = teamID ? `team.${teamID}.` : '';
    rabbitmq_1.send(`timer.${teamFix}${desc}`, {
        desc,
        event: evtString,
        teamID: teamID || undefined,
        timer: sc.timer.value,
        time: getTimeInfo(),
    });
}
function logRunChange() {
    rabbitmq_1.send('run.changed', {
        event: evtString,
        run: sc.getCurrentRun(),
        time: getTimeInfo(),
    });
}
function logSponsorLogoChange(logo) {
    // Don't log if the logo didn't actually change.
    const currentSum = (logo) ? logo.sum : undefined;
    if (lastSponsorLogoSum !== currentSum) {
        lastSponsorLogoSum = currentSum;
        rabbitmq_1.send('sponsor.logo.changed', {
            logo: (logo) ? logo.name : undefined,
            length: (logo) ? logo.seconds : undefined,
            event: evtString,
            time: getTimeInfo(),
        });
    }
}
//# sourceMappingURL=logging.js.map