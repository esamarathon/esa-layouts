"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const speedcontrol_util_1 = __importDefault(require("speedcontrol-util"));
const text_to_speech_1 = require("./text-to-speech");
const tracker_donations_1 = require("./tracker-donations");
const helpers_1 = require("./util/helpers");
const nodecg_1 = require("./util/nodecg");
const obs_1 = __importDefault(require("./util/obs"));
const replicants_1 = require("./util/replicants");
const streamdeck_1 = __importDefault(require("./util/streamdeck"));
const config = (0, nodecg_1.get)().bundleConfig;
const sc = new speedcontrol_util_1.default((0, nodecg_1.get)());
const defaultCommercialText = 'STEP 1\nTWITCH AD';
const defaultTimerText = 'Start\nTimer';
function init() {
    // com.esamarathon.streamdeck.timer
    // Controls the text on the buttons.
    sc.timer.on('change', (val) => {
        const buttons = streamdeck_1.default.findButtonsWithAction('com.esamarathon.streamdeck.timer');
        buttons.forEach((button) => {
            switch (val.state) {
                case 'running':
                    streamdeck_1.default.updateButtonText(button.context, 'Stop\nTimer');
                    break;
                case 'paused':
                    streamdeck_1.default.updateButtonText(button.context, 'Resume\nTimer');
                    break;
                case 'finished':
                    streamdeck_1.default.updateButtonText(button.context, 'Reset\nTimer');
                    break;
                case 'stopped':
                default:
                    streamdeck_1.default.updateButtonText(button.context, defaultTimerText);
                    break;
            }
        });
    });
    // com.esamarathon.streamdeck.twitchads
    // Set text on commercial timer button depending on state.
    sc.twitchCommercialTimer.on('change', (val) => {
        if (val.secondsRemaining > 0) {
            const minutes = Math.floor(val.secondsRemaining / 60);
            const seconds = Math.floor(val.secondsRemaining - minutes * 60);
            streamdeck_1.default.setTextOnAllButtonsWithAction('com.esamarathon.streamdeck.twitchads', `Twitch Ad\nPlaying:\n${minutes}:${(0, helpers_1.padTimeNumber)(seconds)}`);
        }
        else {
            streamdeck_1.default.setTextOnAllButtonsWithAction('com.esamarathon.streamdeck.twitchads', defaultCommercialText);
        }
    });
    streamdeck_1.default.on('keyUp', async (data) => {
        // com.esamarathon.streamdeck.timer
        // Controls the nodecg-speedcontrol timer when the button is pressed.
        // Currently the "Stop Timer" state works if there's only 1 team.
        if (data.action === 'com.esamarathon.streamdeck.timer') {
            try {
                // Note: the nodecg-speedcontrol bundle will check if it *can* do these actions,
                // we do not need to check that here.
                switch (sc.timer.value.state) {
                    case 'stopped':
                    case 'paused':
                        await sc.startTimer();
                        break;
                    case 'running':
                        await sc.stopTimer();
                        break;
                    case 'finished':
                        await sc.resetTimer();
                        break;
                    default:
                        // Don't do anything
                        break;
                }
            }
            catch (err) {
                // Drop for now
            }
        }
        // com.esamarathon.streamdeck.twitchads
        if (data.action === 'com.esamarathon.streamdeck.twitchads'
            && sc.twitchCommercialTimer.value.secondsRemaining <= 0) {
            try {
                await obs_1.default.changeScene(config.obs.names.scenes.commercials);
            }
            catch (err) {
                (0, nodecg_1.get)().log.warn('[Stream Deck Buttons] Could not run Twitch commercials');
                (0, nodecg_1.get)().log.debug('[Stream Deck Buttons] Could not run Twitch commercials:', err);
            }
        }
        // com.esamarathon.streamdeck.ttsdonations
        if (data.action === 'com.esamarathon.streamdeck.ttsdonations') {
            const donationIndex = (data.payload.settings && data.payload.settings.slot) ? data.payload.settings.slot : 0;
            const donation = replicants_1.donationsToRead.value[donationIndex];
            if (donation) {
                (0, text_to_speech_1.speak)(donation);
                (0, tracker_donations_1.markDonationAsRead)(donation.id);
            }
        }
        // com.esamarathon.streamdeck.donationread
        if (data.action === 'com.esamarathon.streamdeck.donationread') {
            const donationIndex = (data.payload.settings && data.payload.settings.slot) ? data.payload.settings.slot : 0;
            const donation = replicants_1.donationsToRead.value[donationIndex];
            if (donation) {
                (0, tracker_donations_1.markDonationAsRead)(donation.id);
            }
        }
        // com.esamarathon.streamdeck.playerhudtrigger-message
        if (data.action.startsWith('com.esamarathon.streamdeck.playerhudtrigger')) {
            const msgBtns = streamdeck_1.default
                .findButtonsWithAction('com.esamarathon.streamdeck.playerhudtrigger-message');
            msgBtns.forEach((btn) => {
                streamdeck_1.default.updateButtonText(btn.context, 'Message\nTo Read');
            });
            if (replicants_1.streamDeckData.value.playerHUDTriggerType
                && data.action.includes(replicants_1.streamDeckData.value.playerHUDTriggerType)) {
                delete replicants_1.streamDeckData.value.playerHUDTriggerType;
            }
            else if (data.action.includes('message')) {
                streamdeck_1.default.updateButtonText(data.context, '(ACTIVE)\nMessage\nTo Read');
                replicants_1.streamDeckData.value.playerHUDTriggerType = 'message';
            }
        }
    });
}
let initTriggered = false;
streamdeck_1.default.on('init', () => {
    // Set default text on buttons.
    streamdeck_1.default.setTextOnAllButtonsWithAction('com.esamarathon.streamdeck.timer', defaultTimerText);
    streamdeck_1.default.setTextOnAllButtonsWithAction('com.esamarathon.streamdeck.twitchads', defaultCommercialText);
    // Clearing this on initial connection for now for simplicity.
    delete replicants_1.streamDeckData.value.playerHUDTriggerType;
    // Only run this code once every fresh start.
    if (!initTriggered) {
        init();
        initTriggered = true;
    }
});
