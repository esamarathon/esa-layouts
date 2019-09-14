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
const clone_1 = __importDefault(require("clone"));
const needle_1 = __importDefault(require("needle"));
const tracker_1 = require("./tracker");
const nodecgApiContext = __importStar(require("./util/nodecg-api-context"));
const nodecg_bundleconfig_1 = require("./util/nodecg-bundleconfig");
const nodecg = nodecgApiContext.get();
const refreshTime = 10000; // 10s
const apiURL = `https://${nodecg_bundleconfig_1.bundleConfig.tracker.address}/search`;
const apiEditURL = `https://${nodecg_bundleconfig_1.bundleConfig.tracker.address}/edit`;
const donationsToRead = nodecg.Replicant('donationsToRead', { defaultValue: [] });
let updateTimeout;
nodecg.listenFor('markDonationAsRead', markDonationAsRead);
// Get the donations still to be read from the API.
updateToReadDonations();
function updateToReadDonations() {
    return __awaiter(this, void 0, void 0, function* () {
        clearTimeout(updateTimeout); // Clear timeout in case this is triggered from a message.
        try {
            const resp = yield needle_1.default('get', `${apiURL}/?event=${tracker_1.eventInfo[tracker_1.streamEvtNumber].id}&type=donation&feed=toread`, {
                cookies: tracker_1.cookies,
            });
            if (resp.statusCode === 200) {
                const currentDonations = processToReadDonations(resp.body);
                donationsToRead.value = clone_1.default(currentDonations);
                updateTimeout = setTimeout(updateToReadDonations, refreshTime);
            }
            else {
                throw new Error('');
            }
        }
        catch (err) {
            nodecg.log.warn('Error updating to read donations:', err);
            updateTimeout = setTimeout(updateToReadDonations, refreshTime);
        }
    });
}
function processToReadDonations(donations) {
    const donationsArray = [];
    donations.forEach((donation) => {
        donationsArray.push({
            id: donation.pk,
            name: donation.fields.donor__public,
            amount: parseFloat(donation.fields.amount),
            comment: (donation.fields.commentstate === 'APPROVED') ? donation.fields.comment : '',
            timestamp: donation.fields.timereceived,
        });
    });
    // Sort by earliest first.
    donationsArray.sort((a, b) => {
        if (a.timestamp < b.timestamp) {
            return -1;
        }
        if (a.timestamp > b.timestamp) {
            return 1;
        }
        // a must be equal to b
        return 0;
    });
    return donationsArray;
}
function markDonationAsRead(id, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const resp = yield needle_1.default('get', `${apiEditURL}/?type=donation&id=${id}&readstate=READ&commentstate=APPROVED`, {
                cookies: tracker_1.cookies,
            });
            if (resp.statusCode === 200) {
                nodecg.log.info(`Successfully marked donation ${id} as read.`);
                updateToReadDonations();
                if (callback) {
                    callback();
                }
            }
            else {
                throw new Error('');
            }
        }
        catch (err) {
            nodecg.log.warn(`Error marking donation ${id} as read:`, err);
            updateToReadDonations();
            if (callback) {
                callback();
            }
        }
    });
}
//# sourceMappingURL=tracker-donations.js.map