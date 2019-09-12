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
const speedcontrol_util_1 = __importDefault(require("speedcontrol-util"));
const nodecgApiContext = __importStar(require("./util/nodecg-api-context"));
const nodecg_bundleconfig_1 = require("./util/nodecg-bundleconfig");
const obs_1 = __importDefault(require("./util/obs"));
const stream_deck_1 = __importDefault(require("./util/stream-deck"));
if (!nodecg_bundleconfig_1.bundleConfig.streamdeck.enable) {
    // @ts-ignore: Gonna do this anyway :)
    return;
}
const nodecg = nodecgApiContext.get();
const donationsToRead = nodecg.Replicant('donationsToRead', { defaultValue: [] });
const sc = new speedcontrol_util_1.default(nodecg);
let initDone = false;
let adEnds = 0;
let twitchAdPlaying = false;
stream_deck_1.default.on('init', () => {
    if (!initDone) {
        init();
    }
    initDone = true;
    twitchAdPlaying = false;
    adEnds = 0;
    // com.esamarathon.streamdeck.timer
    // Set default text on buttons.
    setTextOnAllButtonsWithAction('com.esamarathon.streamdeck.timer', 'Start\nTimer');
    setTextOnAllButtonsWithAction('com.esamarathon.streamdeck.twitchads', 'STEP 1\nTWITCH AD');
});
function init() {
    // com.esamarathon.streamdeck.timer
    // Controls the text on the buttons.
    sc.timer.on('change', (newVal) => {
        const buttons = stream_deck_1.default.findButtonsWithAction('com.esamarathon.streamdeck.timer');
        buttons.forEach((button) => {
            switch (newVal.state) {
                case 'stopped':
                    stream_deck_1.default.updateButtonText(button.context, 'Start\nTimer');
                    break;
                case 'running':
                    stream_deck_1.default.updateButtonText(button.context, 'Stop\nTimer');
                    break;
                case 'paused':
                    stream_deck_1.default.updateButtonText(button.context, 'Resume\nTimer');
                    break;
                case 'finished':
                    stream_deck_1.default.updateButtonText(button.context, 'Reset\nTimer');
                    break;
            }
        });
    });
    stream_deck_1.default.on('keyUp', (data) => {
        // com.esamarathon.streamdeck.timer
        // Controls the nodecg-speedcontrol timer when the button is pressed.
        // Currently the "Stop Timer" state only works if there's only 1 team.
        if (data.action === 'com.esamarathon.streamdeck.timer') {
            switch (sc.timer.value.state) {
                case 'stopped':
                case 'paused':
                    sc.startTimer();
                    break;
                case 'running':
                    sc.stopTimer();
                    break;
                case 'finished':
                    sc.resetTimer();
                    break;
            }
        }
        // com.esamarathon.streamdeck.twitchads
        if (data.action === 'com.esamarathon.streamdeck.twitchads' && !twitchAdPlaying) {
            obs_1.default.changeScene(nodecg.bundleConfig.obs.names.scenes.ads);
        }
        // com.esamarathon.streamdeck.ttsdonations
        if (data.action === 'com.esamarathon.streamdeck.ttsdonations') {
            const donation = (data.payload.settings && data.payload.settings.slot) ? data.payload.settings.slot : 0;
            const donationObj = donationsToRead.value[donation];
            if (donationObj) {
                nodecg.sendMessage('ttsSpeak', donationObj);
                nodecg.sendMessage('markDonationAsRead', donationObj.id);
            }
        }
        // com.esamarathon.streamdeck.donationread
        if (data.action === 'com.esamarathon.streamdeck.donationread') {
            const donation = (data.payload.settings && data.payload.settings.slot) ? data.payload.settings.slot : 0;
            const donationObj = donationsToRead.value[donation];
            if (donationObj) {
                nodecg.sendMessage('markDonationAsRead', donationObj.id);
            }
        }
    });
    nodecg.listenFor('twitchCommercialStarted', 'nodecg-speedcontrol', (adInfo) => {
        adEnds = Date.now() + adInfo.duration * 1000;
        updateAdCountdown();
        twitchAdPlaying = true;
    });
}
function setTextOnAllButtonsWithAction(action, text) {
    const buttons = stream_deck_1.default.findButtonsWithAction(action);
    buttons.forEach((button) => {
        stream_deck_1.default.updateButtonText(button.context, text);
    });
}
function updateAdCountdown() {
    const remainingAdTime = (adEnds - Date.now()) / 1000;
    if (remainingAdTime > 0) {
        const minutes = Math.floor(remainingAdTime / 60);
        const seconds = Math.floor(remainingAdTime - minutes * 60);
        setTextOnAllButtonsWithAction('com.esamarathon.streamdeck.twitchads', `Twitch Ad\nPlaying:\n${minutes}:${pad(seconds)}`);
        setTimeout(updateAdCountdown, 1000);
    }
    else {
        adEnds = 0;
        twitchAdPlaying = false;
        setTextOnAllButtonsWithAction('com.esamarathon.streamdeck.twitchads', 'STEP 1\nTWITCH AD');
    }
}
function pad(num) {
    return num.toString().padStart(2, '0');
}
//# sourceMappingURL=stream-deck-buttons.js.map