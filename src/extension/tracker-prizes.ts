import type { Configschema } from 'configschema';
import needle from 'needle';
import type { Tracker } from 'types';
import { eventInfo, getCookies } from './tracker';
import { get as nodecg } from './util/nodecg';
import { prizes } from './util/replicants';

const config = (nodecg().bundleConfig as Configschema).tracker;
const { useTestData } = nodecg().bundleConfig as Configschema;
const refreshTime = 60 * 1000; // Get prizes every 60s.

// Processes the response from the API above.
function processRawPrizes(rawPrizes: Tracker.Prize[]): Tracker.FormattedPrize[] {
  return rawPrizes.map((prize) => {
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
    // Only add prize if applicable right now.
  }).filter((prize) => !!prize.startTime && !!prize.endTime
    && Date.now() > prize.startTime && Date.now() < prize.endTime);
}

// Get the prizes from the API.
// We always get these from the first listed event, in the case of multiple tracker events.
async function updatePrizes(): Promise<void> {
  try {
    const resp = await needle(
      'get',
      `https://${config.address}/search/?event=${eventInfo[0].id}&type=prize&state=ACCEPTED`,
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
        id: Math.floor(Math.random() * 1000),
        name: 'Test Prize Name',
        provided: 'Anonymous',
        minimumBid: Math.floor(Math.random() * 50),
        image: 'https://homepages.cae.wisc.edu/~ece533/images/cat.png',
        // startTime: Date.now(),
        endTime: Date.now() + 21600000, // Now + 6 hours
      },
    ];
  }
}
