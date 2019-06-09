import moment from 'moment';
import needle from 'needle';
import { Prizes } from '../../schemas';
import { cookies, eventID } from './tracker';
import * as nodecgApiContext from './util/nodecg-api-context';

const nodecg = nodecgApiContext.get();
const refreshTime = 60000; // Get bids every 60s.

// Replicants.
const prizes = nodecg.Replicant<Prizes>('prizes', { persistent: false });

// Get the prizes from the API.
updatePrizes();
async function updatePrizes() {
  try {
    const resp = await needle(
      'get',
      `${nodecg.bundleConfig.tracker.address}/search/?event=${eventID}&type=prize&state=ACCEPTED`,
      {
        cookies,
      },
    );
    const currentPrizes = processRawPrizes(resp.body);
    prizes.value = currentPrizes;
    setTimeout(updatePrizes, refreshTime);
  } catch (err) {
    nodecg.log.warn('Error updating prizes.');
    nodecg.log.debug('Error updating prizes:', err);
    prizes.value = [];
    setTimeout(updatePrizes, refreshTime);
  }
}

// Processes the response from the API above.
function processRawPrizes(prizes: any) {
  const prizesArray: any[] = [];

  prizes.forEach((prize: any) => {
    const formattedPrize = {
      id: prize.pk,
      name: prize.fields.name,
      provided: prize.fields.provider || 'Anonymous',
      minimum_bid: parseFloat(prize.fields.minimumbid),
      image: prize.fields.image,
      start_timestamp: '',
      end_timestamp: '',
    };

    // If there's a start run, use it's starting time.
    if (prize.fields.startrun) {
      formattedPrize.start_timestamp = prize.fields.startrun__starttime;
    } else if (prize.fields.starttime) {
      formattedPrize.start_timestamp = prize.fields.starttime;
    } else {
      formattedPrize.start_timestamp = '';
    }

    // If there's an ending run, use it's end time.
    if (prize.fields.endrun) {
      formattedPrize.end_timestamp = prize.fields.endrun__endtime;
    } else if (prize.fields.endtime) {
      formattedPrize.end_timestamp = prize.fields.endtime;
    } else {
      formattedPrize.end_timestamp = '';
    }

    const currentTimestamp = moment().unix();
    const startTimestamp = moment(formattedPrize.start_timestamp).unix();
    const endTimestamp = moment(formattedPrize.end_timestamp).unix();

    // Prize not applicable right now, so don't add it.
    if (currentTimestamp < startTimestamp || currentTimestamp > endTimestamp) {
      return;
    }

    prizesArray.push(formattedPrize);
  });

  return prizesArray;
}
