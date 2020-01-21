import clone from 'clone';
import needle from 'needle';
import { cookies, eventInfo, streamEvtNumber } from './tracker';
import * as nodecgApiContext from './util/nodecg-api-context';
import { bundleConfig } from './util/nodecg-bundleconfig';

const nodecg = nodecgApiContext.get();
const refreshTime = 10000; // 10s
const apiURL = `https://${bundleConfig.tracker.address}/search`;
const apiEditURL = `https://${bundleConfig.tracker.address}/edit`;
const donationsToRead = nodecg.Replicant<any[]>('donationsToRead', { defaultValue: [] });
let updateTimeout: any;

nodecg.listenFor('markDonationAsRead', markDonationAsRead);

// Get the donations still to be read from the API.
updateToReadDonations();
async function updateToReadDonations() {
  clearTimeout(updateTimeout); // Clear timeout in case this is triggered from a message.
  try {
    const resp = await needle(
      'get',
      `${apiURL}/?event=${eventInfo[streamEvtNumber].id}&type=donation&feed=toread`,
      {
        cookies,
      },
    );

    if (resp.statusCode === 200) {
      const currentDonations = processToReadDonations(resp.body);
      donationsToRead.value = clone(currentDonations);
      updateTimeout = setTimeout(updateToReadDonations, refreshTime);
    } else {
      throw new Error('');
    }
  } catch (err) {
    nodecg.log.warn('Error updating to read donations:', err);
    updateTimeout = setTimeout(updateToReadDonations, refreshTime);
  }
}

function processToReadDonations(donations: any) {
  const donationsArray: any[] = [];

  donations.forEach((donation: any) => {
    donationsArray.push({
      id: donation.pk,
      name: donation.fields.donor__public,
      amount: parseFloat(donation.fields.amount),
      comment: (donation.fields.commentstate === 'APPROVED') ? donation.fields.comment : '',
      timestamp: donation.fields.timereceived,
    });
  });

  // Sort by earliest first.
  donationsArray.sort((a, b) => {
    if (a.timestamp < b.timestamp) {
      return -1;
    }
    if (a.timestamp > b.timestamp) {
      return 1;
    }

    // a must be equal to b
    return 0;
  });

  return donationsArray;
}

async function markDonationAsRead(id: Number, callback?: any) {
  try {
    const resp = await needle(
      'get',
      `${apiEditURL}/?type=donation&id=${id}&readstate=READ&commentstate=APPROVED`,
      {
        cookies,
      },
    );

    if (resp.statusCode === 200) {
      nodecg.log.info(`Successfully marked donation ${id} as read.`);
      updateToReadDonations();
      if (callback) {
        callback();
      }
    } else {
      throw new Error('');
    }
  } catch (err) {
    nodecg.log.warn(`Error marking donation ${id} as read:`, err);
    updateToReadDonations();
    if (callback) {
      callback();
    }
  }
}
