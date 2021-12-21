import { v4 as uuid } from 'uuid';
import { Asset, MediaBox, Tracker } from '../../../types';
import { store } from '../store';

/**
 * Checks if the supplied type is that of an alert.
 * @param type Type of alert
 */
export function isAlertType(type: MediaBox.Types): boolean {
  return ['donation', 'subscription', 'cheer'].includes(type);
}

/**
 * Returns details about a piece of media from rotation if found.
 * @param media Media from rotation you wish to query information on.
 */
export function getMediaDetails(media: MediaBox.RotationElem): { name?: string } {
  let details: Asset | Tracker.FormattedPrize | undefined;
  if (media.type === 'prize_generic') {
    return {
      name: 'Generic Prize Slide',
    };
  }
  if (media.type === 'image') {
    details = store.state.images.find((l) => l.sum === media.mediaUUID);
  } else if (media.type === 'prize') {
    details = store.state.prizes.find((p) => p.id.toString() === media.mediaUUID);
  }
  return details ? {
    name: details.name,
  } : {};
}

/**
 * Used by VueDraggble to properly clone items.
 * @param type Type of item to be cloned.
 * @param mediaUUID UUID of media, sum of image, ID of prize etc.
 */
export function clone(
  type: 'image' | 'prize' | 'prize_generic',
  mediaUUID?: string,
): MediaBox.RotationElem {
  return {
    type,
    id: uuid(),
    mediaUUID: mediaUUID || '-1',
    seconds: 60,
  };
}

/**
 * Returns if a prize should be shown or not.
 * @param prize Formatted prize object from the tracker.
 */
export function isPrizeApplicable(prize?: Tracker.FormattedPrize): boolean {
  return !!(prize && prize.startTime && prize.endTime
  && Date.now() > prize.startTime && Date.now() < prize.endTime);
}
