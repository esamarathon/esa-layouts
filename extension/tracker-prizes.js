"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const moment_1 = __importDefault(require("moment"));
const needle_1 = __importDefault(require("needle"));
const tracker_1 = require("./tracker");
const nodecgApiContext = __importStar(require("./util/nodecg-api-context"));
const nodecg_bundleconfig_1 = require("./util/nodecg-bundleconfig");
const nodecg = nodecgApiContext.get();
const refreshTime = 60000; // Get bids every 60s.
// Replicants.
const prizes = nodecg.Replicant('prizes', { persistent: false });
// Get the prizes from the API.
updatePrizes();
function updatePrizes() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const resp = yield needle_1.default('get', 
            // Prizes always from the first event specified.
            // tslint:disable-next-line: max-line-length
            `https://${nodecg_bundleconfig_1.bundleConfig.tracker.address}/search/?event=${tracker_1.eventInfo[0].id}&type=prize&state=ACCEPTED`, {
                cookies: tracker_1.cookies,
            });
            const currentPrizes = processRawPrizes(resp.body);
            prizes.value = currentPrizes;
            setTimeout(updatePrizes, refreshTime);
        }
        catch (err) {
            nodecg.log.warn('Error updating prizes.');
            nodecg.log.debug('Error updating prizes:', err);
            prizes.value = [];
            setTimeout(updatePrizes, refreshTime);
        }
    });
}
// Processes the response from the API above.
function processRawPrizes(prizes) {
    const prizesArray = [];
    prizes.forEach((prize) => {
        const formattedPrize = {
            id: prize.pk,
            name: prize.fields.name,
            provided: prize.fields.provider || 'Anonymous',
            minimum_bid: parseFloat(prize.fields.minimumbid),
            image: prize.fields.image,
            start_timestamp: '',
            end_timestamp: '',
        };
        // If there's a start run, use it's starting time.
        if (prize.fields.startrun) {
            formattedPrize.start_timestamp = prize.fields.startrun__starttime;
        }
        else if (prize.fields.starttime) {
            formattedPrize.start_timestamp = prize.fields.starttime;
        }
        else {
            formattedPrize.start_timestamp = '';
        }
        // If there's an ending run, use it's end time.
        if (prize.fields.endrun) {
            formattedPrize.end_timestamp = prize.fields.endrun__endtime;
        }
        else if (prize.fields.endtime) {
            formattedPrize.end_timestamp = prize.fields.endtime;
        }
        else {
            formattedPrize.end_timestamp = '';
        }
        const currentTimestamp = moment_1.default().unix();
        const startTimestamp = moment_1.default(formattedPrize.start_timestamp).unix();
        const endTimestamp = moment_1.default(formattedPrize.end_timestamp).unix();
        // Prize not applicable right now, so don't add it.
        if (currentTimestamp < startTimestamp || currentTimestamp > endTimestamp) {
            return;
        }
        prizesArray.push(formattedPrize);
    });
    return prizesArray;
}
//# sourceMappingURL=tracker-prizes.js.map