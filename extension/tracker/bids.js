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
const eventConfig = (0, nodecg_1.get)().bundleConfig.event;
const config = (0, nodecg_1.get)().bundleConfig.tracker;
const { useTestData } = (0, nodecg_1.get)().bundleConfig;
const refreshTime = 30 * 1000; // Get bids every 30s.
// Processes the response from the API.
function processRawBids(rawBids) {
    const parentBids = {};
    const childBids = [];
    rawBids.forEach((bid) => {
        // Ignore denied/pending entries.
        if (bid.fields.state === 'DENIED' || bid.fields.state === 'PENDING') {
            return;
        }
        // If parent is set, this is an option for a bid war.
        if (bid.fields.parent) {
            childBids.push(bid);
        }
        else {
            parentBids[bid.pk] = {
                description: bid.fields.shortdescription || bid.fields.description || undefined,
                id: bid.pk,
                name: bid.fields.name,
                total: parseFloat(bid.fields.total),
                game: bid.fields.speedrun__name,
                category: bid.fields.speedrun__category,
                endTime: bid.fields.speedrun__endtime
                    ? Date.parse(bid.fields.speedrun__endtime) : undefined,
                war: !bid.fields.istarget,
                allowUserOptions: !bid.fields.istarget && bid.fields.allowuseroptions,
                options: [],
                goal: (bid.fields.goal) ? parseFloat(bid.fields.goal) : undefined,
            };
        }
    });
    childBids.forEach((bid) => {
        // If we have a parent for this child, add it to the parent.
        if (parentBids[bid.fields.parent]) {
            parentBids[bid.fields.parent].options.push({
                id: bid.pk,
                parent: bid.fields.parent,
                name: bid.fields.name,
                total: parseFloat(bid.fields.total),
            });
        }
    });
    // Transfer object made above to an array instead.
    const bidsArray = Object.keys(parentBids).map((bidID) => {
        const bid = parentBids[bidID];
        // Sort bid war options from largest to smallest.
        if (bid.options && bid.options.length) {
            bid.options = bid.options.sort((a, b) => {
                if (a.total > b.total) {
                    return -1;
                }
                if (a.total < b.total) {
                    return 1;
                }
                return 0;
            });
        }
        return bid;
    });
    // Sort by earliest first.
    bidsArray.sort((a, b) => {
        if (!a.endTime || !b.endTime || a.endTime < b.endTime) {
            return -1;
        }
        if (a.endTime > b.endTime) {
            return 1;
        }
        return 0;
    });
    // Filter out any bid wars with 0 options that don't allow user options.
    bidsArray.filter((bid) => (!bid.war || (bid.war && (bid.options.length || !bid.allowUserOptions))));
    return bidsArray;
}
// Get the open bids from the API.
async function updateBids() {
    var _a;
    try {
        const resp = await (0, needle_1.default)('get', `https://${config.address}/search/?event=${_1.eventInfo[eventConfig.thisEvent - 1].id}`
            + '&type=allbids&state=OPENED', {
            cookies: (0, _1.getCookies)(),
        });
        if (!resp.statusCode || resp.statusCode >= 300 || resp.statusCode < 200) {
            throw new Error(`status code ${(_a = resp.statusCode) !== null && _a !== void 0 ? _a : 'unknown'}`);
        }
        if (!Array.isArray(resp.body)) {
            throw new Error('received non-array type');
        }
        const currentBids = processRawBids(resp.body);
        if (!Array.isArray(currentBids)) {
            throw new Error('currentBids result was non-array type');
        }
        replicants_1.bids.value = currentBids;
    }
    catch (err) {
        (0, nodecg_1.get)().log.warn('[Tracker] Error updating bids');
        (0, nodecg_1.get)().log.debug('[Tracker] Error updating bids:', err);
        replicants_1.bids.value.length = 0; // Clear the array so we do not display incorrect information.
    }
    setTimeout(updateBids, refreshTime);
}
// eslint-disable-next-line import/prefer-default-export
function setup() {
    if (!useTestData) {
        updateBids();
    }
    else {
        // Test Data
        const randGoal = Math.floor(Math.random() * 1000);
        const randBidWarID = Math.floor(Math.random() * 1000);
        const randBidWarAmount = Math.random() * 1000;
        replicants_1.bids.value = [
            {
                id: Math.floor(Math.random() * 1000),
                name: 'Test Goal',
                description: 'This is a test description.',
                total: randGoal / 2,
                goal: randGoal,
                game: 'Test Game',
                category: 'Test Category',
                endTime: Date.now() + 21600000,
                war: false,
                allowUserOptions: false,
                options: [],
            },
            {
                id: randBidWarID,
                name: 'Test Bid War 1',
                description: 'This is a test description.',
                total: randBidWarAmount,
                game: 'Test Game',
                category: 'Test Category',
                endTime: Date.now() + 21600000,
                war: true,
                allowUserOptions: false,
                options: [
                    {
                        id: Math.floor(Math.random() * 1000),
                        parent: randBidWarID,
                        name: 'Test Option 1',
                        total: randBidWarAmount * 0.3,
                    },
                    {
                        id: Math.floor(Math.random() * 1000),
                        parent: randBidWarID,
                        name: 'Test Option 2',
                        total: randBidWarAmount * 0.7,
                    },
                ],
            },
            {
                id: randBidWarID + 1,
                name: 'Test Bid War 2',
                description: 'This is a test description.',
                total: randBidWarAmount,
                game: 'Test Game',
                category: 'Test Category',
                endTime: Date.now() + 21600000,
                war: true,
                allowUserOptions: true,
                options: [
                    {
                        id: Math.floor(Math.random() * 1000),
                        parent: randBidWarID + 1,
                        name: 'Test User Option 1',
                        total: randBidWarAmount * 0.3,
                    },
                    {
                        id: Math.floor(Math.random() * 1000),
                        parent: randBidWarID + 1,
                        name: 'Test User Option 2',
                        total: randBidWarAmount * 0.7,
                    },
                ],
            },
            {
                id: randBidWarID + 2,
                name: 'Test Bid War 3',
                description: 'This is a test description.',
                total: randBidWarAmount,
                game: 'Test Game',
                category: 'Test Category',
                endTime: Date.now() + 21600000,
                war: true,
                allowUserOptions: true,
                options: [
                    {
                        id: Math.floor(Math.random() * 1000),
                        parent: randBidWarID + 1,
                        name: 'Test Option 1',
                        total: randBidWarAmount * 0.2,
                    },
                    {
                        id: Math.floor(Math.random() * 1000),
                        parent: randBidWarID + 1,
                        name: 'Test Option 2',
                        total: randBidWarAmount * 0.2,
                    },
                    {
                        id: Math.floor(Math.random() * 1000),
                        parent: randBidWarID + 1,
                        name: 'Test Option 3',
                        total: randBidWarAmount * 0.2,
                    },
                    {
                        id: Math.floor(Math.random() * 1000),
                        parent: randBidWarID + 1,
                        name: 'Test Option 4',
                        total: randBidWarAmount * 0.2,
                    },
                    {
                        id: Math.floor(Math.random() * 1000),
                        parent: randBidWarID + 1,
                        name: 'Test Option 5',
                        total: randBidWarAmount * 0.1,
                    },
                    {
                        id: Math.floor(Math.random() * 1000),
                        parent: randBidWarID + 1,
                        name: 'Test Option 6',
                        total: randBidWarAmount * 0.1,
                    },
                ],
            },
        ];
    }
}
exports.setup = setup;
