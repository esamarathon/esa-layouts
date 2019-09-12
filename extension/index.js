"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
const nodecgApiContext = __importStar(require("./util/nodecg-api-context"));
module.exports = (nodecg) => {
    nodecgApiContext.set(nodecg);
    require('./layouts');
    require('./emotes');
    require('./tracker');
    require('./music');
    require('./stream-deck-buttons');
    require('./timer');
    require('./logging');
    require('./sponsors');
    require('./video-player');
    require('./tts-donations');
    require('./twitch-ext');
    return {
        obs: require('./util/obs').default,
    };
};
//# sourceMappingURL=index.js.map