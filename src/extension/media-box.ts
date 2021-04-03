import type { Configschema } from '@esa-layouts/types/schemas/configschema';
import MediaBox from '@esamarathon/esa-layouts-shared/mediabox/extension';
import { logSponsorLogoChange } from './util/logging';
import { get as nodecg } from './util/nodecg';
import obs from './util/obs';
import { mq } from './util/rabbitmq';

const mb = new MediaBox(nodecg(), mq.evt);
const obsConfig = (nodecg().bundleConfig as Configschema).obs;

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

// Will log sponsors changing when going live/going offline if needed.
obs.on('streamingStatusChanged', (streaming, old) => {
  if (doesSceneHaveSponsorLogos(obs.currentScene)
    && mb.mediaBox.value.current && typeof old === 'boolean') {
    if (streaming) {
      logSponsorLogoChange(mb.mediaBox.value.current);
    } else {
      logSponsorLogoChange();
    }
  }
});

// Will log sponsors changing when the scene changes if needed.
obs.on('currentSceneChanged', (current, last) => {
  if (obs.streaming && mb.mediaBox.value.current && last) {
    const currentHas = doesSceneHaveSponsorLogos(current);
    const lastHas = doesSceneHaveSponsorLogos(last);
    if (currentHas && !lastHas) {
      logSponsorLogoChange(mb.mediaBox.value.current);
    } else if (!currentHas && lastHas) {
      logSponsorLogoChange();
    }
  }
});

mb.mediaBox.on('change', (newVal, oldVal) => {
  if (newVal.current?.id !== oldVal?.current?.id
    && obs.streaming && doesSceneHaveSponsorLogos(obs.currentScene)) {
    logSponsorLogoChange(newVal.current);
  }
});
