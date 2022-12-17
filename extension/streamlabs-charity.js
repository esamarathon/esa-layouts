"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const needle_1 = __importDefault(require("needle"));
const nodecg_1 = require("./util/nodecg");
const replicants_1 = require("./util/replicants");
const config = (0, nodecg_1.get)().bundleConfig;
async function updateDonationTotalFromAPI(init = false) {
    try {
        let total = 0;
        const resp = await (0, needle_1.default)('get', config.streamlabsCharity.apiUrl);
        if (resp.statusCode === 200) {
            total = resp.body.amount_raised / 100;
        }
        if (init || replicants_1.donationTotal.value < total) {
            (0, nodecg_1.get)().log.info('[Streamlabs Charity] API donation total changed: $%s', total);
            replicants_1.donationTotal.value = total;
        }
    }
    catch (err) {
        (0, nodecg_1.get)().log.warn('[Streamlabs Charity] Error updating donation total from API');
        (0, nodecg_1.get)().log.debug('[Streamlabs Charity] Error updating donation total from API:', err);
    }
}
async function setup() {
    (0, nodecg_1.get)().log.info('[Streamlabs Charity] Setting up');
    // Get initial total from API and set an interval.
    updateDonationTotalFromAPI(true);
    setInterval(updateDonationTotalFromAPI, 10 * 1000);
}
if (config.streamlabsCharity.enabled) {
    setup();
}
