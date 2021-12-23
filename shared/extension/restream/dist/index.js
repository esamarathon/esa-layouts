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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var path_1 = __importDefault(require("path"));
var uuid_1 = require("uuid");
var ws_1 = __importDefault(require("ws"));
/**
 * Calculates the absolute file path to one of our local replicant schemas.
 * @param schemaName the replicant/schema filename.
 */
function buildSchemaPath(schemaName) {
    return path_1.default.resolve(__dirname, '../../../schemas', "".concat(encodeURIComponent(schemaName), ".json"));
}
var RestreamInstance = /** @class */ (function (_super) {
    __extends(RestreamInstance, _super);
    function RestreamInstance(nodecg, address, key) {
        var _this = _super.call(this) || this;
        _this.nodecg = nodecg;
        _this.address = address;
        _this.key = key;
        _this.nodecg.log.debug("[Restream, ".concat(_this.address, "] Creating instance"));
        _this.connect();
        return _this;
    }
    RestreamInstance.prototype.sendMsg = function (msg) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (res) {
                        _this.nodecg.log.debug("[Restream, ".concat(_this.address, "] Sending mesage:"), msg);
                        if (!_this.ws || _this.ws.readyState !== 1) {
                            // throw new Error('WebSocket not connected');
                            _this.nodecg.log.warn("[Restream, ".concat(_this.address, "] ")
                                + 'Cannot send mesage: WebSocket not connected');
                            return;
                        }
                        var msgID = (0, uuid_1.v4)();
                        _this.ws.send(JSON.stringify(__assign(__assign({}, msg), { msgID: msgID })));
                        var msgEvt = function (data) {
                            var resp = JSON.parse(data.toString());
                            if (_this.ws && resp.type === 'Response' && resp.msgID === msgID) {
                                _this.nodecg.log.debug("[Restream, ".concat(_this.address, "] ")
                                    + 'Received successful confirmation message');
                                _this.ws.removeListener('message', msgEvt);
                                res(resp);
                            }
                        };
                        if (_this.ws) {
                            _this.ws.on('message', msgEvt);
                        }
                    })];
            });
        });
    };
    RestreamInstance.prototype.connect = function () {
        var _this = this;
        this.nodecg.log.info("[Restream, ".concat(this.address, "] Connecting"));
        this.ws = new ws_1.default("ws://".concat(this.address, "/ws?key=").concat(this.key));
        this.ws.once('open', function () {
            _this.emit('connected');
            _this.nodecg.log.info("[Restream, ".concat(_this.address, "] Connected"));
        });
        this.ws.on('error', function (err) {
            _this.nodecg.log.warn("[Restream, ".concat(_this.address, "] Connection error"));
            _this.nodecg.log.debug("[Restream, ".concat(_this.address, "] Connection error:"), err);
        });
        this.ws.once('close', function () {
            if (_this.ws) {
                _this.ws.removeAllListeners();
            }
            _this.emit('disconnected');
            setTimeout(function () { return _this.connect(); }, 5 * 1000);
            _this.nodecg.log.warn("[Restream, ".concat(_this.address, "] Connection lost, retrying in 5 seconds"));
        });
        this.ws.on('message', function (data) {
            var msg = JSON.parse(data.toString());
            _this.nodecg.log.debug("[Restream, ".concat(_this.address, "] Received mesage:"), msg);
            _this.channel = msg.channel;
            _this.emit('channelChange', msg.channel);
            if (msg.type === 'Update') {
                _this.emit('update', msg);
            }
        });
    };
    RestreamInstance.prototype.startStream = function (channel) {
        return __awaiter(this, void 0, void 0, function () {
            var msg;
            return __generator(this, function (_a) {
                msg = {
                    type: 'Start',
                    channel: channel,
                };
                return [2 /*return*/, this.sendMsg(msg)];
            });
        });
    };
    RestreamInstance.prototype.stopStream = function () {
        return __awaiter(this, void 0, void 0, function () {
            var msg;
            return __generator(this, function (_a) {
                msg = {
                    type: 'Stop',
                };
                return [2 /*return*/, this.sendMsg(msg)];
            });
        });
    };
    RestreamInstance.prototype.restartStream = function () {
        return __awaiter(this, void 0, void 0, function () {
            var msg;
            return __generator(this, function (_a) {
                msg = {
                    type: 'Restart',
                };
                return [2 /*return*/, this.sendMsg(msg)];
            });
        });
    };
    return RestreamInstance;
}(events_1.EventEmitter));
var Restream = /** @class */ (function () {
    function Restream(nodecg, sc, config) {
        var _a;
        var _this = this;
        this.instances = [];
        this.nodecg = nodecg;
        this.restreamData = nodecg.Replicant('restreamData', {
            schemaPath: buildSchemaPath('restreamData'),
        });
        for (var i = 0; i < this.restreamData.value.length; i += 1) {
            this.restreamData.value[i].connected = false;
        }
        if (config.enable) {
            this.nodecg.log.info('[Restream] Setting up');
            var cfgArr = (Array.isArray(config.instances)) ? config.instances : [config.instances];
            // Add defaults to the replicant if needed.
            if (this.restreamData.value.length < cfgArr.length) {
                var count = cfgArr.length - this.restreamData.value.length;
                var defaultData = {
                    connected: false,
                    overridden: false,
                };
                (_a = this.restreamData.value).push.apply(_a, Array(count).fill(defaultData));
            }
            this.instances = cfgArr.map(function (cfg, i) {
                var restream = new RestreamInstance(nodecg, cfg.address, cfg.key);
                restream.on('connected', function () { _this.restreamData.value[i].connected = true; });
                restream.on('disconnected', function () { _this.restreamData.value[i].connected = false; });
                restream.on('update', function (_a) {
                    var channel = _a.channel, uuid_ = _a.uuid;
                    _this.updateData(i, { channel: channel, uuid: uuid_ });
                });
                return restream;
            });
            this.nodecg.listenFor('restreamOverride', function (data, cb) {
                if (data === void 0) { data = {}; }
                return __awaiter(_this, void 0, void 0, function () {
                    var instance, channel, _a, channel_, uuid_;
                    var _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                instance = this.instances[data.index || 0];
                                channel = data.channel || ((_b = this.restreamData.value[data.index || 0]) === null || _b === void 0 ? void 0 : _b.channel);
                                if (!(instance && channel)) return [3 /*break*/, 2];
                                return [4 /*yield*/, instance.startStream(channel)];
                            case 1:
                                _a = _c.sent(), channel_ = _a.channel, uuid_ = _a.uuid;
                                this.updateData(data.index || 0, {
                                    overridden: true,
                                    channel: channel_,
                                    uuid: uuid_,
                                });
                                // Currently not checking for error msg here, so will always seem successful!
                                this.nodecg.log.info('[Restream] Successfully overridden stream '
                                    + "".concat((data.index || 0) + 1));
                                _c.label = 2;
                            case 2:
                                if (cb && !cb.handled) {
                                    cb();
                                }
                                return [2 /*return*/];
                        }
                    });
                });
            });
            this.nodecg.listenFor('restreamRestart', function (data, cb) {
                if (data === void 0) { data = {}; }
                return __awaiter(_this, void 0, void 0, function () {
                    var instance, _a, channel, uuid_;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                instance = this.instances[data.index || 0];
                                if (!instance) return [3 /*break*/, 2];
                                return [4 /*yield*/, instance.restartStream()];
                            case 1:
                                _a = _b.sent(), channel = _a.channel, uuid_ = _a.uuid;
                                this.updateData(data.index || 0, { channel: channel, uuid: uuid_ });
                                // Currently not checking for error msg here, so will always seem successful!
                                this.nodecg.log.info("[Restream] Successfully restarted stream ".concat((data.index || 0) + 1));
                                _b.label = 2;
                            case 2:
                                if (cb && !cb.handled) {
                                    cb();
                                }
                                return [2 /*return*/];
                        }
                    });
                });
            });
            this.nodecg.listenFor('restreamStop', function (data, cb) {
                if (data === void 0) { data = {}; }
                return __awaiter(_this, void 0, void 0, function () {
                    var instance, _a, channel, uuid_;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                instance = this.instances[data.index || 0];
                                if (!instance) return [3 /*break*/, 2];
                                return [4 /*yield*/, instance.stopStream()];
                            case 1:
                                _a = _b.sent(), channel = _a.channel, uuid_ = _a.uuid;
                                this.updateData(data.index || 0, { channel: channel, uuid: uuid_ });
                                // Currently not checking for error msg here, so will always seem successful!
                                this.nodecg.log.info("[Restream] Successfully stopped stream ".concat((data.index || 0) + 1));
                                _b.label = 2;
                            case 2:
                                if (cb && !cb.handled) {
                                    cb();
                                }
                                return [2 /*return*/];
                        }
                    });
                });
            });
        }
    }
    /**
     * Takes a list of channels and will set them on that instance index if different,
     * or stop if needed.
     * @param channels List of channels.
     */
    Restream.prototype.updateMultipleInstances = function (channels) {
        var _this = this;
        this.instances.forEach(function (instance, i) { return __awaiter(_this, void 0, void 0, function () {
            var newChan, _a, channel, uuid_, _b, channel, uuid_;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        newChan = channels[i];
                        if (!!newChan) return [3 /*break*/, 2];
                        return [4 /*yield*/, instance.stopStream()];
                    case 1:
                        _a = _c.sent(), channel = _a.channel, uuid_ = _a.uuid;
                        this.updateData(i, { channel: channel, uuid: uuid_ });
                        // Currently not checking for error msg here, so will always seem successful!
                        this.nodecg.log.info("[Restream] Successfully stopped stream ".concat(i + 1));
                        return [3 /*break*/, 4];
                    case 2:
                        if (!(newChan && newChan !== instance.channel)) return [3 /*break*/, 4];
                        return [4 /*yield*/, instance.startStream(newChan)];
                    case 3:
                        _b = _c.sent(), channel = _b.channel, uuid_ = _b.uuid;
                        this.updateData(i, {
                            overridden: false,
                            channel: channel,
                            uuid: uuid_,
                        });
                        // Currently not checking for error msg here, so will always seem successful!
                        this.nodecg.log.info("[Restream] Successfully started stream ".concat(i + 1));
                        _c.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
    Restream.prototype.updateData = function (i, opts) {
        var _a;
        this.nodecg.log.debug("[Restream] Updating restreamData[".concat(i, "]:"), opts);
        this.restreamData.value[i] = {
            connected: this.restreamData.value[i].connected,
            overridden: (_a = opts.overridden) !== null && _a !== void 0 ? _a : this.restreamData.value[i].overridden,
            channel: opts.channel,
            uuid: opts.uuid || this.restreamData.value[i].uuid,
        };
    };
    return Restream;
}());
exports.default = Restream;
