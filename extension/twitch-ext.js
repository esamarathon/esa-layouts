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
const needle_1 = __importDefault(require("needle"));
const nodecgApiContext = __importStar(require("./util/nodecg-api-context"));
const nodecg_bundleconfig_1 = require("./util/nodecg-bundleconfig");
const nodecg = nodecgApiContext.get();
if (nodecg_bundleconfig_1.bundleConfig.twitchExt.enable && nodecg_bundleconfig_1.bundleConfig.twitchExt.token) {
    nodecg.listenFor('ffzUpdateFeaturedChannels', 'nodecg-speedcontrol', setButtons);
}
function setButtons(usernames) {
    return __awaiter(this, void 0, void 0, function* () {
        const userString = (usernames.length) ? usernames.join(',') : '';
        nodecg.log.info('Attempting to update Twitch extension "Featured Channels" information.');
        try {
            const resp = yield needle_1.default('get', `https://api.furious.pro/featuredchannels/bot/${nodecg_bundleconfig_1.bundleConfig.twitchExt.token}/${userString}`);
            if (resp.statusCode === 200) {
                nodecg.log.info('Successfully updated Twitch extension "Featured Channels" information.');
            }
            else {
                throw new Error('');
            }
        }
        catch (err) {
            nodecg.log.warn('Error updating Twitch extension "Featured Channels" information.');
        }
    });
}
//# sourceMappingURL=twitch-ext.js.map