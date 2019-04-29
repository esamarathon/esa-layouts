"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var nodecgApiContext = __importStar(require("./util/nodecg-api-context"));
var streamdeck_util_1 = __importDefault(require("streamdeck-util"));
var nodecg = nodecgApiContext.get();
var initDone = false;
var sd = new streamdeck_util_1.default({
    key: nodecg.bundleConfig.streamdeck.key,
    port: nodecg.bundleConfig.streamdeck.port,
    debug: nodecg.bundleConfig.streamdeck.debug,
});
sd.on('init', function () {
    if (!initDone) {
        init();
    }
    initDone = true;
    // com.esamarathon.streamdeck.timer
    // Set default text on buttons.
    var timerButtons = sd.findButtonsWithAction('com.esamarathon.streamdeck.timer');
    timerButtons.forEach(function (button) {
        sd.updateButtonText(button.context, 'Start\nTimer');
    });
});
function init() {
    // com.esamarathon.streamdeck.timer
    // Controls the text on the buttons.
    var timer = nodecg.Replicant('timer', 'nodecg-speedcontrol');
    timer.on('change', function (newVal, oldVal) {
        var buttons = sd.findButtonsWithAction('com.esamarathon.streamdeck.timer');
        buttons.forEach(function (button) {
            switch (newVal.state) {
                case 'stopped':
                    sd.updateButtonText(button.context, 'Start\nTimer');
                    break;
                case 'running':
                    sd.updateButtonText(button.context, 'Stop\nTimer');
                    break;
                case 'paused':
                    sd.updateButtonText(button.context, 'Resume\nTimer');
                    break;
                case 'finished':
                    sd.updateButtonText(button.context, 'Reset\nTimer');
                    break;
            }
        });
    });
    sd.on('keyUp', function (data) {
        // com.esamarathon.streamdeck.timer
        // Controls the nodecg-speedcontrol timer when the button is pressed.
        // USES "UNSUPPORTED" API STUFF, NEEDS CHANGING IN FUTURE.
        // ALSO nodecg.sendMessageToBundle NEEDS ADDING TO THEIR TYPINGS!
        if (data.action === 'com.esamarathon.streamdeck.timer') {
            switch (timer.value.state) {
                case 'stopped':
                case 'paused':
                    // @ts-ignore
                    nodecg.sendMessageToBundle('startTime', 'nodecg-speedcontrol');
                    break;
                case 'running':
                    // @ts-ignore
                    nodecg.sendMessageToBundle('finishTime', 'nodecg-speedcontrol');
                    break;
                case 'finished':
                    // @ts-ignore
                    nodecg.sendMessageToBundle('resetTime', 'nodecg-speedcontrol');
                    break;
            }
        }
    });
}
//# sourceMappingURL=streamdeck.js.map