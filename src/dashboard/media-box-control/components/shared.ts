import { MediaBox } from 'schemas';
import { Asset, Tracker } from 'types';
import { v4 as uuid } from 'uuid';
import { store } from '../store';

export function getMediaDetails(media: MediaBox['rotation'][0]): { name?: string } {
  let details: Asset | Tracker.FormattedPrize | undefined;
  if (media.type === 'image') {
    details = store.state.images.find((l) => l.sum === media.mediaUUID);
  } else if (media.type === 'prize') {
    details = store.state.prizes.find((p) => p.id.toString() === media.mediaUUID);
  }
  return details ? {
    name: details.name,
  } : {};
}

export function clone(type: 'image' | 'prize', mediaUUID: string): MediaBox['rotation'][0] {
  return {
    type,
    id: uuid(),
    mediaUUID,
    seconds: 60,
  };
}

export function isPrizeApplicable(prize: Tracker.FormattedPrize): boolean {
  return !!(prize && prize.startTime && prize.endTime
  && Date.now() > prize.startTime && Date.now() < prize.endTime);
}
