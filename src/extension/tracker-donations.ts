import type { Configschema } from '@esa-layouts/types/schemas/configschema';
import type { Tracker } from '@esamarathon/esa-layouts-shared/types';
import needle from 'needle';
import { eventInfo, getCookies } from './tracker';
import { get as nodecg } from './util/nodecg';
import { donationsToRead } from './util/replicants';

const eventConfig = (nodecg().bundleConfig as Configschema).event;
const config = (nodecg().bundleConfig as Configschema).tracker;
const { useTestData } = nodecg().bundleConfig as Configschema;
const refreshTime = 10 * 1000; // Get donations every 10s.
let updateTimeout: NodeJS.Timeout;

function processToReadDonations(donations: Tracker.Donation[]): Tracker.FormattedDonation[] {
  return donations.map((donation) => ({
    id: donation.pk,
    name: donation.fields.donor__public,
    amount: parseFloat(donation.fields.amount),
    comment: (donation.fields.commentstate === 'APPROVED') ? donation.fields.comment : undefined,
    timestamp: Date.parse(donation.fields.timereceived),
  })).sort((a, b) => {
    if (a.timestamp < b.timestamp) {
      return -1;
    }
    if (a.timestamp > b.timestamp) {
      return 1;
    }
    return 0;
  });
}

// Get the donations still to be read from the API.
async function updateToReadDonations(): Promise<void> {
  clearTimeout(updateTimeout); // Clear timeout in case this is triggered from a message.
  try {
    const resp = await needle(
      'get',
      `https://${config.address}/search/?event=${eventInfo[eventConfig.thisEvent - 1].id}`
        + '&type=donation&feed=toread',
      {
        cookies: getCookies(),
      },
    );
    const currentDonations = processToReadDonations(resp.body);
    donationsToRead.value = currentDonations;
  } catch (err) {
    nodecg().log.warn('[Tracker] Error updating to read donations');
    nodecg().log.debug('[Tracker] Error updating to read donations:', err);
    donationsToRead.value.length = 0; // Clear the array so we do not display incorrect information.
  }
  updateTimeout = setTimeout(updateToReadDonations, refreshTime);
}

/**
 * Attempts to mark the supplied donation ID as read in the tracker.
 * @param donationID ID of the donation in the tracker.
 */
export async function markDonationAsRead(donationID: number): Promise<void> {
  try {
    const resp = await needle(
      'get',
      `https://${config.address}/edit/?type=donation&id=${donationID}`
        + '&readstate=READ&commentstate=APPROVED',
      {
        cookies: getCookies(),
      },
    );
    if (resp.statusCode === 200) {
      nodecg().log.info(`[Tracker] Successfully marked donation ${donationID} as read`);
    } else {
      throw new Error(`Status Code ${resp.statusCode}`);
    }
  } catch (err) {
    nodecg().log.warn(`[Tracker] Error marking donation ${donationID} as read`);
    nodecg().log.debug(`[Tracker] Error marking donation ${donationID} as read:`, err);
  }
  updateToReadDonations();
}

export function setup(): void {
  if (!useTestData) {
    updateToReadDonations();
  } else {
    // Test Data
    donationsToRead.value = [
      {
        id: Math.floor(Math.random() * 1000),
        name: 'Anonymous',
        amount: Math.random() * 1000,
        comment: 'This is a test comment.',
        timestamp: Date.now(),
      },
    ];
  }
}
