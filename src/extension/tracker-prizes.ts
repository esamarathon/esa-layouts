// Event ID 9 only is being used for prizes; all prizes are stored in stream 1's event.

import moment from 'moment';
import requestPromise from 'request-promise';
import { Prizes } from '../../schemas';
import * as nodecgUtils from './util/nodecg';

const nodecg = nodecgUtils.getCtx();
requestPromise.defaults({ jar: true });
const apiURL = 'https://donations.esamarathon.com/search';
const refreshTime = 60000; // Get bids every 60s.

const eventID = 14;

// Replicants.
const prizes = nodecg.Replicant<Prizes>('prizes', { persistent: false });

// Get the prizes from the API.
updatePrizes();
function updatePrizes() {
  requestPromise({
    uri: `${apiURL}/?event=${eventID}&type=prize&state=ACCEPTED`,
    resolveWithFullResponse: true,
    json: true,
  }).then((resp: any) => {
    const currentPrizes = processRawPrizes(resp.body);
    prizes.value = currentPrizes;
    setTimeout(updatePrizes, refreshTime);
  }).catch((err: any) => {
    nodecg.log.warn('Error updating prizes:', err);
    prizes.value = [];
    setTimeout(updatePrizes, refreshTime);
  });
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
