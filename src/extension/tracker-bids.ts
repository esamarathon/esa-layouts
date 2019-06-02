// https://github.com/GamesDoneQuick/agdq18-layouts/blob/master/extension/bids.js

import requestPromise from 'request-promise';
import { Bids } from '../../schemas';
import * as nodecgUtils from './util/nodecg';

const nodecg = nodecgUtils.getCtx();
requestPromise.defaults({ jar: true });
const apiURL = 'https://donations.esamarathon.com/search';
const refreshTime = 60000; // Get bids every 60s.

const eventID = 14;

// Replicants.
const bids = nodecg.Replicant<Bids>('bids', { persistent: false });

// Get the open bids from the API.
updateBids();
function updateBids() {
  requestPromise({
    uri: `${apiURL}/?event=${eventID}&type=allbids&state=OPENED`,
    resolveWithFullResponse: true,
    json: true,
  }).then((resp: any) => {
    const currentBids = processRawBids(resp.body);
    bids.value = currentBids;
    setTimeout(updateBids, refreshTime);
  }).catch((err: any) => {
    nodecg.log.warn('Error updating bids:', err);
    bids.value = [];
    setTimeout(updateBids, refreshTime);
  });
}

// Processes the response from the API above.
function processRawBids(bids: any) {
  interface ParentBidsByID {
    [k: string]: any;
  }
  const parentBidsByID: ParentBidsByID = {};
  const childBids: any[] = [];

  bids.forEach((bid: any) => {
    // Ignore denied/pending entries.
    if (bid.fields.state === 'DENIED' || bid.fields.state === 'PENDING') {
      return;
    }

    // bid is an option for a bid war if the parent is set.
    if (bid.fields.parent) {
      childBids.push(bid);
    } else {
      // We want to use the short description if possible.
      let description = bid.fields.shortdescription;
      if (!description || description === '') {
        description = bid.fields.description;
      }

      const formattedParentBid = {
        description,
        id: bid.pk,
        name: bid.fields.name,
        total: parseFloat(bid.fields.total),
        game: bid.fields.speedrun__name,
        category: bid.fields.speedrun__category,
        end_time: Date.parse(bid.fields.speedrun__endtime),
        war: false,
        allow_user_options: false,
        options: [],
        goal: 0,
      };

      // If the bid isn't a target, it will be a bid war.
      if (!bid.fields.istarget) {
        formattedParentBid.war = true;
        formattedParentBid.allow_user_options = bid.fields.allowuseroptions;
        formattedParentBid.options = [];
      } else {
        formattedParentBid.goal = parseFloat(bid.fields.goal);
      }

      parentBidsByID[bid.pk] = formattedParentBid;
    }
  });

  childBids.forEach((bid) => {
    const formattedChildBid = {
      id: bid.pk,
      parent: bid.fields.parent,
      name: bid.fields.name,
      total: parseFloat(bid.fields.total),
    };

    // If we have a parent for this child, add it to the parent.
    const parent = parentBidsByID[bid.fields.parent];
    if (parent) {
      parentBidsByID[bid.fields.parent].options.push(formattedChildBid);
    }
  });

  // Transfer object made above to an array instead.
  const bidsArray = [];
  for (const id in parentBidsByID) {
    if (!{}.hasOwnProperty.call(parentBidsByID, id)) {
      continue;
    }

    const bid = parentBidsByID[id];

    if (bid.options && bid.options.length) {
      // Sort bid war options from largest to smallest.
      bid.options = bid.options.sort((a: any, b: any) => {
        if (a.total > b.total) {
          return -1;
        }
        if (a.total < b.total) {
          return 1;
        }

        // a must be equal to b
        return 0;
      });
    }

    bidsArray.push(bid);
  }

  // Sort by earliest first.
  bidsArray.sort((a, b) => {
    if (a.end_time < b.end_time) {
      return -1;
    }
    if (a.end_time > b.end_time) {
      return 1;
    }

    // a must be equal to b
    return 0;
  });

  return bidsArray;
}
