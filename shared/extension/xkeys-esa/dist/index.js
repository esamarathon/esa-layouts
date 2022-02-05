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
        if (config.enabled) {
            var watcher = new xkeys_1.XKeysWatcher();
            _this.nodecg.log.info('[XKeys] Watching for panel');
            watcher.on('connected', function (xkeysPanel) {
                _this.panel = xkeysPanel;
                _this.initPanel();
            });
            watcher.on('error', function (err) {
                _this.nodecg.log.debug('[XKeys] Watcher error:', err);
            });
        }
        return _this;
    }
    XKeysClass.prototype.initPanel = function () {
        var _this = this;
        if (!this.panel)
            return;
        this.nodecg.log.info('[XKeys] Panel successfully found');
        this.panel.on('error', function (err) {
            _this.nodecg.log.debug('[XKeys] Panel error:', err);
        });
        // Turn off all lights.
        this.panel.setAllBacklights(false);
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
        this.panel.on('jog', function (index, position) {
            _this.nodecg.log.debug("[XKeys] Jog ".concat(index, " moved:"), position);
            _this.emit('jog', index, position);
        });
        this.panel.on('shuttle', function (index, position) {
            _this.nodecg.log.debug("[XKeys] Shuttle ".concat(index, " moved:"), position);
            _this.emit('shuttle', index, position);
        });
        this.panel.on('disconnected', function () {
            _this.nodecg.log.debug('[XKeys] Panel disconnected');
        });
        this.panel.on('reconnected', function () {
            _this.nodecg.log.debug('[XKeys] Panel reconnected');
        });
    };
    XKeysClass.prototype.setBacklight = function (keyIndex, on, redLight, flashing) {
        if (on === void 0) { on = true; }
        // XKeys not enabled, don't even try to set.
        if (!this.config.enabled)
            return;
        if (!this.panel) {
            this.nodecg.log.warn("[XKeys] Cannot set backlight on ".concat(keyIndex, ", panel not connected"));
            return;
        }
        if (!Number.isNaN(Number(keyIndex))) {
            var colour = redLight ? 'red' : 'blue';
            this.panel.setBacklight(Number(keyIndex), on ? colour : false, flashing);
        }
    };
    return XKeysClass;
}(events_1.EventEmitter));
exports.default = XKeysClass;
