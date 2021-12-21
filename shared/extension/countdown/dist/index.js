"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var path_1 = __importDefault(require("path"));
/**
 * Calculates the absolute file path to one of our local replicant schemas.
 * @param schemaName the replicant/schema filename.
 */
function buildSchemaPath(schemaName) {
    return path_1.default.resolve(__dirname, '../../../schemas', encodeURIComponent(schemaName) + ".json");
}
var MediaBox = /** @class */ (function () {
    function MediaBox(nodecg) {
        var _this = this;
        // this.nodecg = nodecg;
        this.countdown = nodecg.Replicant('countdown', { schemaPath: buildSchemaPath('countdown') });
        nodecg.listenFor('startCountdown', function (time) {
            if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
                return;
            }
            var now = new Date();
            var then = new Date(now.getFullYear(), now.getMonth(), now.getDate(), Number(time.split(':')[0]), Number(time.split(':')[1]));
            if (_this.countdownTimeout) {
                clearTimeout(_this.countdownTimeout);
            }
            var diff = then.getTime() - now.getTime();
            if (diff <= 0) {
                return;
            }
            _this.countdown.value = {
                originalDuration: diff,
                remaining: diff,
                timestamp: Date.now(),
            };
            _this.updateCountdownTimer();
        });
        this.updateCountdownTimer();
    }
    MediaBox.prototype.updateCountdownTimer = function () {
        var _this = this;
        var cdTimer = this.countdown.value;
        var remaining = cdTimer.originalDuration - (Date.now() - cdTimer.timestamp);
        if (remaining > 0) {
            this.countdown.value.remaining = remaining;
            this.countdownTimeout = setTimeout(function () { return _this.updateCountdownTimer(); }, 1000);
        }
        else {
            this.countdown.value.remaining = 0;
        }
    };
    return MediaBox;
}());
module.exports = MediaBox;
