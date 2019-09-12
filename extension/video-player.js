"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const clone_1 = __importDefault(require("clone"));
const nodecgApiContext = __importStar(require("./util/nodecg-api-context"));
const nodecg = nodecgApiContext.get();
const videos = nodecg.Replicant('assets:videos');
const currentSum = nodecg.Replicant('currentVideoSum');
const currentObj = nodecg.Replicant('currentVideoObj');
currentSum.on('change', (newVal) => {
    if (newVal && videos.value && videos.value.length) {
        currentObj.value = clone_1.default(findVideoBySum(newVal));
    }
    else {
        currentObj.value = undefined;
    }
});
videos.on('change', (newVal) => {
    if (newVal && newVal.length && currentSum.value) {
        currentObj.value = clone_1.default(findVideoBySum(currentSum.value));
    }
    else {
        currentObj.value = undefined;
    }
});
// Finds a video with the supplied checksum.
function findVideoBySum(sum) {
    let videoInfo;
    for (let i = 0; i < videos.value.length; i += 1) {
        if (videos.value[i].sum === sum) {
            videoInfo = videos.value[i];
            break;
        }
    }
    return videoInfo;
}
//# sourceMappingURL=video-player.js.map