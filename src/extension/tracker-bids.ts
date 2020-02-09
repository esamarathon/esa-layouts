import { Configschema } from 'configschema';
import needle from 'needle';
import { Bid, FormattedBid } from 'types';
import { eventInfo, getCookies } from './tracker';
import { get as nodecg } from './util/nodecg';
import { bids } from './util/replicants';

const eventConfig = (nodecg().bundleConfig as Configschema).event;
const config = (nodecg().bundleConfig as Configschema).tracker;
const { id } = eventInfo[eventConfig.thisEvent - 1];
const refreshTime = 60 * 1000; // Get bids every 60s.

// Processes the response from the API.
function processRawBids(rawBids: Bid[]): FormattedBid[] {
  const parentBids: { [k: string]: FormattedBid } = {};
  const childBids: Bid[] = [];

  rawBids.forEach((bid) => {
    // Ignore denied/pending entries.
    if (bid.fields.state === 'DENIED' || bid.fields.state === 'PENDING') {
      return;
    }

    // If parent is set, this is an option for a bid war.
    if (bid.fields.parent) {
      childBids.push(bid);
    } else {
      parentBids[bid.pk] = {
        description: bid.fields.shortdescription || bid.fields.description,
        id: bid.pk,
        name: bid.fields.name,
        total: parseFloat(bid.fields.total),
        game: bid.fields.speedrun__name,
        category: bid.fields.speedrun__category,
        endTime: Date.parse(bid.fields.speedrun__endtime),
        war: bid.fields.istarget,
        allowUserOptions: bid.fields.istarget && bid.fields.allowuseroptions,
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
    if (a.endTime < b.endTime) {
      return -1;
    }
    if (a.endTime > b.endTime) {
      return 1;
    }
    return 0;
  });

  return bidsArray;
}

// Get the open bids from the API.
async function updateBids(): Promise<void> {
  try {
    const resp = await needle(
      'get',
      `https://${config.address}/search/?event=${id}&type=allbids&state=OPENED`,
      {
        cookies: getCookies(),
      },
    );
    const currentBids = processRawBids(resp.body);
    bids.value = currentBids;
    setTimeout(updateBids, refreshTime);
  } catch (err) {
    nodecg().log.warn('[Tracker] Error updating bids');
    nodecg().log.debug('[Tracker] Error updating bids:', err);
    bids.value.length = 0; // Clear the array so we do not display incorrect information.
    setTimeout(updateBids, refreshTime);
  }
}

updateBids();
