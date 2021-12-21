"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const needle_1 = __importDefault(require("needle"));
const nodecg_1 = require("./util/nodecg");
const replicants_1 = require("./util/replicants");
const config = (0, nodecg_1.get)().bundleConfig.twitchExt;
async function setChannels(usernames) {
    (0, nodecg_1.get)().log.info('[Twitch Ext] Attempting to update');
    try {
        const resp = await (0, needle_1.default)('get', `https://api.furious.pro/featuredchannels/bot/${config.token}/${usernames.join(',')}`);
        if (resp.statusCode === 200) {
            (0, nodecg_1.get)().log.info('[Twitch Ext] Successfully updated');
        }
        else {
            throw new Error(`Status Code ${resp.statusCode}`);
        }
    }
    catch (err) {
        (0, nodecg_1.get)().log.warn('[Twitch Ext] Error updating');
        (0, nodecg_1.get)().log.debug('[Twitch Ext] Error updating:', err);
    }
}
if (config.enable && config.token) {
    // Poor way of doing this, should change in the future/include in nodecg-speedcontrol.
    replicants_1.twitchAPIData.on('change', (newV, oldV) => {
        if (oldV && !lodash_1.default.isEqual(lodash_1.default.sortBy(newV.featuredChannels), lodash_1.default.sortBy(oldV.featuredChannels))) {
            setChannels(newV.featuredChannels);
        }
    });
}
