import clone from 'clone';
import type { Configschema } from 'configschema';
import { MediaBox, Tracker } from 'types';
import { v4 as uuid } from 'uuid';
import { logSponsorLogoChange } from './util/logging';
import { get as nodecg } from './util/nodecg';
import obs from './util/obs';
import { evt } from './util/rabbitmq';
import { assetsMediaBoxImages, mediaBox, prizes } from './util/replicants';

const obsConfig = (nodecg().bundleConfig as Configschema).obs;

/**
 * Checks if the supplied type is that of an alert.
 * @param type Type of alert
 */
function isAlertType(type: MediaBox.Types): boolean {
  return ['donation', 'subscription', 'cheer'].includes(type);
}

/**
 * Get the length in milliseconds a piece of media should remain,
 * -1 if we cannot find any relevant length.
 * @param media media box object, usually from "current" property.
 */
function getLength(media: MediaBox.ActiveElem): number {
  if (media && isAlertType(media.type)) {
    return 10 * 1000; // Alerts have a hardcoded 10 second length for now.
  }
  const length = mediaBox.value.rotationApplicable.find((i) => i.id === media?.id)?.seconds;
  return length ? length * 1000 : -1;
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
 * Handles the cycling of of the current media.
 * @param pause If we should be attempted to "pause" the current media for an alert.
 */
function cycle(pause = false): void {
  // If the alert queue has anything in it, we need to handle those first.
  if (mediaBox.value.alertQueue.length) {
    if (pause) { // Pause current media element.
      mediaBox.value.paused = clone(mediaBox.value.current);
    }
    mediaBox.value.current = {
      type: mediaBox.value.alertQueue[0].type,
      id: uuid(),
      mediaUUID: mediaBox.value.alertQueue[0].id,
      index: -1,
      timestamp: Date.now(),
      timeElapsed: 0,
    };
  } else if (mediaBox.value.rotationApplicable.length) {
    // Resume paused media element if applicable.
    if (mediaBox.value.paused) {
      const toResume = clone(mediaBox.value.paused);
      toResume.timestamp = Date.now();
      mediaBox.value.current = toResume;
      mediaBox.value.paused = null;
    } else { // Find next media element from rotation to use.
      const index = getNextIndex() < mediaBox.value.rotationApplicable.length ? getNextIndex() : 0;
      const media = mediaBox.value.rotationApplicable[index];
      const mUUID = media.type === 'prize_generic'
        ? (getRandomPrize()?.id.toString() || '-1') : media.mediaUUID;
      mediaBox.value.current = {
        type: media.type,
        id: media.id,
        mediaUUID: mUUID,
        index,
        timestamp: Date.now(),
        timeElapsed: 0,
      };
    }
  } else {
    nodecg().log.debug('[Media Box] No media in rotation to cycle to, will wait');
    mediaBox.value.current = null;
    mediaBox.value.paused = null;
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
  // Filters rotation for items only applicable/available at this moment.
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

  // If we have no piece of media, check if there is anything to show.
  if (!mediaBox.value.current) {
    if (mediaBox.value.rotationApplicable.length || mediaBox.value.alertQueue.length) {
      nodecg().log.debug(`[Media Box] ${mediaBox.value.alertQueue.length ? 'Alert' : 'Media'}`
        + ' available, will cycle');
      cycle();
    }
  } else { // If we have a current piece of media, need to check if it still should be shown.
    const addedTime = Date.now() - mediaBox.value.current.timestamp;
    const timeElapsed = mediaBox.value.current.timeElapsed + addedTime;
    const index = mediaBox.value.rotationApplicable
      .findIndex((i) => i.id === mediaBox.value.current?.id);

    // Cycle if it is time to remove the current media.
    if ((index < 0 && !isAlertType(mediaBox.value.current.type))
      || getLength(mediaBox.value.current) <= timeElapsed) {
      // If this is an alert, we also need to remove that one from the queue.
      if (isAlertType(mediaBox.value.current.type)) {
        const alertIndex = mediaBox.value.alertQueue
          .findIndex((a) => a.id === mediaBox.value.current?.mediaUUID);
        if (alertIndex >= 0) {
          mediaBox.value.alertQueue.splice(alertIndex, 1);
        }
      }
      nodecg().log.debug('[Media Box] Current media time finished, will cycle');
      cycle();
    } else {
      if (!isAlertType(mediaBox.value.current.type)) {
        mediaBox.value.current.index = index;
      }
      mediaBox.value.current.timestamp = Date.now();
      mediaBox.value.current.timeElapsed = timeElapsed;

      // If there are any alerts to show, we should do that now.
      if (!isAlertType(mediaBox.value.current.type) && mediaBox.value.alertQueue.length) {
        nodecg().log.debug('[Media Box] Alert available, will cycle');
        cycle(true);
      }
    }
  }
}

// Manages received donations/subscriptions/cheers.
evt.on('donationFullyProcessed', (data) => {
  if (data.comment_state === 'APPROVED') {
    nodecg().log.debug('[Media Box] Received new donation');
    mediaBox.value.alertQueue.push({
      type: 'donation',
      id: uuid(),
      data: {
        name: data.donor_visiblename.replace('(Anonymous)', 'Anonymous'),
        amount: data.amount,
        comment: data.comment || undefined,
      },
    });
  }
});
evt.on('newScreenedSub', (data) => {
  nodecg().log.debug('[Media Box] Received new subscription');
  mediaBox.value.alertQueue.push({
    type: 'subscription',
    id: uuid(),
    data: {
      systemMsg: data.message.tags['system-msg'].replace(/\\s/g, ' '),
      message: data.message.trailing,
    },
  });
});
evt.on('newScreenedCheer', (data) => {
  nodecg().log.debug('[Media Box] Received new cheer');
  mediaBox.value.alertQueue.push({
    type: 'cheer',
    id: uuid(),
    data: {
      name: data.message.tags['display-name'],
      amount: Number(data.message.tags.bits),
      message: data.message.trailing,
    },
  });
});

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
