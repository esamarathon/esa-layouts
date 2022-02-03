"use strict";
/**
 * Most commercials work is done in the "esa-commercials" bundle, but this code
 * runs alongside that to control certain functionality.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./util/helpers");
const nodecg_1 = require("./util/nodecg");
const speedcontrol_1 = require("./util/speedcontrol");
const streamdeck_1 = __importDefault(require("./util/streamdeck"));
// Replicants only applicable to this file from another bundle.
const disabled = (0, nodecg_1.get)().Replicant('disabled', 'esa-commercials');
/**
 * Correctly changes the title text on the Stream Deck "Disable Twitch Commercials" buttons.
 */
function changeDisableCommercialsSDTitle() {
    const text = (() => {
        if (disabled.value && !['stopped', 'finished'].includes(speedcontrol_1.sc.timer.value.state)) {
            return 'Ads\nDisabled\nfor Run';
        }
        if (speedcontrol_1.sc.twitchCommercialTimer.value.secondsRemaining > 0) {
            const minutes = Math.floor(speedcontrol_1.sc.twitchCommercialTimer.value.secondsRemaining / 60);
            const seconds = Math.floor(speedcontrol_1.sc.twitchCommercialTimer.value.secondsRemaining - minutes * 60);
            return `Ads\nPlaying:\n${minutes}:${(0, helpers_1.padTimeNumber)(seconds)}`;
        }
        if (['stopped', 'finished'].includes(speedcontrol_1.sc.timer.value.state)) {
            return '⚠\nCannot\nDisable\nAds';
        }
        return 'Disable\nAds for\nRun';
    })();
    streamdeck_1.default.setTextOnAllButtonsWithAction('com.esamarathon.streamdeck.twitchads', text);
}
async function setup() {
    // 10s check to see if esa-commercials is available alongside this bundle.
    // Doing it this way because we can't specificy both in bundleDependencies and need to check.
    for (let i = 0; i < 10; i += 1) {
        // If it's available, esa-commercials (as of writing) returns a pending promise.
        if (typeof (0, nodecg_1.get)().extensions['esa-commercials'] !== 'undefined') {
            break;
        }
        await (0, helpers_1.wait)(1000);
    }
    if ((0, nodecg_1.get)().extensions['esa-commercials']) {
        speedcontrol_1.sc.timer.on('change', (newVal, oldVal) => {
            if (newVal.state !== (oldVal === null || oldVal === void 0 ? void 0 : oldVal.state)) {
                changeDisableCommercialsSDTitle();
            }
        });
        disabled.on('change', () => {
            changeDisableCommercialsSDTitle();
        });
        speedcontrol_1.sc.twitchCommercialTimer.on('change', () => {
            changeDisableCommercialsSDTitle();
        });
        // What to do once Stream Deck connection is initialised.
        streamdeck_1.default.on('init', () => {
            changeDisableCommercialsSDTitle();
        });
        // What to do when a button "appears" in the Stream Deck software,
        // usually after dragging on a new instance.
        streamdeck_1.default.on('willAppear', (data) => {
            if (data.action.endsWith('twitchads')) {
                changeDisableCommercialsSDTitle();
            }
        });
        // What to do when any key is lifted on a connected Stream Deck.
        streamdeck_1.default.on('keyUp', async (data) => {
            if (data.action.endsWith('twitchads') && !disabled.value
                && !['stopped', 'finished'].includes(speedcontrol_1.sc.timer.value.state)) {
                // Sends a message to the esa-commercials bundle.
                // Because we are using server-to-server messages, no confirmation yet.
                (0, nodecg_1.get)().sendMessageToBundle('disable', 'esa-commercials');
                changeDisableCommercialsSDTitle();
                await (0, helpers_1.wait)(100); // Hopefully stop a race condition so below "OK" displays.
                streamdeck_1.default.send({ event: 'showOk', context: data.context });
            }
        });
    }
}
setup();
