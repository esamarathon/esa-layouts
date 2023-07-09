"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clone_1 = __importDefault(require("clone"));
const nodecg_1 = require("./util/nodecg");
const replicants_1 = require("./util/replicants");
let lastBidId = -1; // This should go in a replicant at some point
let lastPrizeId = -1; // This should go in a replicant at some point
/**
 * Calculates a weight for a supplied bid depending on how
 * close said bid is to current time.
 * Anything within the next 10 minutes has a relative weight of 1,
 * beyond that theres a quadratic falloff.
 * Last bid we were showing defaults to 0.
 * @param bid Formatted bid from the tracker.
 */
function getBidWeight(bid) {
    return lastBidId === bid.id
        ? 0 : Math.max(Math.min((10 * 60 * 1000) / ((bid.endTime || 0) - Date.now()), 1), 0) ** 2;
}
/**
 * Get a random bid to be shown based on a weighting system,
 * so nearer bids are more likely to be picked.
 * Original logic written by CBenni.
 */
function getRandomBid() {
    const choices = replicants_1.bids.value.map((bid) => ({
        bid,
        weight: getBidWeight(bid),
    }));
    const totalWeight = choices.reduce((p, c) => p + c.weight, 0);
    let rand = Math.random();
    const bid = choices.find((choice) => {
        // The actual chance is the relative weight divided by the total weight.
        const chance = choice.weight / totalWeight;
        if (chance >= rand) {
            return true;
        }
        rand -= chance;
        return false;
    });
    lastBidId = (bid === null || bid === void 0 ? void 0 : bid.bid.id) || -1;
    return bid === null || bid === void 0 ? void 0 : bid.bid;
}
/**
 * Sets the current prize to be shown.
 */
function getRandomPrize() {
    // We only want to show prizes that are actually applicable right now!
    const activePrizes = replicants_1.prizes.value.filter((prize) => (!!prize.startTime && !!prize.endTime
        && Date.now() > prize.startTime && Date.now() < prize.endTime));
    let prize;
    if (activePrizes.length === 1) {
        [prize] = activePrizes;
    }
    else if (activePrizes.length > 1) {
        const applicablePrizes = activePrizes.filter((p) => p.id !== lastPrizeId);
        const rand = Math.floor(Math.random() * applicablePrizes.length);
        prize = applicablePrizes[rand];
    }
    lastPrizeId = (prize === null || prize === void 0 ? void 0 : prize.id) || -1;
    return prize;
}
async function showNext() {
    // If nothing in the rotation anymore, just stop for now.
    if (!replicants_1.intermissionSlides.value.rotation.length) {
        replicants_1.intermissionSlides.value.current = null;
        return;
    }
    const lastIndex = replicants_1.intermissionSlides.value.rotation
        .findIndex((r) => { var _a; return r.id === ((_a = replicants_1.intermissionSlides.value.current) === null || _a === void 0 ? void 0 : _a.id); });
    let nextIndex = lastIndex + 1;
    if (replicants_1.intermissionSlides.value.rotation.length - 1 < nextIndex)
        nextIndex = 0;
    const next = (0, clone_1.default)(replicants_1.intermissionSlides.value.rotation[nextIndex]);
    if (next.type === 'RandomBid') {
        const bid = getRandomBid();
        next.bidId = bid === null || bid === void 0 ? void 0 : bid.id;
    }
    else if (next.type === 'RandomPrize') {
        const prize = getRandomPrize();
        next.prizeId = prize === null || prize === void 0 ? void 0 : prize.id;
    }
    replicants_1.intermissionSlides.value.current = next;
    (0, nodecg_1.get)().log.debug('[Intermission Slides] Will now show slide of type:', next.type);
}
replicants_1.intermissionSlides.on('change', (newVal, oldVal) => {
    // If nothing is currently being shown, and the rotation is filled from being empty,
    // trigger the cycle to start up again.
    if (!newVal.current && oldVal && newVal.rotation.length && !oldVal.rotation.length) {
        showNext();
    }
});
// Listens for messages from the graphic to change to the next slide.
(0, nodecg_1.get)().listenFor('intermissionSlidesShowNext', (data, ack) => {
    showNext();
    if (ack && !(ack === null || ack === void 0 ? void 0 : ack.handled))
        ack();
});
