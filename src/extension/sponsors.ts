import { get as nodecg } from './util/nodecg';
import { sponsorLogos } from './util/replicants';

/**
 * Get the length in milliseconds a sponsor logo should remain,
 * -1000 if we cannot find it in the rotation.
 * @param id ID of sponsor logo in rotation.
 */
function getLength(id: string): number {
  return (sponsorLogos.value.rotation.find((i) => i.id === id)?.seconds || -1) * 1000;
}

/**
 * Get the index of the next sponsor logo in the rotation,
 * 0 if for some reason nothing can be located correctly.
 */
function getNextIndex(): number {
  const indexID = sponsorLogos.value.rotation
    .findIndex((i) => i.id === sponsorLogos.value.current?.id);
  return indexID >= 0 ? indexID + 1 : ((sponsorLogos.value.current?.index || -1) + 1);
}

/**
 * Cycle to the next logo in the rotation, or set it to null if none available.
 */
function cycle(): void {
  if (!sponsorLogos.value.rotation.length) {
    nodecg().log.debug('[Sponsors] No logos in rotation to cycle to, will wait');
    sponsorLogos.value.current = null;
    return;
  }
  const index = (getNextIndex()) < sponsorLogos.value.rotation.length ? getNextIndex() : 0;
  sponsorLogos.value.current = {
    id: sponsorLogos.value.rotation[index].id,
    sum: sponsorLogos.value.rotation[index].sum,
    index,
    timestamp: Date.now(),
  };
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

setInterval(update, 1000);
