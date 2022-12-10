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
Object.defineProperty(exports, "__esModule", { value: true });
var clone_1 = __importDefault(require("clone"));
var events_1 = require("events");
var obs_websocket_js_1 = __importDefault(require("obs-websocket-js"));
var string_similarity_1 = require("string-similarity");
var OBS = /** @class */ (function (_super) {
    __extends(OBS, _super);
    function OBS(nodecg, config) {
        var _this = _super.call(this) || this;
        _this.conn = new obs_websocket_js_1.default();
        _this.sceneList = [];
        _this.connected = false;
        _this.nodecg = nodecg;
        _this.config = config;
        if (config.enabled) {
            nodecg.log.info('[OBS] Setting up connection');
            _this.connect();
            _this.conn.on('ConnectionClosed', function () {
                _this.connected = false;
                _this.emit('connectionStatusChanged', _this.connected);
                nodecg.log.warn('[OBS] Connection lost, retrying in 5 seconds');
                setTimeout(function () { return _this.connect(); }, 5000);
            });
            _this.conn.on('SwitchScenes', function (data) {
                var lastScene = _this.currentScene;
                if (lastScene !== data['scene-name']) {
                    _this.currentScene = data['scene-name'];
                    _this.emit('currentSceneChanged', _this.currentScene, lastScene);
                }
            });
            _this.conn.on('ScenesChanged', function () { return __awaiter(_this, void 0, void 0, function () {
                var scenes;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.conn.send('GetSceneList')];
                        case 1:
                            scenes = _a.sent();
                            this.sceneList = scenes.scenes.map(function (s) { return s.name; });
                            this.emit('sceneListChanged', this.sceneList);
                            return [2 /*return*/];
                    }
                });
            }); });
            _this.conn.on('StreamStarted', function () {
                _this.streaming = true;
                _this.emit('streamingStatusChanged', _this.streaming, !_this.streaming);
            });
            _this.conn.on('StreamStopped', function () {
                _this.streaming = false;
                _this.emit('streamingStatusChanged', _this.streaming, !_this.streaming);
            });
            _this.conn.on('error', function (err) {
                nodecg.log.warn('[OBS] Connection error');
                nodecg.log.debug('[OBS] Connection error:', err);
            });
        }
        return _this;
    }
    OBS.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var scenes, lastScene, oldList, newList, streamingStatus, lastStatus, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.conn.connect({
                                address: this.config.address,
                                password: this.config.password,
                            })];
                    case 1:
                        _a.sent();
                        this.connected = true;
                        return [4 /*yield*/, this.conn.send('GetSceneList')];
                    case 2:
                        scenes = _a.sent();
                        lastScene = this.currentScene;
                        if (lastScene !== scenes['current-scene']) {
                            this.currentScene = scenes['current-scene'];
                        }
                        oldList = (0, clone_1.default)(this.sceneList);
                        newList = scenes.scenes.map(function (s) { return s.name; });
                        if (JSON.stringify(newList) !== JSON.stringify(oldList)) {
                            this.sceneList = newList;
                        }
                        return [4 /*yield*/, this.conn.send('GetStreamingStatus')];
                    case 3:
                        streamingStatus = _a.sent();
                        lastStatus = this.streaming;
                        if (streamingStatus.streaming !== lastStatus) {
                            this.streaming = streamingStatus.streaming;
                        }
                        // Emit changes after everything start up related has finished.
                        this.emit('connectionStatusChanged', this.connected);
                        if (lastScene !== scenes['current-scene']) {
                            this.emit('currentSceneChanged', this.currentScene, lastScene);
                        }
                        if (JSON.stringify(newList) !== JSON.stringify(oldList)) {
                            this.emit('sceneListChanged', this.sceneList);
                        }
                        if (streamingStatus.streaming !== lastStatus) {
                            this.emit('streamingStatusChanged', this.streaming, lastStatus);
                        }
                        this.nodecg.log.info('[OBS] Connection successful');
                        return [3 /*break*/, 5];
                    case 4:
                        err_1 = _a.sent();
                        this.conn.disconnect();
                        this.nodecg.log.warn('[OBS] Connection error');
                        this.nodecg.log.debug('[OBS] Connection error:', err_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Find scene based on string; at least the start of the name should be supplied.
     * @param name Name of scene, at least starting of name.
     */
    OBS.prototype.findScene = function (name) {
        var match;
        var matches = this.sceneList.filter(function (s) { return s.startsWith(name); });
        if (matches.length > 1) {
            var bestMatches = (0, string_similarity_1.findBestMatch)(name, matches);
            match = bestMatches.bestMatch.target;
        }
        else if (matches.length === 1) {
            match = matches[0];
        }
        return match;
    };
    /**
     * Check if we are on a specified scene; at least the start of the name should be supplied.
     * @param name Name of scene to check we are on, at least starting of name.
     */
    OBS.prototype.isCurrentScene = function (name) {
        return !!this.currentScene && this.currentScene === this.findScene(name);
    };
    /**
     * Change to the OBS scene with the closest matched name.
     * @param name Name of the scene.
     */
    OBS.prototype.changeScene = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var scene, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.config.enabled || !this.connected) {
                            // OBS not enabled, don't even try to set.
                            throw new Error('No OBS connection available');
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        scene = this.findScene(name);
                        if (!scene) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.conn.send('SetCurrentScene', { 'scene-name': scene })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3: throw new Error('Scene could not be found');
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        err_2 = _a.sent();
                        this.nodecg.log.warn("[OBS] Cannot change scene [".concat(name, "]"));
                        this.nodecg.log.debug("[OBS] Cannot change scene [".concat(name, "]: ").concat(err_2.error || err_2));
                        throw err_2;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get named source's current settings.
     * @param sourceName Name of the source.
     */
    OBS.prototype.getSourceSettings = function (sourceName) {
        return __awaiter(this, void 0, void 0, function () {
            var resp, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.config.enabled || !this.connected) {
                            // OBS not enabled, don't even try to set.
                            throw new Error('No connection available');
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.conn.send('GetSourceSettings', { sourceName: sourceName })];
                    case 2:
                        resp = _a.sent();
                        return [2 /*return*/, resp];
                    case 3:
                        err_3 = _a.sent();
                        this.nodecg.log.warn("[OBS] Cannot get source settings [".concat(sourceName, "]"));
                        this.nodecg.log.debug("[OBS] Cannot get source settings [".concat(sourceName, "]: ")
                            + "".concat(err_3.error || err_3));
                        throw err_3;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Modify a sources settings.
     * @param sourceName Name of the source.
     * @param sourceType Source type (has the be the internal name, not the display name).
     * @param sourceSettings Settings you wish to pass to OBS to change.
     */
    // eslint-disable-next-line max-len
    OBS.prototype.setSourceSettings = function (sourceName, sourceType, sourceSettings) {
        return __awaiter(this, void 0, void 0, function () {
            var err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.config.enabled || !this.connected) {
                            // OBS not enabled, don't even try to set.
                            throw new Error('No connection available');
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.conn.send('SetSourceSettings', {
                                sourceName: sourceName,
                                sourceType: sourceType,
                                sourceSettings: sourceSettings,
                            })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_4 = _a.sent();
                        this.nodecg.log.warn("[OBS] Cannot set source settings [".concat(sourceName, "]"));
                        this.nodecg.log.debug("[OBS] Cannot set source settings [".concat(sourceName, "]: ")
                            + "".concat(err_4.error || err_4));
                        throw err_4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Resets the scene item, then sets some properties if possible.
     * @param scene Name of scene that item is in
     * @param item Name of item
     * @param area Area object (as used in capturePositions): x, y, width, height
     * @param crop Crop object: top, bottom, left, right
     * @param visible If the source should be visible or not
     */
    OBS.prototype.configureSceneItem = function (scene, item, area, crop, visible) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __awaiter(this, void 0, void 0, function () {
            var err_5;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        _j.trys.push([0, 2, , 3]);
                        if (!this.config.enabled || !this.connected) {
                            // OBS not enabled, don't even try to set.
                            throw new Error('No connection available');
                        }
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore: Typings say we need to specify more than we actually do.
                        return [4 /*yield*/, this.conn.send('SetSceneItemProperties', {
                                'scene-name': scene,
                                item: { name: item },
                                visible: visible !== null && visible !== void 0 ? visible : true,
                                position: {
                                    x: (_a = area === null || area === void 0 ? void 0 : area.x) !== null && _a !== void 0 ? _a : 0,
                                    y: (_b = area === null || area === void 0 ? void 0 : area.y) !== null && _b !== void 0 ? _b : 0,
                                },
                                bounds: {
                                    type: 'OBS_BOUNDS_STRETCH',
                                    x: (_c = area === null || area === void 0 ? void 0 : area.width) !== null && _c !== void 0 ? _c : 1920,
                                    y: (_d = area === null || area === void 0 ? void 0 : area.height) !== null && _d !== void 0 ? _d : 1080,
                                },
                                crop: {
                                    top: (_e = crop === null || crop === void 0 ? void 0 : crop.top) !== null && _e !== void 0 ? _e : 0,
                                    bottom: (_f = crop === null || crop === void 0 ? void 0 : crop.bottom) !== null && _f !== void 0 ? _f : 0,
                                    left: (_g = crop === null || crop === void 0 ? void 0 : crop.left) !== null && _g !== void 0 ? _g : 0,
                                    right: (_h = crop === null || crop === void 0 ? void 0 : crop.right) !== null && _h !== void 0 ? _h : 0,
                                },
                            })];
                    case 1:
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore: Typings say we need to specify more than we actually do.
                        _j.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_5 = _j.sent();
                        this.nodecg.log.warn("[OBS] Cannot configure scene item [".concat(scene, ": ").concat(item, "]"));
                        this.nodecg.log.debug("[OBS] Cannot configure scene item [".concat(scene, ": ").concat(item, "]: ")
                            + "".concat(err_5.error || err_5));
                        throw err_5;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return OBS;
}(events_1.EventEmitter));
exports.default = OBS;
