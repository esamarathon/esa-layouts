"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logVideoPlay = exports.logSponsorLogoChange = exports.logRunChange = exports.logTimerChange = exports.logSceneSwitch = exports.logStreamingStatusChange = void 0;
const mediabox_1 = __importDefault(require("./mediabox"));
const rabbitmq_1 = require("./rabbitmq");
const replicants_1 = require("./replicants");
const speedcontrol_1 = require("./speedcontrol");
/**
 * Logs OBS streaming status changes.
 * @param streaming If the streaming was started or stopped.
 */
function logStreamingStatusChange(streaming) {
    rabbitmq_1.mq.send(`obs.stream.${streaming ? 'start' : 'stop'}`, {
        streaming,
    });
}
exports.logStreamingStatusChange = logStreamingStatusChange;
/**
 * Logs OBS scene changes.
 * @param name Name of scene.
 * @param action If this is the start or end of the scene being shown.
 */
function logSceneSwitch(name, action, isGameScene) {
    rabbitmq_1.mq.send(`obs.scene.${name.replace(/[. ]/g, '_')}.${action}${isGameScene ? '.gamescene' : ''}`, {
        action,
        scene: name,
        gameScene: isGameScene,
    });
}
exports.logSceneSwitch = logSceneSwitch;
/**
 * Logs changes to the timer.
 * @param desc Description of change type.
 * @param teamID ID of team this change applies to, if applicable.
 */
function logTimerChange(desc, teamID) {
    rabbitmq_1.mq.send(`timer.${teamID ? `team.${teamID}.` : ''}${desc}`, {
        desc,
        teamID: teamID || undefined,
        timer: speedcontrol_1.sc.timer.value,
    });
}
exports.logTimerChange = logTimerChange;
/**
 * Logs the current run when triggered.
 * @param run: Run Data object.
 */
function logRunChange(run) {
    rabbitmq_1.mq.send('run.changed', {
        run,
    });
}
exports.logRunChange = logRunChange;
// TODO: stuff that is logged needs changing to be more accurate
//       We should add sum in case the name cannot be found, just as a backup
/**
 * Logos the current sponsor logo when triggered.
 * @param logo Sponsor logo object.
 */
function logSponsorLogoChange(logo) {
    const logoInfo = mediabox_1.default.mediaBox.value.rotation.find((l) => l.id === (logo === null || logo === void 0 ? void 0 : logo.id));
    const asset = replicants_1.assetsMediaBoxImages.value.find((a) => a.sum === (logo === null || logo === void 0 ? void 0 : logo.mediaUUID));
    rabbitmq_1.mq.send('sponsor.logo.changed', {
        logo: (logo === null || logo === void 0 ? void 0 : logo.type) === 'image' ? asset === null || asset === void 0 ? void 0 : asset.name : undefined,
        length: (logo === null || logo === void 0 ? void 0 : logo.type) === 'image' ? logoInfo === null || logoInfo === void 0 ? void 0 : logoInfo.seconds : undefined,
    });
}
exports.logSponsorLogoChange = logSponsorLogoChange;
function logVideoPlay(sum) {
    const asset = replicants_1.assetsVideos.value.find((a) => a.sum === sum);
    if (asset) {
        rabbitmq_1.mq.send('video.played', {
            name: asset.name,
        });
    }
}
exports.logVideoPlay = logVideoPlay;
