"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var xkeys_1 = require("xkeys");
var XKeysClass = /** @class */ (function (_super) {
    __extends(XKeysClass, _super);
    function XKeysClass(nodecg, config) {
        var _this = _super.call(this) || this;
        _this.nodecg = nodecg;
        _this.config = config;
        if (config.enable) {
            _this.connect();
        }
        return _this;
    }
    XKeysClass.prototype.connect = function () {
        var _this = this;
        try {
            this.nodecg.log.info('[XKeys] Setting up panel');
            this.panel = new xkeys_1.XKeys();
            this.nodecg.log.info('[XKeys] Panel successfully found');
            this.panel.on('error', function (err) {
                _this.nodecg.log.debug('[XKeys] Panel error:', err);
            });
            // Turn off all lights.
            this.panel.setAllBacklights(false, false);
            this.panel.setAllBacklights(false, true);
            // Set intensity to full.
            this.panel.setBacklightIntensity(255);
            // Set flashing frequency.
            this.panel.setFrequency(50);
            this.panel.on('down', function (keyIndex) {
                _this.nodecg.log.debug('[XKeys] Key pressed:', keyIndex);
                _this.emit('down', keyIndex);
            });
            this.panel.on('up', function (keyIndex) {
                _this.nodecg.log.debug('[XKeys] Key released:', keyIndex);
                _this.emit('up', keyIndex);
            });
            this.panel.on('jog', function (position) {
                _this.nodecg.log.debug('[XKeys] Jog moved:', position);
                _this.emit('jog', position);
            });
            this.panel.on('shuttle', function (position) {
                _this.nodecg.log.debug('[XKeys] Shuttle moved:', position);
                _this.emit('shuttle', position);
            });
        }
        catch (err) {
            this.nodecg.log.debug('[XKeys] Panel error:', err);
            this.nodecg.log.debug('[XKeys] Panel error, retrying in 5 seconds');
            setTimeout(function () { return _this.connect(); }, 5 * 1000);
        }
    };
    XKeysClass.prototype.setBacklight = function (keyIndex, on, redLight, flashing) {
        if (on === void 0) { on = true; }
        if (!this.config.enable) {
            // XKeys not enabled, don't even try to set.
            return;
        }
        if (!this.panel) {
            this.nodecg.log.warn("[XKeys] Cannot set backlight on " + keyIndex + ", panel not connected");
            return;
        }
        this.panel.setBacklight(keyIndex, on, redLight, flashing);
    };
    return XKeysClass;
}(events_1.EventEmitter));
exports.default = XKeysClass;
