"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var nodecgApiContext = __importStar(require("./util/nodecg-api-context"));
module.exports = function (nodecg) {
    nodecgApiContext.set(nodecg);
    require('./streamdeck');
    require('./rabbitmq');
    // Set up OBS connection if enabled.
    if (nodecg.bundleConfig.obs.enable) {
        require('./util/obs');
    }
};
//# sourceMappingURL=index.js.map