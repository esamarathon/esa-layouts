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
var get_video_duration_1 = require("get-video-duration");
var path_1 = require("path");
var process_1 = require("process");
var tiny_typed_emitter_1 = require("tiny-typed-emitter");
var VideoPlayer = /** @class */ (function (_super) {
    __extends(VideoPlayer, _super);
    function VideoPlayer(obsConfig, obs) {
        var _this = _super.call(this) || this;
        _this.playlist = [];
        _this.playing = false;
        _this.index = -1;
        _this.obsConfig = obsConfig;
        _this.obs = obs;
        // Listens for when videos finish playing in OBS.
        obs.conn.on('MediaEnded', function (data) {
            if (data.sourceName === _this.obsConfig.names.sources.videoPlayer
                && _this.playing && _this.index >= 0) {
                _this.emit('videoEnded', _this.playlist[_this.index]);
            }
        });
        return _this;
    }
    /**
     * Validate and load in a supplied playlist.
     */
    VideoPlayer.prototype.loadPlaylist = function (playlist) {
        if (!this.obs.connected || !this.obsConfig.enabled) {
            throw new Error('no OBS connection available');
        }
        if (this.playing)
            throw new Error('another playlist currently playing');
        if (!playlist.length)
            throw new Error('playlist must have at least 1 video');
        var invalidItems = playlist.filter(function (i) { return !i.commercial && !i.video; });
        if (invalidItems.length) {
            throw new Error('all playlist items must have either video or commercial');
        }
        this.playlist = playlist;
    };
    /**
     * Attempt to play the next playlist item.
     * If at the end, triggers the end of the playlist.
     */
    VideoPlayer.prototype.playNext = function () {
        return __awaiter(this, void 0, void 0, function () {
            var item;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.obs.connected || !this.obsConfig.enabled) {
                            throw new Error('no OBS connection available');
                        }
                        if (!(this.playlist.length - 1 > this.index)) return [3 /*break*/, 5];
                        this.playing = true;
                        this.index += 1;
                        item = this.playlist[this.index];
                        this.emit('videoStarted', item); // Emitted even if no video is added.
                        if (item.commercial)
                            this.emit('playCommercial', item);
                        if (!item.video) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.playVideo(item.video)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, new Promise(function (res) { setTimeout(res, 5000); })];
                    case 3:
                        _a.sent();
                        this.emit('videoEnded', item); // "Pretend" video ended in this case.
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        this.playing = false;
                        this.index = -1;
                        this.playlist.length = 0;
                        this.emit('playlistEnded', false);
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Used to end the playlist early; will stop the video if any, reset settings,
     * and emit "playlistEnded".
     */
    VideoPlayer.prototype.endPlaylistEarly = function () {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.playing && this.index >= 0)) return [3 /*break*/, 5];
                        this.playing = false;
                        this.index = -1;
                        this.playlist.length = 0;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.obs.conn.send('StopMedia', { sourceName: this.obsConfig.names.sources.videoPlayer })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4:
                        this.emit('playlistEnded', true);
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Play the supplied asset via the OBS source.
     * @param video NodeCG asset of the video.
     */
    VideoPlayer.prototype.playVideo = function (video) {
        return __awaiter(this, void 0, void 0, function () {
            var source, location;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.obs.connected || !this.obsConfig.enabled) {
                            throw new Error('no OBS connection available');
                        }
                        return [4 /*yield*/, this.obs.conn.send('GetSourceSettings', {
                                sourceName: this.obsConfig.names.sources.videoPlayer,
                            })];
                    case 1:
                        source = _a.sent();
                        location = (0, path_1.join)((0, process_1.cwd)(), "assets/".concat(video.namespace, "/").concat(video.category, "/").concat(video.base));
                        if (!(source.sourceType === 'ffmpeg_source')) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.obs.conn.send('SetSourceSettings', {
                                sourceName: this.obsConfig.names.sources.videoPlayer,
                                sourceSettings: {
                                    is_local_file: true,
                                    local_file: location,
                                    looping: false,
                                    restart_on_activate: false,
                                },
                            })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 3:
                        if (!(source.sourceType === 'vlc_source')) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.obs.conn.send('SetSourceSettings', {
                                sourceName: this.obsConfig.names.sources.videoPlayer,
                                sourceSettings: {
                                    loop: false,
                                    shuffle: false,
                                    playback_behavior: 'always_play',
                                    playlist: [
                                        {
                                            hidden: false,
                                            selected: false,
                                            value: location,
                                        },
                                    ],
                                },
                            })];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5: throw new Error('No video player source found in OBS to trigger');
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Calculates how long the playlist will last (estimated).
     * @returns Length in seconds.
     */
    VideoPlayer.prototype.calculatePlaylistLength = function () {
        return __awaiter(this, void 0, void 0, function () {
            var totalLength, _i, _a, item, length_1, err_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        totalLength = 0;
                        _i = 0, _a = this.playlist;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 8];
                        item = _a[_i];
                        if (!item.video) return [3 /*break*/, 6];
                        length_1 = 0;
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, (0, get_video_duration_1.getVideoDurationInSeconds)((0, path_1.join)((0, process_1.cwd)(), "assets/".concat(item.video.namespace, "/").concat(item.video.category, "/").concat(item.video.base)))];
                    case 3:
                        length_1 = _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        err_2 = _b.sent();
                        return [3 /*break*/, 5];
                    case 5:
                        // If item has a commercial longer than the video, use that instead.
                        if (item.commercial && item.commercial > length_1)
                            totalLength += item.commercial;
                        else
                            totalLength += length_1;
                        return [3 /*break*/, 7];
                    case 6:
                        if (item.commercial) {
                            totalLength += item.commercial;
                        }
                        _b.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 1];
                    case 8: return [2 /*return*/, totalLength];
                }
            });
        });
    };
    return VideoPlayer;
}(tiny_typed_emitter_1.TypedEmitter));
module.exports = VideoPlayer;
