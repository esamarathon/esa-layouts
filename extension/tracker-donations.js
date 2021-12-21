"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = exports.markDonationAsRead = void 0;
const needle_1 = __importDefault(require("needle"));
const tracker_1 = require("./tracker");
const nodecg_1 = require("./util/nodecg");
const replicants_1 = require("./util/replicants");
const eventConfig = (0, nodecg_1.get)().bundleConfig.event;
const config = (0, nodecg_1.get)().bundleConfig.tracker;
const { useTestData } = (0, nodecg_1.get)().bundleConfig;
const refreshTime = 10 * 1000; // Get donations every 10s.
let updateTimeout;
function processToReadDonations(donations) {
    return donations.map((donation) => ({
        id: donation.pk,
        name: donation.fields.donor__public,
        amount: parseFloat(donation.fields.amount),
        comment: (donation.fields.commentstate === 'APPROVED') ? donation.fields.comment : undefined,
        timestamp: Date.parse(donation.fields.timereceived),
    })).sort((a, b) => {
        if (a.timestamp < b.timestamp) {
            return -1;
        }
        if (a.timestamp > b.timestamp) {
            return 1;
        }
        return 0;
    });
}
// Get the donations still to be read from the API.
async function updateToReadDonations() {
    clearTimeout(updateTimeout); // Clear timeout in case this is triggered from a message.
    try {
        const resp = await (0, needle_1.default)('get', `https://${config.address}/search/?event=${tracker_1.eventInfo[eventConfig.thisEvent - 1].id}`
            + '&type=donation&feed=toread', {
            cookies: (0, tracker_1.getCookies)(),
        });
        const currentDonations = processToReadDonations(resp.body);
        replicants_1.donationsToRead.value = currentDonations;
    }
    catch (err) {
        (0, nodecg_1.get)().log.warn('[Tracker] Error updating to read donations');
        (0, nodecg_1.get)().log.debug('[Tracker] Error updating to read donations:', err);
        replicants_1.donationsToRead.value.length = 0; // Clear the array so we do not display incorrect information.
    }
    updateTimeout = setTimeout(updateToReadDonations, refreshTime);
}
/**
 * Attempts to mark the supplied donation ID as read in the tracker.
 * @param donationID ID of the donation in the tracker.
 */
async function markDonationAsRead(donationID) {
    try {
        const resp = await (0, needle_1.default)('get', `https://${config.address}/edit/?type=donation&id=${donationID}`
            + '&readstate=READ&commentstate=APPROVED', {
            cookies: (0, tracker_1.getCookies)(),
        });
        if (resp.statusCode === 200) {
            (0, nodecg_1.get)().log.info(`[Tracker] Successfully marked donation ${donationID} as read`);
        }
        else {
            throw new Error(`Status Code ${resp.statusCode}`);
        }
    }
    catch (err) {
        (0, nodecg_1.get)().log.warn(`[Tracker] Error marking donation ${donationID} as read`);
        (0, nodecg_1.get)().log.debug(`[Tracker] Error marking donation ${donationID} as read:`, err);
    }
    updateToReadDonations();
}
exports.markDonationAsRead = markDonationAsRead;
function setup() {
    if (!useTestData) {
        updateToReadDonations();
    }
    else {
        // Test Data
        replicants_1.donationsToRead.value = [
            {
                id: Math.floor(Math.random() * 1000),
                name: 'Anonymous',
                amount: Math.random() * 1000,
                comment: 'This is a test comment.',
                timestamp: Date.now(),
            },
        ];
    }
}
exports.setup = setup;
