import type { Configschema } from 'configschema';
import { logSponsorLogoChange } from './util/logging';
import { get as nodecg } from './util/nodecg';
import obs from './util/obs';
import { mediaBox } from './util/replicants';

const obsConfig = (nodecg().bundleConfig as Configschema).obs;

/**
 * Get the length in milliseconds a sponsor logo should remain,
 * -1 if we cannot find it in the rotation.
 * @param id ID of sponsor logo in rotation.
 */
function getLength(id: string): number {
  const logo = mediaBox.value.rotation.find((i) => i.id === id);
  return logo ? logo.seconds * 1000 : -1;
}

/**
 * Get the index of the next sponsor logo in the rotation,
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
 * Cycle to the next logo in the rotation, or set it to null if none available.
 */
function cycle(): void {
  if (!mediaBox.value.rotation.length) {
    nodecg().log.debug('[Sponsors] No logos in rotation to cycle to, will wait');
    mediaBox.value.current = null;
  } else {
    const index = getNextIndex() < mediaBox.value.rotation.length ? getNextIndex() : 0;
    mediaBox.value.current = {
      id: mediaBox.value.rotation[index].id,
      sum: mediaBox.value.rotation[index].sum,
      index,
      timestamp: Date.now(),
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
      nodecg().log.debug('[Sponsors] Logos added to rotation, will cycle');
      cycle();
    }
  } else if (mediaBox.value.current.timestamp
      + getLength(mediaBox.value.current.id) <= Date.now()) {
    nodecg().log.debug('[Sponsors] Current logo time finished, will cycle');
    cycle();
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
