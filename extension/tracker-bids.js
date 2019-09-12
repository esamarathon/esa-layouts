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
const needle_1 = __importDefault(require("needle"));
const tracker_1 = require("./tracker");
const nodecgApiContext = __importStar(require("./util/nodecg-api-context"));
const nodecg_bundleconfig_1 = require("./util/nodecg-bundleconfig");
const nodecg = nodecgApiContext.get();
const refreshTime = 60000; // Get bids every 60s.
// Replicants.
const bids = nodecg.Replicant('bids', { persistent: false });
// Get the open bids from the API.
updateBids();
function updateBids() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const resp = yield needle_1.default('get', 
            // tslint:disable-next-line: max-line-length
            `https://${nodecg_bundleconfig_1.bundleConfig.tracker.address}/search/?event=${tracker_1.eventInfo[tracker_1.streamEvtNumber].id}&type=allbids&state=OPENED`, {
                cookies: tracker_1.cookies,
            });
            const currentBids = processRawBids(resp.body);
            bids.value = currentBids;
            setTimeout(updateBids, refreshTime);
        }
        catch (err) {
            nodecg.log.warn('Error updating bids.');
            nodecg.log.debug('Error updating bids:', err);
            bids.value = [];
            setTimeout(updateBids, refreshTime);
        }
    });
}
// Processes the response from the API above.
function processRawBids(bids) {
    const parentBidsByID = {};
    const childBids = [];
    bids.forEach((bid) => {
        // Ignore denied/pending entries.
        if (bid.fields.state === 'DENIED' || bid.fields.state === 'PENDING') {
            return;
        }
        // bid is an option for a bid war if the parent is set.
        if (bid.fields.parent) {
            childBids.push(bid);
        }
        else {
            // We want to use the short description if possible.
            let description = bid.fields.shortdescription;
            if (!description || description === '') {
                description = bid.fields.description;
            }
            const formattedParentBid = {
                description,
                id: bid.pk,
                name: bid.fields.name,
                total: parseFloat(bid.fields.total),
                game: bid.fields.speedrun__name,
                category: bid.fields.speedrun__category,
                end_time: Date.parse(bid.fields.speedrun__endtime),
                war: false,
                allow_user_options: false,
                options: [],
                goal: 0,
            };
            // If the bid isn't a target, it will be a bid war.
            if (!bid.fields.istarget) {
                formattedParentBid.war = true;
                formattedParentBid.allow_user_options = bid.fields.allowuseroptions;
                formattedParentBid.options = [];
            }
            else {
                formattedParentBid.goal = parseFloat(bid.fields.goal);
            }
            parentBidsByID[bid.pk] = formattedParentBid;
        }
    });
    childBids.forEach((bid) => {
        const formattedChildBid = {
            id: bid.pk,
            parent: bid.fields.parent,
            name: bid.fields.name,
            total: parseFloat(bid.fields.total),
        };
        // If we have a parent for this child, add it to the parent.
        const parent = parentBidsByID[bid.fields.parent];
        if (parent) {
            parentBidsByID[bid.fields.parent].options.push(formattedChildBid);
        }
    });
    // Transfer object made above to an array instead.
    const bidsArray = [];
    for (const id in parentBidsByID) {
        if (!{}.hasOwnProperty.call(parentBidsByID, id)) {
            continue;
        }
        const bid = parentBidsByID[id];
        if (bid.options && bid.options.length) {
            // Sort bid war options from largest to smallest.
            bid.options = bid.options.sort((a, b) => {
                if (a.total > b.total) {
                    return -1;
                }
                if (a.total < b.total) {
                    return 1;
                }
                // a must be equal to b
                return 0;
            });
        }
        bidsArray.push(bid);
    }
    // Sort by earliest first.
    bidsArray.sort((a, b) => {
        if (a.end_time < b.end_time) {
            return -1;
        }
        if (a.end_time > b.end_time) {
            return 1;
        }
        // a must be equal to b
        return 0;
    });
    return bidsArray;
}
//# sourceMappingURL=tracker-bids.js.map