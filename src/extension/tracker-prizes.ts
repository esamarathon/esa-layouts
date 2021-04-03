import type { Configschema } from '@esa-layouts/types/schemas/configschema';
import type { Tracker } from '@esamarathon/esa-layouts-shared/types';
import needle from 'needle';
import { eventInfo, getCookies } from './tracker';
import { get as nodecg } from './util/nodecg';
import { prizes } from './util/replicants';

const config = (nodecg().bundleConfig as Configschema).tracker;
const { useTestData } = nodecg().bundleConfig as Configschema;
const refreshTime = 60 * 1000; // Get prizes every 60s.

// Processes the response from the API above.
function processRawPrizes(rawPrizes: Tracker.Prize[]): Tracker.FormattedPrize[] {
  return rawPrizes.filter((prize) => prize.fields.state === 'ACCEPTED').map((prize) => {
    const startTime = prize.fields.startrun__starttime || prize.fields.starttime;
    const endTime = prize.fields.endrun__endtime || prize.fields.endtime;
    return {
      id: prize.pk,
      name: prize.fields.name,
      provided: prize.fields.provider || undefined,
      minimumBid: parseFloat(prize.fields.minimumbid),
      image: prize.fields.image || undefined,
      startTime: startTime ? Date.parse(startTime) : undefined,
      endTime: endTime ? Date.parse(endTime) : undefined,
    };
  });
}

// Get the prizes from the API.
// We always get these from the first listed event, in the case of multiple tracker events.
async function updatePrizes(): Promise<void> {
  try {
    const resp = await needle(
      'get',
      `https://${config.address}/search/?event=${eventInfo[0].id}&type=prize`,
      {
        cookies: getCookies(),
      },
    );
    const currentPrizes = processRawPrizes(resp.body);
    prizes.value = currentPrizes;
  } catch (err) {
    nodecg().log.warn('[Tracker] Error updating prizes');
    nodecg().log.debug('[Tracker] Error updating prizes:', err);
    prizes.value.length = 0; // Clear the array so we do not display incorrect information.
  }
  setTimeout(updatePrizes, refreshTime);
}

export function setup(): void {
  if (!useTestData) {
    updatePrizes();
  } else {
    // Test Data
    prizes.value = [
      {
        id: 624,
        name: 'Test Prize Name (Old)',
        provided: 'Anonymous',
        minimumBid: Math.floor(Math.random() * 50),
        image: 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png',
        startTime: Date.now() - 43200000, // Now - 12 hours
        endTime: Date.now() - 21600000, // Now + 6 hours
      },
      {
        id: 32,
        name: 'Test Prize Name (Active)',
        provided: 'Anonymous',
        minimumBid: Math.floor(Math.random() * 50),
        image: 'https://homepages.cae.wisc.edu/~ece533/images/cat.png',
        startTime: Date.now(),
        endTime: Date.now() + 21600000, // Now + 6 hours
      },
      {
        id: 878,
        name: 'Test Prize Name (Future)',
        provided: 'Anonymous',
        minimumBid: Math.floor(Math.random() * 50),
        image: 'https://homepages.cae.wisc.edu/~ece533/images/tulips.png',
        startTime: Date.now() + 21600000, // Now + 6 hours
        endTime: Date.now() + 43200000, // Now + 12 hours
      },
    ];
  }
}
