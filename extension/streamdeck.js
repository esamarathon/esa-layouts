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
var nodecgApiContext = __importStar(require("./util/nodecg-api-context"));
var streamdeck_util_1 = __importDefault(require("streamdeck-util"));
var nodecg = nodecgApiContext.get();
var sd = new streamdeck_util_1.default({
    key: nodecg.bundleConfig.streamdeck.key,
    port: nodecg.bundleConfig.streamdeck.port,
    debug: nodecg.bundleConfig.streamdeck.debug,
});
sd.on('init', function () {
    // connection initilized
});
//# sourceMappingURL=streamdeck.js.map