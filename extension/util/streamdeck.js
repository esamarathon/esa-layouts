"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const streamdeck_util_1 = __importDefault(require("streamdeck-util"));
const nodecg_1 = require("./nodecg");
const config = (0, nodecg_1.get)().bundleConfig.streamdeck;
const sd = new streamdeck_util_1.default();
if (config.enabled) {
    sd.listen({
        key: config.key,
        port: config.port,
        debug: config.debug,
    });
    (0, nodecg_1.get)().log.info('[Stream Deck] Listening for connections');
    sd.on('open', () => {
        (0, nodecg_1.get)().log.info('[Stream Deck] Connection successful');
    });
    sd.on('close', (code) => {
        (0, nodecg_1.get)().log.warn('[Stream Deck] Connection lost (%s)', code);
    });
    sd.on('error', (err) => {
        (0, nodecg_1.get)().log.warn('[Stream Deck] Connection error');
        (0, nodecg_1.get)().log.debug('[Stream Deck] Connection error:', err);
    });
}
exports.default = sd;
