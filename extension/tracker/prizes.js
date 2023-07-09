"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = void 0;
const needle_1 = __importDefault(require("needle"));
const _1 = require(".");
const nodecg_1 = require("../util/nodecg");
const replicants_1 = require("../util/replicants");
const config = (0, nodecg_1.get)().bundleConfig.tracker;
const { useTestData } = (0, nodecg_1.get)().bundleConfig;
const refreshTime = 60 * 1000; // Get prizes every 60s.
// Processes the response from the API above.
function processRawPrizes(rawPrizes) {
    return rawPrizes.filter((prize) => prize.fields.state === 'ACCEPTED').map((prize) => {
        const startTime = prize.fields.startrun__starttime || prize.fields.starttime;
        const endTime = prize.fields.endrun__endtime || prize.fields.endtime;
        return {
            id: prize.pk,
            name: prize.fields.name,
            provided: prize.fields.provider || undefined,
            minimumBid: parseFloat(prize.fields.minimumbid),
            image: prize.fields.image || undefined,
            startTime: startTime ? Date.parse(startTime) : undefined,
            endTime: endTime ? Date.parse(endTime) : undefined,
        };
    });
}
// Get the prizes from the API.
// We always get these from the first listed event, in the case of multiple tracker events.
async function updatePrizes() {
    var _a;
    try {
        const resp = await (0, needle_1.default)('get', `https://${config.address}/search/?event=${_1.eventInfo[0].id}&type=prize&feed=current`, {
            cookies: (0, _1.getCookies)(),
        });
        if (!resp.statusCode || resp.statusCode >= 300 || resp.statusCode < 200) {
            throw new Error(`status code ${(_a = resp.statusCode) !== null && _a !== void 0 ? _a : 'unknown'}`);
        }
        if (!Array.isArray(resp.body)) {
            throw new Error('received non-array type');
        }
        const currentPrizes = processRawPrizes(resp.body);
        if (!Array.isArray(currentPrizes)) {
            throw new Error('currentPrizes result was non-array type');
        }
        replicants_1.prizes.value = currentPrizes;
    }
    catch (err) {
        (0, nodecg_1.get)().log.warn('[Tracker] Error updating prizes');
        (0, nodecg_1.get)().log.debug('[Tracker] Error updating prizes:', err);
        replicants_1.prizes.value.length = 0; // Clear the array so we do not display incorrect information.
    }
    setTimeout(updatePrizes, refreshTime);
}
// eslint-disable-next-line import/prefer-default-export
function setup() {
    if (!useTestData) {
        updatePrizes();
    }
    else {
        // Test Data
        replicants_1.prizes.value = [
            {
                id: 624,
                name: 'Test Prize Name (Old)',
                provided: 'Anonymous',
                minimumBid: Math.floor(Math.random() * 50),
                image: 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png',
                startTime: Date.now() - 43200000,
                endTime: Date.now() - 21600000, // Now + 6 hours
            },
            {
                id: 32,
                name: 'Test Prize Name (Active)',
                provided: 'Anonymous',
                minimumBid: Math.floor(Math.random() * 50),
                image: 'https://homepages.cae.wisc.edu/~ece533/images/cat.png',
                startTime: Date.now(),
                endTime: Date.now() + 21600000, // Now + 6 hours
            },
            {
                id: 878,
                name: 'Test Prize Name (Future)',
                provided: 'Anonymous',
                minimumBid: Math.floor(Math.random() * 50),
                image: 'https://homepages.cae.wisc.edu/~ece533/images/tulips.png',
                startTime: Date.now() + 21600000,
                endTime: Date.now() + 43200000, // Now + 12 hours
            },
        ];
    }
}
exports.setup = setup;
