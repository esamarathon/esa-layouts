"use strict";
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
const streamdeck_util_1 = __importDefault(require("streamdeck-util"));
const nodecgApiContext = __importStar(require("./nodecg-api-context"));
const nodecg = nodecgApiContext.get();
const sd = new streamdeck_util_1.default();
if (nodecg.bundleConfig.streamdeck.enable) {
    sd.listen({
        key: nodecg.bundleConfig.streamdeck.key,
        port: nodecg.bundleConfig.streamdeck.port,
        debug: nodecg.bundleConfig.streamdeck.debug,
    });
    nodecg.log.info('Listening for Stream Deck connections.');
    sd.on('open', () => {
        nodecg.log.info('Stream Deck connection successful.');
    });
    sd.on('close', (code) => {
        nodecg.log.warn('Stream Deck connection lost (%s).', code);
    });
    sd.on('error', (err) => {
        nodecg.log.warn('Stream Deck connection error.');
        nodecg.log.debug('Stream Deck connection error:', err);
    });
}
exports.default = sd;
//# sourceMappingURL=stream-deck.js.map