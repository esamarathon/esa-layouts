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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var osc_1 = __importDefault(require("osc"));
var tiny_typed_emitter_1 = require("tiny-typed-emitter");
var X32 = /** @class */ (function (_super) {
    __extends(X32, _super);
    function X32(nodecg, config) {
        var _this = _super.call(this) || this;
        _this.ready = false;
        _this.faders = {};
        _this.fadersExpected = {};
        _this.fadersInterval = {};
        _this.nodecg = nodecg;
        _this.config = config;
        if (config.enabled) {
            nodecg.log.info('[X32] Setting up connection');
            _this.conn = new osc_1.default.UDPPort({
                localAddress: '0.0.0.0',
                localPort: config.localPort,
                remoteAddress: config.ip,
                remotePort: config.xr18 ? 10024 : 10023,
                metadata: true,
            });
            _this.conn.on('error', function (err) {
                nodecg.log.warn('[X32] Error on connection');
                nodecg.log.debug('[X32] Error on connection:', err);
                _this.emit('error', err);
            });
            _this.conn.on('message', function (message) {
                _this.handleFaderEvent(message);
                _this.emit('message', message);
            });
            _this.conn.on('close', function () {
                nodecg.log.info('[X32] Connection closed');
                _this.ready = false;
            });
            _this.conn.on('open', function () {
                nodecg.log.info('[X32] Connection opened');
            });
            _this.conn.on('ready', function () {
                nodecg.log.info('[X32] Connection ready');
                // Subscribe/renew to updates (must be done every <10 seconds).
                if (_this.conn) {
                    _this.conn.send({ address: '/xremote', args: [] });
                }
                setInterval(function () {
                    if (_this.conn) {
                        _this.conn.send({ address: '/xremote', args: [] });
                    }
                }, 8 * 1000);
                _this.ready = true;
                _this.emit('ready');
            });
            _this.conn.open();
        }
        return _this;
    }
    /**
     * Just set a specific fader to the supplied value.
     * @param name Full name of fader (example: /dca/1/fader).
     * @param value Value to set (0.0 - 1.0).
     */
    X32.prototype.setFader = function (name, value) {
        if (!this.config.enabled || !this.conn) {
            throw new Error('No connection available');
        }
        this.nodecg.log.debug("[X32] Attempting to set fader on ".concat(name, " to ").concat(value));
        this.conn.send({
            address: '/subscribe',
            args: [{ type: 's', value: name }, { type: 'i', value: 0 }],
        });
        this.conn.send({ address: name, args: [{ type: 'f', value: value }] });
    };
    /**
     * Fades up/down the supplied fader using the specified settings.
     * @param name Full name of fader (example: /dca/1/fader).
     * @param startValue Value to start at (0.0 - 1.0).
     * @param endValue Value to end at (0.0 - 1.0).
     * @param length Milliseconds to spend doing fade.
     */
    X32.prototype.fade = function (name, startValue, endValue, length) {
        var _this = this;
        if (!this.config.enabled || !this.conn) {
            throw new Error('No connection available');
        }
        // Will stop doing a fade if we receive another one while the old one is running, for safety.
        if (this.fadersExpected[name]) {
            clearInterval(this.fadersInterval[name]);
            delete this.fadersExpected[name];
        }
        this.nodecg.log.debug("[X32] Attempting to fade ".concat(name, " ")
            + "(".concat(startValue, " => ").concat(endValue, ") for ").concat(length, "ms"));
        var currentValue = startValue;
        var increase = startValue < endValue;
        var stepCount = length / 100;
        var stepSize = (endValue - startValue) / stepCount;
        this.fadersExpected[name] = { value: endValue, increase: increase, seenOnce: false };
        this.conn.send({
            address: '/subscribe',
            args: [{ type: 's', value: name }, { type: 'i', value: 0 }],
        });
        this.fadersInterval[name] = setInterval(function () {
            if ((increase && currentValue >= endValue) || (!increase && currentValue <= endValue)) {
                clearInterval(_this.fadersInterval[name]);
                delete _this.fadersExpected[name];
            }
            if (_this.conn) {
                _this.conn.send({ address: name, args: [{ type: 'f', value: currentValue }] });
            }
            currentValue += stepSize;
            if ((increase && currentValue > endValue) || (!increase && currentValue < endValue)) {
                currentValue = endValue;
            }
        }, 100);
    };
    X32.prototype.handleFaderEvent = function (message) {
        // I don't trust myself with all posibilities, so wrapping this up.
        try {
            if (message.address.endsWith('/fader')) {
                var args = message.args[0];
                this.faders[message.address] = args.value;
                // Check if we're done fading and clear intervals if needed.
                if (this.fadersExpected[message.address]) {
                    var exp = this.fadersExpected[message.address];
                    // Sometimes we receive a delayed message, so we wait until
                    // we've at least seen 1 value in the correct range.
                    if ((exp.increase && exp.value > args.value)
                        || (!exp.increase && exp.value < args.value)) {
                        exp.seenOnce = true;
                    }
                    if (exp.seenOnce && ((exp.increase && exp.value <= args.value)
                        || (!exp.increase && exp.value >= args.value))) {
                        if (this.conn) {
                            this.conn.send({
                                address: message.address,
                                args: [{ type: 'f', value: exp.value }],
                            });
                        }
                        clearInterval(this.fadersInterval[message.address]);
                        delete this.fadersExpected[message.address];
                    }
                }
            }
        }
        catch (err) {
            this.nodecg.log.warn('[X32] Error parsing message');
            this.nodecg.log.debug('[X32] Error parsing message:', err);
        }
    };
    return X32;
}(tiny_typed_emitter_1.TypedEmitter));
module.exports = X32;
