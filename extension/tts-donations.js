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
const clone_1 = __importDefault(require("clone"));
const needle_1 = __importDefault(require("needle"));
const nodecgApiContext = __importStar(require("./util/nodecg-api-context"));
const nodecg_bundleconfig_1 = require("./util/nodecg-bundleconfig");
if (!nodecg_bundleconfig_1.bundleConfig.tts.enable || !nodecg_bundleconfig_1.bundleConfig.tts.altVoiceAPI) {
    // @ts-ignore: Gonna do this anyway :)
    return;
}
const nodecg = nodecgApiContext.get();
const voices = [];
const availableVoices = nodecg.Replicant('ttsVoices', { defaultValue: [] });
const chosenVoice = nodecg.Replicant('ttsChosenVoice');
getAvailableVoices();
function getAvailableVoices() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const resp = yield needle_1.default('get', `${nodecg_bundleconfig_1.bundleConfig.tts.altVoiceAPI}/voices`);
            const voiceList = resp.body.voices;
            Object.keys(voiceList).forEach((code) => {
                // Only use voices using the Wavenet tech and that are English based.
                if (voiceList[code].languageCode.includes('en-') && code.includes('Wavenet')) {
                    voices.push({
                        code,
                        // tslint:disable-next-line: max-line-length
                        name: `${voiceList[code].name} (${voiceList[code].languageName}, ${voiceList[code].gender})`,
                    });
                }
            });
            availableVoices.value = clone_1.default(voices);
            // Set the voice to a default if needed.
            if (!chosenVoice.value) {
                chosenVoice.value = 'en-US-Wavenet-A';
            }
            nodecg.listenFor('ttsSpeak', speak);
            nodecg.listenFor('ttsSpeakExample', () => __awaiter(this, void 0, void 0, function* () {
                const amount = 100 * Math.random();
                try {
                    const resp = yield needle_1.default('get', 'https://taskinoz.com/gdq/api/');
                    speak({
                        amount,
                        name: 'Anonymous',
                        comment: resp.body,
                    });
                }
                catch (err) {
                    // silently drop for now
                }
            }));
        }
        catch (err) {
            // silently drop for now
        }
    });
}
function speak(donation) {
    return __awaiter(this, void 0, void 0, function* () {
        let text = `${donation.name} donated $${donation.amount.toFixed(2)}`;
        if (donation.comment)
            text += `: ${donation.comment}`;
        // tslint:disable-next-line: max-line-length
        const url = `${nodecg_bundleconfig_1.bundleConfig.tts.altVoiceAPI}?voice=${chosenVoice.value}&text=${encodeURIComponent(text)}`;
        nodecg.sendMessage('ttsToBeRead', url);
        nodecg.log.debug('TTS URL: %s', url);
    });
}
//# sourceMappingURL=tts-donations.js.map