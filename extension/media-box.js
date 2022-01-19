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
const mediabox_1 = __importDefault(require("./util/mediabox"));
const mqLogging = __importStar(require("./util/mq-logging"));
const nodecg_1 = require("./util/nodecg");
const obs_1 = __importDefault(require("./util/obs"));
/**
 * Everything in this file right now is related to RabbitMQ.
 * TODO: Should this be moved somewhere else?
 */
const obsConfig = (0, nodecg_1.get)().bundleConfig.obs;
/**
 * Check to know if a specified scene has sponsor logos in it or not.
 * @param name Name of scene to check; will be fully confirmed with OBS.
 */
function doesSceneHaveSponsorLogos(name) {
    if (!name) {
        return false;
    }
    // Hardcoded scenes that have sponsor logos on them as of "now".
    const scenes = [
        obs_1.default.findScene(obsConfig.names.scenes.gameLayout),
        obs_1.default.findScene(obsConfig.names.scenes.intermission),
        obs_1.default.findScene(obsConfig.names.scenes.commercials),
    ];
    const namedScene = obs_1.default.findScene(name);
    return scenes.includes(namedScene);
}
// Will log sponsors changing when going live/going offline if needed.
obs_1.default.on('streamingStatusChanged', (streaming, old) => {
    if (doesSceneHaveSponsorLogos(obs_1.default.currentScene)
        && mediabox_1.default.mediaBox.value.current && typeof old === 'boolean') {
        if (streaming) {
            mqLogging.logSponsorLogoChange(mediabox_1.default.mediaBox.value.current);
        }
        else {
            mqLogging.logSponsorLogoChange();
        }
    }
});
// Will log sponsors changing when the scene changes if needed.
obs_1.default.on('currentSceneChanged', (current, last) => {
    if (obs_1.default.streaming && mediabox_1.default.mediaBox.value.current && last) {
        const currentHas = doesSceneHaveSponsorLogos(current);
        const lastHas = doesSceneHaveSponsorLogos(last);
        if (currentHas && !lastHas) {
            mqLogging.logSponsorLogoChange(mediabox_1.default.mediaBox.value.current);
        }
        else if (!currentHas && lastHas) {
            mqLogging.logSponsorLogoChange();
        }
    }
});
mediabox_1.default.mediaBox.on('change', (newVal, oldVal) => {
    var _a, _b;
    if (((_a = newVal.current) === null || _a === void 0 ? void 0 : _a.id) !== ((_b = oldVal === null || oldVal === void 0 ? void 0 : oldVal.current) === null || _b === void 0 ? void 0 : _b.id)
        && obs_1.default.streaming && doesSceneHaveSponsorLogos(obs_1.default.currentScene)) {
        mqLogging.logSponsorLogoChange(newVal.current);
    }
});
