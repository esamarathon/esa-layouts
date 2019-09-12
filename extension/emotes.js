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
const nodecg = nodecgApiContext.get();
const refreshTime = 1800000; // Get emotes every 30m.
const url = 'https://twitchemotes.com/api_cache/v3/global.json';
const emotes = nodecg.Replicant('emotes');
getTwitchEmotes();
setInterval(getTwitchEmotes, refreshTime);
// Get Twitch global emoticons.
function getTwitchEmotes() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const resp = yield needle_1.default('get', url);
            if (resp.statusCode === 200) {
                emotes.value = resp.body;
            }
            else {
                nodecg.log.warn('Error updating Twitch emoticons (%s).', resp.statusCode);
            }
        }
        catch (err) {
            nodecg.log.warn('Error updating Twitch emoticons.');
            nodecg.log.debug('Error updating Twitch emoticons:', err);
        }
    });
}
//# sourceMappingURL=emotes.js.map