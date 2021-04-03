import type { Configschema } from '@esa-layouts/types/schemas/configschema';
import type { Tracker } from '@esamarathon/esa-layouts-shared/types';
import needle from 'needle';
import { eventInfo, getCookies } from './tracker';
import { get as nodecg } from './util/nodecg';
import { bids } from './util/replicants';

const eventConfig = (nodecg().bundleConfig as Configschema).event;
const config = (nodecg().bundleConfig as Configschema).tracker;
const { useTestData } = nodecg().bundleConfig as Configschema;
const refreshTime = 60 * 1000; // Get bids every 60s.

// Processes the response from the API.
function processRawBids(rawBids: Tracker.Bid[]): Tracker.FormattedBid[] {
  const parentBids: { [k: string]: Tracker.FormattedBid } = {};
  const childBids: Tracker.BidChild[] = [];

  rawBids.forEach((bid) => {
    // Ignore denied/pending entries.
    if (bid.fields.state === 'DENIED' || bid.fields.state === 'PENDING') {
      return;
    }

    // If parent is set, this is an option for a bid war.
    if (bid.fields.parent) {
      childBids.push(bid as Tracker.BidChild);
    } else {
      parentBids[bid.pk] = {
        description: bid.fields.shortdescription || bid.fields.description || undefined,
        id: bid.pk,
        name: bid.fields.name,
        total: parseFloat(bid.fields.total),
        game: bid.fields.speedrun__name,
        category: bid.fields.speedrun__category,
        endTime: bid.fields.speedrun__endtime
          ? Date.parse(bid.fields.speedrun__endtime) : undefined,
        war: !bid.fields.istarget,
        allowUserOptions: !bid.fields.istarget && bid.fields.allowuseroptions,
        options: [],
        goal: (bid.fields.goal) ? parseFloat(bid.fields.goal) : undefined,
      };
    }
  });

  childBids.forEach((bid) => {
    // If we have a parent for this child, add it to the parent.
    if (parentBids[bid.fields.parent]) {
      parentBids[bid.fields.parent].options.push({
        id: bid.pk,
        parent: bid.fields.parent,
        name: bid.fields.name,
        total: parseFloat(bid.fields.total),
      });
    }
  });

  // Transfer object made above to an array instead.
  const bidsArray = Object.keys(parentBids).map((bidID) => {
    const bid = parentBids[bidID];
    // Sort bid war options from largest to smallest.
    if (bid.options && bid.options.length) {
      bid.options = bid.options.sort((a, b) => {
        if (a.total > b.total) {
          return -1;
        }
        if (a.total < b.total) {
          return 1;
        }
        return 0;
      });
    }
    return bid;
  });

  // Sort by earliest first.
  bidsArray.sort((a, b) => {
    if (!a.endTime || !b.endTime || a.endTime < b.endTime) {
      return -1;
    }
    if (a.endTime > b.endTime) {
      return 1;
    }
    return 0;
  });

  // Filter out any bid wars with 0 options that don't allow user options.
  bidsArray.filter((bid) => (
    !bid.war || (bid.war && (bid.options.length || !bid.allowUserOptions))
  ));

  return bidsArray;
}

// Get the open bids from the API.
async function updateBids(): Promise<void> {
  try {
    const resp = await needle(
      'get',
      `https://${config.address}/search/?event=${eventInfo[eventConfig.thisEvent - 1].id}`
        + '&type=allbids&state=OPENED',
      {
        cookies: getCookies(),
      },
    );
    const currentBids = processRawBids(resp.body);
    bids.value = currentBids;
  } catch (err) {
    nodecg().log.warn('[Tracker] Error updating bids');
    nodecg().log.debug('[Tracker] Error updating bids:', err);
    bids.value.length = 0; // Clear the array so we do not display incorrect information.
  }
  setTimeout(updateBids, refreshTime);
}

export function setup(): void {
  if (!useTestData) {
    updateBids();
  } else {
    // Test Data
    const randGoal = Math.floor(Math.random() * 1000);
    const randBidWarID = Math.floor(Math.random() * 1000);
    const randBidWarAmount = Math.random() * 1000;
    bids.value = [
      {
        id: Math.floor(Math.random() * 1000),
        name: 'Test Goal',
        description: 'This is a test description.',
        total: randGoal / 2,
        goal: randGoal,
        game: 'Test Game',
        category: 'Test Category',
        endTime: Date.now() + 21600000, // Now + 6 hours
        war: false,
        allowUserOptions: false,
        options: [],
      },
      {
        id: randBidWarID,
        name: 'Test Bid War',
        description: 'This is a test description.',
        total: randBidWarAmount,
        game: 'Test Game',
        category: 'Test Category',
        endTime: Date.now() + 21600000, // Now + 6 hours
        war: true,
        allowUserOptions: false,
        options: [
          {
            id: Math.floor(Math.random() * 1000),
            parent: randBidWarID,
            name: 'Test Option 1',
            total: randBidWarAmount * 0.3,
          },
          {
            id: Math.floor(Math.random() * 1000),
            parent: randBidWarID,
            name: 'Test Option 2',
            total: randBidWarAmount * 0.7,
          },
        ],
      },
      {
        id: randBidWarID + 1,
        name: 'Test Bid War',
        description: 'This is a test description.',
        total: randBidWarAmount,
        game: 'Test Game',
        category: 'Test Category',
        endTime: Date.now() + 21600000, // Now + 6 hours
        war: true,
        allowUserOptions: true,
        options: [
          {
            id: Math.floor(Math.random() * 1000),
            parent: randBidWarID + 1,
            name: 'Test User Option 1',
            total: randBidWarAmount * 0.3,
          },
          {
            id: Math.floor(Math.random() * 1000),
            parent: randBidWarID + 1,
            name: 'Test User Option 2',
            total: randBidWarAmount * 0.7,
          },
        ],
      },
    ];
  }
}
