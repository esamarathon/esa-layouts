import { store } from '../../store';

let index = 0;

/**
 * Sets the current image/video to be shown.
 * Currently just cycles through all available assets in "order".
 */
// eslint-disable-next-line import/prefer-default-export
export function setCurrentMedia(): boolean {
  if (!store.state.intermissionSlides.length) {
    return false;
  }
  store.commit('setCurrentMedia', store.state.intermissionSlides[index]);
  if (index >= store.state.intermissionSlides.length - 1) {
    index = 0;
  } else {
    index += 1;
  }
  return true;
}
