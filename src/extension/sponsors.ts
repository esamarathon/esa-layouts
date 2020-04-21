import clone from 'clone';
import type { Configschema } from 'configschema';
import type { SponsorLogos } from 'schemas';
import { logSponsorLogoChange } from './logging';
import { get as nodecg } from './util/nodecg';
import obs from './util/obs';
import { sponsorLogos } from './util/replicants';

const obsConfig = (nodecg().bundleConfig as Configschema).obs;

/**
 * Get the length in milliseconds a sponsor logo should remain,
 * -1 if we cannot find it in the rotation.
 * @param id ID of sponsor logo in rotation.
 */
function getLength(id: string): number {
  const logo = sponsorLogos.value.rotation.find((i) => i.id === id);
  return logo ? logo.seconds * 1000 : -1;
}

/**
 * Get the index of the next sponsor logo in the rotation,
 * -1 if for some reason nothing can be located correctly.
 */
function getNextIndex(): number {
  const indexID = sponsorLogos.value.rotation
    .findIndex((i) => i.id === sponsorLogos.value.current?.id);
  return indexID >= 0 ? indexID + 1 : ((sponsorLogos.value.current?.index || -2) + 1);
}

/**
 * Checks what should be seen as the current sponsor logo on display,
 * changes depending on streaming status and scene in OBS.
 * @param previous Previous sponsor logo, if this was triggered due to a logo changing.
 */
function checkSponsorLogoVisibility(previous?: SponsorLogos['current']): void {
  if (obs.streaming
    && (obs.isCurrentScene(obsConfig.names.scenes.intermission)
    || obs.isCurrentScene(obsConfig.names.scenes.gameLayout))) {
    if (previous?.id !== sponsorLogos.value.current?.id) {
      logSponsorLogoChange(sponsorLogos.value.current);
    }
  } else if (sponsorLogos.value.current) {
    logSponsorLogoChange();
  }
}

/**
 * Cycle to the next logo in the rotation, or set it to null if none available.
 */
function cycle(): void {
  const previous = clone(sponsorLogos.value.current);
  if (!sponsorLogos.value.rotation.length) {
    nodecg().log.debug('[Sponsors] No logos in rotation to cycle to, will wait');
    sponsorLogos.value.current = null;
  } else {
    const index = getNextIndex() < sponsorLogos.value.rotation.length ? getNextIndex() : 0;
    sponsorLogos.value.current = {
      id: sponsorLogos.value.rotation[index].id,
      sum: sponsorLogos.value.rotation[index].sum,
      index,
      timestamp: Date.now(),
    };
  }
  checkSponsorLogoVisibility(previous);
}

/**
 * This runs every second, all of the time.
 */
function update(): void {
  if (!sponsorLogos.value.current) {
    if (sponsorLogos.value.rotation.length) {
      nodecg().log.debug('[Sponsors] Logos added to rotation, will cycle');
      cycle();
    }
  } else if (sponsorLogos.value.current.timestamp
      + getLength(sponsorLogos.value.current.id) <= Date.now()) {
    nodecg().log.debug('[Sponsors] Current logo time finished, will cycle');
    cycle();
  }
}

obs.on('streamingStateChanged', () => {
  checkSponsorLogoVisibility();
});

obs.on('currentSceneChanged', () => {
  checkSponsorLogoVisibility();
});

obs.once('connectionStateChanged', () => {
  checkSponsorLogoVisibility();
});

update();
setInterval(update, 1000);
