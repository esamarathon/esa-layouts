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
const rabbitmq_1 = require("./util/rabbitmq");
if (!nodecg_bundleconfig_1.bundleConfig.rabbitmq.enable) {
    // @ts-ignore: Gonna do this anyway :)
    return;
}
const nodecg = nodecgApiContext.get();
const sc = new speedcontrol_util_1.default(nodecg);
// Controls the nodecg-speedcontrol timer when the big buttons are pressed.
rabbitmq_1.mq.on('bigbutton-pressed', (data) => {
    const buttonID = data.button_id - 1;
    // Make sure we're listening for the right message.
    // The message should *never* be used for anything else, but I like to be safe.
    if (!data.time && !data.button_message_count) {
        return;
    }
    // Note: the nodecg-speedcontrol bundle will check if it *can* do these actions,
    // we do not need to check that here.
    switch (sc.timer.value.state) {
        case 'stopped':
        case 'paused':
            sc.startTimer();
            break;
        case 'running':
            sc.stopTimer(buttonID);
            break;
        case 'finished':
            sc.resetTimer();
            break;
    }
});
//# sourceMappingURL=timer.js.map