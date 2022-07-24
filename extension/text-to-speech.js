"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.speak = void 0;
const needle_1 = __importDefault(require("needle"));
const nodecg_1 = require("./util/nodecg");
const replicants_1 = require("./util/replicants");
const config = (0, nodecg_1.get)().bundleConfig.tts;
/**
 * Will attempt to trigger speech for the supplied donation.
 * @param donation Donation object
 */
// eslint-disable-next-line import/prefer-default-export
async function speak(donation) {
    const text = `${donation.name} donated $${donation.amount.toFixed(2)}`
        + `${donation.comment ? `: ${donation.comment}` : ''}`;
    const url = `${config.voiceAPI}?voice=${replicants_1.ttsVoices.value.selected}`
        + `&text=${encodeURIComponent(text)}&key=${config.key}`;
    (0, nodecg_1.get)().sendMessage('ttsToRead', url);
    (0, nodecg_1.get)().log.debug('[TTS] URL sent to overlay:', url);
}
exports.speak = speak;
/**
 * Plays an example donation message using the TTS.
 */
async function ttsExample() {
    try {
        const resp = await (0, needle_1.default)('get', 'https://taskinoz.com/gdq/api/');
        speak({
            amount: 100 * Math.random(),
            name: 'Anonymous',
            comment: resp.body,
            id: 0,
            timestamp: 0, // Fake timestamp
        });
    }
    catch (err) {
        // Silently drop for this example
    }
}
async function init() {
    try {
        (0, nodecg_1.get)().log.info('[TTS] Setting up');
        const resp = await (0, needle_1.default)('get', `${config.voiceAPI}/voices`);
        const list = resp.body.voices;
        replicants_1.ttsVoices.value.available = Object.keys(list).reduce((prev, code) => {
            // Only use voices using the Wavenet tech and that are English based.
            if (list[code].languageCode.includes('en-') && code.includes('Wavenet')) {
                prev.push({
                    code,
                    name: `${list[code].name} (${list[code].languageName}, ${list[code].gender})`,
                });
            }
            return prev;
        }, []);
        // Set the voice to a default if needed.
        if (!replicants_1.ttsVoices.value.selected) {
            replicants_1.ttsVoices.value.selected = 'en-US-Wavenet-A';
        }
        (0, nodecg_1.get)().listenFor('ttsExample', ttsExample);
        (0, nodecg_1.get)().log.info('[TTS] Successfully set up');
    }
    catch (err) {
        (0, nodecg_1.get)().log.warn('[TTS] Error setting up');
        (0, nodecg_1.get)().log.debug('[TTS] Error setting up:', err);
    }
}
if (config.enabled && config.voiceAPI) {
    init();
}
