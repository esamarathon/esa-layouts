import { IntermissionSlides } from '@esa-layouts/types/schemas';
import { Tracker } from '@shared/types';
import clone from 'clone';
import { get as nodecg } from './util/nodecg';
import { bids, intermissionSlides, prizes } from './util/replicants';

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
function getBidWeight(bid: Tracker.FormattedBid): number {
  return lastBidId === bid.id
    ? 0 : Math.max(
      Math.min(
        (10 * 60 * 1000) / ((bid.endTime || 0) - Date.now()),
        1,
      ),
      0,
    ) ** 2;
}

/**
 * Get a random bid to be shown based on a weighting system,
 * so nearer bids are more likely to be picked.
 * Original logic written by CBenni.
 */
function getRandomBid(): Tracker.FormattedBid | undefined {
  const choices = bids.value.map((bid) => ({
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
  lastBidId = bid?.bid.id || -1;
  return bid?.bid;
}

/**
 * Sets the current prize to be shown.
 */
function getRandomPrize(): Tracker.FormattedPrize | undefined {
  // We only want to show prizes that are actually applicable right now!
  const activePrizes = prizes.value.filter((prize) => (
    !!prize.startTime && !!prize.endTime
    && Date.now() > prize.startTime && Date.now() < prize.endTime
  ));
  let prize;
  if (activePrizes.length === 1) {
    [prize] = activePrizes;
  } else if (activePrizes.length > 1) {
    const applicablePrizes = activePrizes.filter((p) => p.id !== lastPrizeId);
    const rand = Math.floor(Math.random() * applicablePrizes.length);
    prize = applicablePrizes[rand];
  }
  lastPrizeId = prize?.id || -1;
  return prize;
}

async function showNext(): Promise<void> {
  // If nothing in the rotation anymore, just stop for now.
  if (!intermissionSlides.value.rotation.length) {
    intermissionSlides.value.current = null;
    return;
  }
  const lastIndex = intermissionSlides.value.rotation
    .findIndex((r) => r.id === intermissionSlides.value.current?.id);
  let nextIndex = lastIndex + 1;
  if (intermissionSlides.value.rotation.length - 1 < nextIndex) nextIndex = 0;
  const next = clone(intermissionSlides.value.rotation[nextIndex]) as
    NonNullable<IntermissionSlides['current']>;
  if (next.type === 'RandomBid') {
    const bid = getRandomBid();
    next.bidId = bid?.id;
  } else if (next.type === 'RandomPrize') {
    const prize = getRandomPrize();
    next.prizeId = prize?.id;
  }
  intermissionSlides.value.current = next;
  nodecg().log.debug('[Intermission Slides] Will now show slide of type:', next.type);
}

intermissionSlides.on('change', (newVal, oldVal) => {
  // If nothing is currently being shown, and the rotation is filled from being empty,
  // trigger the cycle to start up again.
  if (!newVal.current && oldVal && newVal.rotation.length && !oldVal.rotation.length) {
    showNext();
  }
});

// Listens for messages from the graphic to change to the next slide.
nodecg().listenFor('intermissionSlidesShowNext', (data, ack) => {
  showNext();
  if (ack && !ack?.handled) ack();
});
