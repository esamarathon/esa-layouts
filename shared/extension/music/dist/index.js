"use strict";
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var node_fetch_1 = __importDefault(require("node-fetch"));
var path_1 = __importDefault(require("path"));
var stream_1 = require("stream");
/**
 * Calculates the absolute file path to one of our local replicant schemas.
 * @param schemaName The replicant/schema filename.
 */
function buildSchemaPath(schemaName) {
    return path_1.default.resolve(__dirname, '../../../schemas', "".concat(encodeURIComponent(schemaName), ".json"));
}
var Music = /** @class */ (function () {
    function Music(nodecg, config, obs) {
        this.positionTimestamp = 0;
        this.positionInitial = 0;
        this.nodecg = nodecg;
        this.config = config;
        this.obs = obs;
        this.auth = (config.username && config.password)
            ? "Basic ".concat(Buffer.from("".concat(config.username, ":").concat(config.password)).toString('base64'))
            : undefined;
        this.headers = this.auth ? { Authorization: this.auth } : undefined;
        this.musicData = nodecg.Replicant('musicData', { schemaPath: buildSchemaPath('musicData') });
        this.musicData.value.connected = false;
        if (config.enabled) {
            this.setup();
        }
    }
    /**
     * Make a request to the Beefweb foobar2000 plugin.
     * @param method Required HTTP method.
     * @param endpoint The endpoint to request.
     */
    Music.prototype.request = function (method, endpoint) {
        return __awaiter(this, void 0, void 0, function () {
            var resp, text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.nodecg.log.debug("[Music] API ".concat(method.toUpperCase(), " request processing on ").concat(endpoint));
                        return [4 /*yield*/, (0, node_fetch_1.default)("http://".concat(this.config.address, "/api").concat(endpoint), {
                                method: method,
                                headers: this.headers,
                            })];
                    case 1:
                        resp = _a.sent();
                        if (!![200, 204].includes(resp.status)) return [3 /*break*/, 3];
                        return [4 /*yield*/, resp.text()];
                    case 2:
                        text = _a.sent();
                        this.nodecg.log
                            .debug("[Music] API ".concat(method.toUpperCase(), " request error on ").concat(endpoint, ":"), text);
                        throw new Error(text);
                    case 3:
                        this.nodecg.log.debug("[Music] API ".concat(method.toUpperCase(), " request successful on ").concat(endpoint));
                        return [2 /*return*/, resp];
                }
            });
        });
    };
    /**
     * Updates the stored position of the current track every second.
     */
    Music.prototype.updatePosition = function () {
        if (this.musicData.value.track && this.musicData.value.playing) {
            this.musicData.value.track.position = ((Date.now() - this.positionTimestamp) / 1000)
                + this.positionInitial;
        }
        else if (this.positionInterval) {
            clearInterval(this.positionInterval);
        }
    };
    /**
     * Sends a "play" command to foobar2000.
     */
    Music.prototype.play = function () {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.config.enabled)
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.request('post', '/player/play')];
                    case 2:
                        _a.sent();
                        this.nodecg.log.info('[Music] Successfully playing');
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        this.nodecg.log.warn('[Music] Error playing');
                        this.nodecg.log.debug('[Music] Error playing:', err_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Sends a "pause" command to foobar2000.
     */
    Music.prototype.pause = function () {
        return __awaiter(this, void 0, void 0, function () {
            var err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.config.enabled)
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.request('post', '/player/pause')];
                    case 2:
                        _a.sent();
                        this.nodecg.log.info('[Music] Successfully paused');
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _a.sent();
                        this.nodecg.log.warn('[Music] Error pausing');
                        this.nodecg.log.debug('[Music] Error pausing:', err_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Sets up the constant connection to foobar2000.
     */
    Music.prototype.setup = function () {
        return __awaiter(this, void 0, void 0, function () {
            var resp, readable, err_3;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.nodecg.log.info('[Music] Attempting connection');
                        return [4 /*yield*/, this.request('get', '/query/updates?player=true&trcolumns=%artist%,%title%')];
                    case 1:
                        resp = _a.sent();
                        this.musicData.value.connected = true;
                        this.nodecg.log.info('[Music] Connection successful');
                        if (!resp.body)
                            throw new Error('body was null');
                        readable = stream_1.Readable.from(resp.body);
                        readable.on('data', function (chunk) {
                            var msg;
                            try {
                                var cleaned = chunk.toString().slice(6).replace(/(\r\n|\n|\r)/gm, '');
                                msg = JSON.parse(cleaned);
                            }
                            catch (err) {
                                _this.nodecg.log.warn('[Music] Error parsing message on connection');
                                _this.nodecg.log.debug('[Music] Error parsing message on connection:', err);
                            }
                            if (!msg) {
                                return;
                            }
                            if (msg.player) {
                                if (_this.positionInterval)
                                    clearInterval(_this.positionInterval);
                                _this.musicData.value.playing = msg.player.playbackState === 'playing';
                                if (msg.player.playbackState !== 'stopped') {
                                    if (msg.player.activeItem.duration > 0) {
                                        _this.musicData.value.track = {
                                            artist: msg.player.activeItem.columns[0] || undefined,
                                            title: msg.player.activeItem.columns[1] || undefined,
                                            position: msg.player.activeItem.position,
                                            duration: msg.player.activeItem.duration,
                                        };
                                        if (msg.player.playbackState === 'playing') {
                                            _this.positionInitial = msg.player.activeItem.position;
                                            _this.positionTimestamp = Date.now();
                                            _this.positionInterval = setInterval(function () { return _this.updatePosition(); }, 1000);
                                        }
                                    }
                                }
                                else {
                                    delete _this.musicData.value.track;
                                }
                            }
                        });
                        readable.on('close', function () {
                            _this.nodecg.log.warn('[Music] Connection closed');
                        });
                        readable.on('error', function (err) {
                            _this.nodecg.log.warn('[Music] Connection error');
                            _this.nodecg.log.debug('[Music] Connection error:', err);
                        });
                        readable.on('end', function () {
                            _this.musicData.value.connected = false;
                            _this.nodecg.log.warn('[Music] Connection ended, retrying in 5 seconds');
                            setTimeout(function () { return _this.setup(); }, 5 * 1000);
                        });
                        // Listen to OBS transitions to play/pause correctly.
                        this.obs.conn.on('TransitionBegin', function (data) {
                            if (data['to-scene']) {
                                if (data['to-scene'].includes('[M]')) {
                                    _this.play();
                                }
                                else {
                                    _this.pause();
                                }
                            }
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        err_3 = _a.sent();
                        this.musicData.value.connected = false;
                        this.nodecg.log.warn('[Music] Connection failed, retrying in 5 seconds');
                        this.nodecg.log.debug('[Music] Connection failed, retrying in 5 seconds:', err_3);
                        setTimeout(function () { return _this.setup(); }, 5 * 1000);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return Music;
}());
module.exports = Music;
