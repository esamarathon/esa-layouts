"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var osc_1 = __importDefault(require("osc"));
var X32 = /** @class */ (function () {
    function X32(nodecg, config) {
        var _this = this;
        this.faders = {};
        this.fadersExpected = {};
        this.fadersInterval = {};
        this.nodecg = nodecg;
        this.config = config;
        if (config.enabled) {
            nodecg.log.info('[X32] Setting up connection');
            this.conn = new osc_1.default.UDPPort({
                localAddress: '0.0.0.0',
                localPort: config.localPort,
                remoteAddress: config.ip,
                remotePort: 10023,
                metadata: true,
            });
            this.conn.on('error', function (err) {
                nodecg.log.warn('[X32] Error on connection');
                nodecg.log.debug('[X32] Error on connection:', err);
            });
            this.conn.on('message', function (message) {
                // I don't trust myself with all posibilities, so wrapping this up.
                try {
                    if (message.address.endsWith('/fader')) {
                        var args = message.args[0];
                        _this.faders[message.address] = args.value;
                        // Check if we're done fading and clear intervals if needed.
                        if (_this.fadersExpected[message.address]) {
                            var exp = _this.fadersExpected[message.address];
                            // Sometimes we receive a delayed message, so we wait until
                            // we've at least seen 1 value in the correct range.
                            if ((exp.increase && exp.value > args.value)
                                || (!exp.increase && exp.value < args.value)) {
                                exp.seenOnce = true;
                            }
                            if (exp.seenOnce && ((exp.increase && exp.value <= args.value)
                                || (!exp.increase && exp.value >= args.value))) {
                                if (_this.conn) {
                                    _this.conn.send({
                                        address: message.address,
                                        args: [{ type: 'f', value: exp.value }],
                                    });
                                }
                                clearInterval(_this.fadersInterval[message.address]);
                                delete _this.fadersExpected[message.address];
                            }
                        }
                    }
                }
                catch (err) {
                    nodecg.log.warn('[X32] Error parsing message');
                    nodecg.log.debug('[X32] Error parsing message:', err);
                }
            });
            this.conn.on('close', function () {
                nodecg.log.info('[X32] Connection closed');
            });
            this.conn.on('open', function () {
                nodecg.log.info('[X32] Connection opened');
            });
            this.conn.on('ready', function () {
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
            });
            this.conn.open();
        }
    }
    /**
     * Just set a specific fader to the supplied value.
     * @param name Full name of fader (example: /dca/1/fader).
     * @param startValue Value to set (0.0 - 1.0).
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
    return X32;
}());
module.exports = X32;
