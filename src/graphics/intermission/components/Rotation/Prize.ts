import { store } from '../../store';

/**
 * Sets the current prize to be shown.
 */
// eslint-disable-next-line import/prefer-default-export
export function setCurrentPrize(): boolean {
  // We only want to show prizes that are actually applicable right now!
  const activePrizes = store.state.prizes.filter((prize) => (
    !!prize.startTime && !!prize.endTime
    && Date.now() > prize.startTime && Date.now() < prize.endTime
  ));
  let prize;
  if (activePrizes.length === 1) {
    [prize] = activePrizes;
  } else if (activePrizes.length > 1) {
    const prizes = activePrizes.filter((p) => p.id !== store.state.currentPrize?.id);
    const rand = Math.floor(Math.random() * prizes.length);
    prize = prizes[rand];
  }
  store.commit('setCurrentPrize', prize);
  return !!prize;
}
