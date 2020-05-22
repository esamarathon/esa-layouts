import type { Configschema } from 'configschema';
import { Tracker } from 'types';
import { logSponsorLogoChange } from './util/logging';
import { get as nodecg } from './util/nodecg';
import obs from './util/obs';
import { assetsMediaBoxImages, mediaBox, prizes } from './util/replicants';

const obsConfig = (nodecg().bundleConfig as Configschema).obs;

/**
 * Get the length in milliseconds a piece of media should remain,
 * -1 if we cannot find it in the rotation.
 * @param id ID of media in rotation.
 */
function getLength(id: string): number {
  const media = mediaBox.value.rotationApplicable.find((i) => i.id === id);
  return media ? media.seconds * 1000 : -1;
}

/**
 * Get the index of the next piece of media in the rotation,
 * 0 if for some reason nothing can be located correctly.
 */
function getNextIndex(): number {
  const indexID = mediaBox.value.rotationApplicable
    .findIndex((i) => i.id === mediaBox.value.current?.id);
  return indexID >= 0 ? indexID + 1 : ((mediaBox.value.current?.index || -1) + 1);
}

/**
 * Returns if a prize should be shown or not.
 * @param prize Formatted prize object from the tracker.
 */
function isPrizeApplicable(prize?: Tracker.FormattedPrize): boolean {
  return !!(prize && prize.startTime && prize.endTime
    && Date.now() > prize.startTime && Date.now() < prize.endTime);
}

/**
 * Returns a random applicable prize if one is available.
 */
function getRandomPrize(): Tracker.FormattedPrize | undefined {
  const applicablePrizes = prizes.value.filter((p) => isPrizeApplicable(p));
  return applicablePrizes[Math.floor(Math.random() * applicablePrizes.length)];
}

/**
 * Check to know if a specified scene has sponsor logos in it or not.
 * @param name Name of scene to check; will be fully confirmed with OBS.
 */
function doesSceneHaveSponsorLogos(name?: string): boolean {
  if (!name) {
    return false;
  }
  // Hardcoded scenes that have sponsor logos on them as of "now".
  const scenes = [
    obs.findScene(obsConfig.names.scenes.gameLayout),
    obs.findScene(obsConfig.names.scenes.intermission),
    obs.findScene(obsConfig.names.scenes.commercials),
  ];
  const namedScene = obs.findScene(name);
  return scenes.includes(namedScene);
}

/**
 * Cycle to the next piece of media in the rotation, or delete if none is available.
 */
function cycle(): void {
  if (!mediaBox.value.rotationApplicable.length) {
    nodecg().log.debug('[Media Box] No media in rotation to cycle to, will wait');
    mediaBox.value.current = null;
  } else {
    const index = getNextIndex() < mediaBox.value.rotationApplicable.length ? getNextIndex() : 0;
    const media = mediaBox.value.rotationApplicable[index];
    const uuid = media.type === 'prize_generic'
      ? (getRandomPrize()?.id.toString() || '-1') : media.mediaUUID;
    mediaBox.value.current = {
      type: media.type,
      id: media.id,
      mediaUUID: uuid,
      index,
      timestamp: Date.now(),
      timeElapsed: 0,
    };
  }
  // Log the logo change if on a relevant scene.
  if (obs.streaming && doesSceneHaveSponsorLogos(obs.currentScene)) {
    logSponsorLogoChange(mediaBox.value.current);
  }
}

/**
 * This runs every second, all of the time.
 */
function update(): void {
  const rotationApplicableLengthOld = mediaBox.value.rotationApplicable.length;
  mediaBox.value.rotationApplicable = mediaBox.value.rotation.filter((m) => {
    // Only rotate to image if the asset actually exists.
    if (m.type === 'image') {
      return !!assetsMediaBoxImages.value.find((i) => i.sum === m.mediaUUID);
    }
    // Only show the generic prize element if there are applicable prizes to fill it with.
    if (m.type === 'prize_generic') {
      return !!prizes.value.filter((p) => isPrizeApplicable(p)).length;
    }
    // Only show prize if applicable right now.
    if (m.type === 'prize') {
      return isPrizeApplicable(prizes.value.find((p) => p.id.toString() === m.mediaUUID));
    }
    return false;
  });
  if (mediaBox.value.rotationApplicable.length !== rotationApplicableLengthOld) {
    nodecg().log.debug('[Media Box] Applicable rotation length changed');
  }
  if (!mediaBox.value.current) {
    if (mediaBox.value.rotationApplicable.length) {
      nodecg().log.debug('[Media Box] Media added to rotation, will cycle');
      cycle();
    }
  } else {
    const addedTime = Date.now() - mediaBox.value.current.timestamp;
    const timeElapsed = mediaBox.value.current.timeElapsed + addedTime;
    const index = mediaBox.value.rotationApplicable
      .findIndex((i) => i.id === mediaBox.value.current?.id);
    if (index < 0 || getLength(mediaBox.value.current.id) <= timeElapsed) {
      nodecg().log.debug('[Media Box] Current media time finished, will cycle');
      cycle();
    } else {
      mediaBox.value.current.index = index;
      mediaBox.value.current.timestamp = Date.now();
      mediaBox.value.current.timeElapsed = timeElapsed;
    }
  }
}

// Will log sponsors changing when going live/going offline if needed.
obs.on('streamingStatusChanged', (streaming, old) => {
  if (doesSceneHaveSponsorLogos(obs.currentScene)
    && mediaBox.value.current && typeof old === 'boolean') {
    if (streaming) {
      logSponsorLogoChange(mediaBox.value.current);
    } else {
      logSponsorLogoChange();
    }
  }
});

// Will log sponsors changing when the scene changes if needed.
obs.on('currentSceneChanged', (current, last) => {
  if (obs.streaming && mediaBox.value.current && last) {
    const currentHas = doesSceneHaveSponsorLogos(current);
    const lastHas = doesSceneHaveSponsorLogos(last);
    if (currentHas && !lastHas) {
      logSponsorLogoChange(mediaBox.value.current);
    } else if (!currentHas && lastHas) {
      logSponsorLogoChange();
    }
  }
});

update();
setInterval(update, 1000);
