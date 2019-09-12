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
// This stuff is done in an extension so it survives reloads/game layout changes.
const nodecg = nodecgApiContext.get();
const current = nodecg.Replicant('currentSponsorLogo', { persistent: false });
const logos = nodecg.Replicant('assets:sponsor-logos');
let index = 0;
let init = false;
logos.on('change', (newVal) => {
    if (newVal && newVal.length && !init) {
        showNextLogo();
        init = true;
    }
});
function showNextLogo() {
    // If no logos to show, just wait 10s then check again.
    // (should recode this to be smarter)
    if (!logos.value.length || !logos.value[index]) {
        current.value = {};
        index = 0;
        setTimeout(showNextLogo, 10000);
        return;
    }
    current.value = clone_1.default(logos.value[index]);
    setTimeout(showNextLogo, 60 * 1000);
    index += 1;
    if (logos.value.length <= index) {
        index = 0;
    }
}
//# sourceMappingURL=sponsors.js.map