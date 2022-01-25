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
exports.searchSrcomPronouns = void 0;
const audio_normaliser_1 = __importDefault(require("@shared/extension/audio-normaliser"));
const helpers_1 = require("./util/helpers");
const mqLogging = __importStar(require("./util/mq-logging"));
const nodecg_1 = require("./util/nodecg");
const obs_1 = __importDefault(require("./util/obs"));
const rabbitmq_1 = require("./util/rabbitmq");
const replicants_1 = require("./util/replicants");
const speedcontrol_1 = require("./util/speedcontrol");
const config = (0, nodecg_1.get)().bundleConfig;
new audio_normaliser_1.default((0, nodecg_1.get)()); // eslint-disable-line no-new
// Increase max listeners on the nodecg-speedcontrol timer a bit to stop errors.
// This may want to be moved to that bundle directly in the future? It impacts all bundles!
speedcontrol_1.sc.timer.setMaxListeners(20);
replicants_1.serverTimestamp.value = Date.now();
setInterval(() => { replicants_1.serverTimestamp.value = Date.now(); }, 100);
// Screened data from our moderation tool.
rabbitmq_1.mq.evt.on('newScreenedSub', (data) => {
    (0, nodecg_1.get)().log.debug('[Misc] Received new subscription');
    (0, nodecg_1.get)().sendMessage('newSub', data);
});
rabbitmq_1.mq.evt.on('newScreenedCheer', (data) => {
    (0, nodecg_1.get)().log.debug('[Misc] Received new cheer');
    (0, nodecg_1.get)().sendMessage('newCheer', data);
});
// Information that should come from our 2nd stream.
rabbitmq_1.mq.evt.on('runChanged', (data) => {
    if ((0, helpers_1.getOtherStreamEventShort)() === data.event) {
        replicants_1.otherStreamData.value.runData = data.run || null;
        (0, nodecg_1.get)().log.debug('[Misc] Received modified run data from other stream');
    }
});
rabbitmq_1.mq.evt.on('gameSceneChanged', (data) => {
    if ((0, helpers_1.getOtherStreamEventShort)() === data.event) {
        (0, nodecg_1.get)().log.debug('[Misc] Received game scene change from other stream:', data.action);
        if (data.action === 'start') {
            replicants_1.otherStreamData.value.show = true;
        }
        else if (data.action === 'end') {
            replicants_1.otherStreamData.value.show = false;
        }
    }
});
let init = false;
speedcontrol_1.sc.runDataActiveRun.on('change', (newVal, oldVal) => {
    // Reset the commentators when the run changes and
    // not on the game layout scene (if OBS is connected).
    if ((oldVal === null || oldVal === void 0 ? void 0 : oldVal.id) !== (newVal === null || newVal === void 0 ? void 0 : newVal.id)
        && ((!obs_1.default.connected && init)
            || (obs_1.default.connected && !obs_1.default.isCurrentScene(config.obs.names.scenes.gameLayout)))) {
        replicants_1.commentators.value.length = 0;
        replicants_1.bigbuttonPlayerMap.value = {};
        // If not online, we clear the teams on start, which will be re-added by scanning tags.
        // TODO: Reselecting the current run would overwrite them, but not much I can do right now!
        if (!config.event.online && speedcontrol_1.sc.runDataActiveRun.value) {
            speedcontrol_1.sc.runDataActiveRun.value.teams = [];
            (0, nodecg_1.get)().log.debug('[Misc] Removed active run teams on run change');
        }
        (0, nodecg_1.get)().log.debug('[Misc] Cleared commentators and big button player mapping');
    }
    // This will also be triggered on server start up.
    mqLogging.logRunChange(newVal);
    init = true;
});
// Update replicant that stores the ID of the upcoming run,
// both on timer stopping, if you somehow have no current run
// (usually if you're at the start of the run list),
// and also via a "force" button on the dashboard.
speedcontrol_1.sc.on('timerStopped', () => {
    replicants_1.upcomingRunID.value = speedcontrol_1.sc.runDataActiveRunSurrounding.value.next || null;
});
speedcontrol_1.sc.runDataActiveRunSurrounding.on('change', (newVal) => {
    if (!newVal.current) {
        replicants_1.upcomingRunID.value = newVal.next || null;
    }
});
(0, nodecg_1.get)().listenFor('forceUpcomingRun', (id) => {
    // Check supplied run ID exists in our array.
    const run = speedcontrol_1.sc.runDataArray.value.find((r) => r.id === id);
    replicants_1.upcomingRunID.value = (run === null || run === void 0 ? void 0 : run.id) || null;
});
// Helper function to get pronouns of a specified user name from speedrun.com
// eslint-disable-next-line import/prefer-default-export
async function searchSrcomPronouns(val) {
    var _a;
    const name = val.replace(/\((.*?)\)/g, '').trim();
    let pronouns = (_a = (val.match(/\((.*?)\)/g) || [])[0]) === null || _a === void 0 ? void 0 : _a.replace(/[()]/g, '');
    if (!pronouns) {
        const data = await speedcontrol_1.sc.sendMessage('srcomSearchForUserDataMultiple', [
            { type: 'twitch', val: name },
            { type: 'name', val: name },
        ]);
        pronouns = (0, helpers_1.formatPronouns)((data === null || data === void 0 ? void 0 : data.pronouns) || '') || '';
    }
    return pronouns ? `${name} (${pronouns})` : name;
}
exports.searchSrcomPronouns = searchSrcomPronouns;
// Processes adding commentators from the dashboard panel.
(0, nodecg_1.get)().listenFor('commentatorAdd', async (val, ack) => {
    if (val) {
        const str = await searchSrcomPronouns(val);
        if (!replicants_1.commentators.value.includes(str)) {
            replicants_1.commentators.value.push(str);
        }
    }
    if (ack && !ack.handled) {
        ack(null);
    }
});
// Processes modifying the reader from the dasboard panel.
(0, nodecg_1.get)().listenFor('readerModify', async (val, ack) => {
    if (!val) {
        replicants_1.donationReader.value = null;
    }
    else {
        replicants_1.donationReader.value = await searchSrcomPronouns(val);
    }
    if (ack && !ack.handled) {
        ack(null);
    }
});
