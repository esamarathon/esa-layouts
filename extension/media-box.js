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
const discord_js_1 = require("discord.js");
const mediabox_1 = __importDefault(require("./util/mediabox"));
const mqLogging = __importStar(require("./util/mq-logging"));
const nodecg_1 = require("./util/nodecg");
const obs_1 = __importDefault(require("./util/obs"));
/**
 * Lots of stuff in this file right now is related to RabbitMQ.
 * TODO: Should this be moved somewhere else?
 */
const config = (0, nodecg_1.get)().bundleConfig;
const discord = new discord_js_1.Client({ intents: [discord_js_1.Intents.FLAGS.GUILDS] });
// Discord integration, used to listen for speedrunstore.com purchase notifications.
if (config.discord.enabled) {
    (0, nodecg_1.get)().log.info('[Media Box] Discord integration enabled');
    discord.on('ready', async () => {
        (0, nodecg_1.get)().log.info('[Media Box] Discord bot connection ready');
    });
    discord.on('error', () => {
        (0, nodecg_1.get)().log.warn('[Media Box] Discord bot connection error');
    });
    discord.on('disconnect', () => {
        (0, nodecg_1.get)().log.warn('[Media Box] Discord bot disconnected, will reconnect');
        setTimeout(() => {
            discord.login(config.discord.token);
        }, 10 * 1000);
    });
    discord.on('messageCreate', (msg) => {
        var _a, _b;
        (0, nodecg_1.get)().log.debug('[Media Box] Received Discord "messageCreate" event, '
            + 'id: %s - textChannelId: %s - webhookId: %s - content: %s', msg.id, msg.channelId, msg.webhookId, msg.content);
        // if (msg.channelId === config.discord.textChannelId && msg.webhookId !== null) {
        if (msg.channelId === config.discord.textChannelId) {
            (0, nodecg_1.get)().log.debug('[Media Box] Discord message with ID %s came from the correct channel', msg.id);
            const user = (_a = msg.content.match(/\*(.*?)\*/g)) === null || _a === void 0 ? void 0 : _a[0].replace(/\*/g, '');
            const productName = msg.embeds[0].fields[0].name;
            const imgURL = (_b = msg.embeds[0].image) === null || _b === void 0 ? void 0 : _b.url;
            (0, nodecg_1.get)().log.debug('[Media Box] Information parsed from Discord message, '
                + 'user: %s - productName: %s - imgURL: %s', user, productName, imgURL);
            if (user && productName && imgURL) {
                (0, nodecg_1.get)().log.debug('[Media Box] Discord message contained all correct info');
                mediabox_1.default.pushMerchPurchase({ user, productName, imgURL });
            }
        }
    });
    discord.login(config.discord.token);
}
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
        obs_1.default.findScene(config.obs.names.scenes.gameLayout),
        obs_1.default.findScene(config.obs.names.scenes.intermission),
        obs_1.default.findScene(config.obs.names.scenes.commercials),
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
