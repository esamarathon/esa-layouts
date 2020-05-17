import { store } from '../../store';

/**
 * Sets the current prize to be shown.
 */
export function setCurrentPrize(): boolean {
  let prize;
  if (store.state.prizes.length === 1) {
    [prize] = store.state.prizes;
  } else if (store.state.prizes.length > 1) {
    const prizes = store.state.prizes.filter((p) => p.id !== store.state.currentPrize?.id);
    const rand = Math.floor(Math.random() * prizes.length);
    prize = prizes[rand];
  }
  store.commit('setCurrentPrize', prize);
  return !!prize;
}
