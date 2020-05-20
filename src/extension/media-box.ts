import type { Configschema } from 'configschema';
import { logSponsorLogoChange } from './util/logging';
import { get as nodecg } from './util/nodecg';
import obs from './util/obs';
import { mediaBox } from './util/replicants';

const obsConfig = (nodecg().bundleConfig as Configschema).obs;

/**
 * Get the length in milliseconds a piece of media should remain,
 * -1 if we cannot find it in the rotation.
 * @param id ID of media in rotation.
 */
function getLength(id: string): number {
  const media = mediaBox.value.rotation.find((i) => i.id === id);
  return media ? media.seconds * 1000 : -1;
}

/**
 * Get the index of the next piece of media in the rotation,
 * 0 if for some reason nothing can be located correctly.
 */
function getNextIndex(): number {
  const indexID = mediaBox.value.rotation
    .findIndex((i) => i.id === mediaBox.value.current?.id);
  return indexID >= 0 ? indexID + 1 : ((mediaBox.value.current?.index || -1) + 1);
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
  if (!mediaBox.value.rotation.length) {
    nodecg().log.debug('[Media Box] No media in rotation to cycle to, will wait');
    mediaBox.value.current = null;
  } else {
    const index = getNextIndex() < mediaBox.value.rotation.length ? getNextIndex() : 0;
    mediaBox.value.current = {
      type: mediaBox.value.rotation[index].type,
      id: mediaBox.value.rotation[index].id,
      mediaUUID: mediaBox.value.rotation[index].mediaUUID,
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
  if (!mediaBox.value.current) {
    if (mediaBox.value.rotation.length) {
      nodecg().log.debug('[Media Box] Media added to rotation, will cycle');
      cycle();
    }
  } else {
    const addedTime = Date.now() - mediaBox.value.current.timestamp;
    const timeElapsed = mediaBox.value.current.timeElapsed + addedTime;
    if (getLength(mediaBox.value.current.id) <= timeElapsed) {
      nodecg().log.debug('[Media Box] Current media time finished, will cycle');
      cycle();
    } else {
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
