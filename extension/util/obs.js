"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var nodecgApiContext = __importStar(require("./nodecg-api-context"));
var obs_websocket_js_1 = __importDefault(require("obs-websocket-js"));
var nodecg = nodecgApiContext.get();
var settings = {
    address: nodecg.bundleConfig.obs.address,
    password: nodecg.bundleConfig.obs.password,
};
nodecg.log.info('Setting up OBS connection.');
var obs = new obs_websocket_js_1.default();
connect();
function connect() {
    obs.connect(settings).then(function () {
        nodecg.log.info('OBS connection successful.');
    }).catch(function (err) { });
}
obs.on('ConnectionClosed', function () {
    nodecg.log.warn('OBS connection lost, retrying in 5 seconds.');
    setTimeout(connect, 5000);
});
// @ts-ignore: Pretty sure this emits an error.
obs.on('error', function (err) {
    nodecg.log.warn('OBS connection error: ', err);
});
exports.default = obs;
//# sourceMappingURL=obs.js.map