import type { Tracker } from '@shared/types';
import { store } from '../../store';

/**
 * Calculates a weight for a supplied bid depending on how
 * close said bid is to current time.
 * Anything within the next 10 minutes has a relative weight of 1,
 * beyond that theres a quadratic falloff.
 * Last bid we were showing defaults to 0.
 * @param bid Formatted bid from the tracker.
 */
function getBidWeight(bid: Tracker.FormattedBid): number {
  return store.state.currentBid?.id === bid.id
    ? 0 : Math.max(
      Math.min(
        (10 * 60 * 1000) / ((bid.endTime || 0) - Date.now()),
        1,
      ),
      0,
    ) ** 2;
}

/**
 * Sets the current bid to be shown based on a weighting system,
 * so nearer bids are more likely to be picked.
 * Original logic written by CBenni.
 */
export function setCurrentBid(): boolean {
  const choices = store.state.bids.map((bid) => ({
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
  store.commit('setCurrentBid', bid?.bid || undefined);
  return !!bid?.bid;
}
