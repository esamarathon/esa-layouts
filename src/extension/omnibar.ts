import { Bids, Configschema, DonationTotalMilestones, Prizes } from '@esa-layouts/types/schemas';
import clone from 'clone';
import { RunData } from 'speedcontrol-util/types';
import { v4 as uuid } from 'uuid';
import { get as nodecg } from './util/nodecg';
import obs from './util/obs';
import { mq } from './util/rabbitmq';
import { bids, donationTotalMilestones, omnibar, prizes } from './util/replicants';
import { sc } from './util/speedcontrol';

const config = nodecg().bundleConfig as Configschema;

// Stored caches but not persistent through NodeCG restarts.
let nextRunsCache: RunData[] = [];
let prizesCache: Prizes = [];

// Gets next upcoming run from the cache (after refilling it if needed).
// TODO: Refill cache *again* after filtering if this isn't a first cycle.
function getUpcomingRun(): RunData | undefined {
  // Fill up cache if empty.
  if (!nextRunsCache.length) nextRunsCache = sc.getNextRuns(4);
  // Filter out any already passed runs (according to schedule) from cache.
  nextRunsCache = nextRunsCache.filter((r) => !r.scheduledS || r.scheduledS >= (Date.now() / 1000));
  // Just return nothing if cache now happens to be empty.
  if (!nextRunsCache.length) return undefined;
  return nextRunsCache.shift();
}

// Gets next currently active prize from the cache (after refilling it if needed).
// TODO: Refill cache *again* after filtering if this isn't a first cycle.
function getPrize(): Prizes[0] | undefined {
  // Fill up cache if empty, only include currently active prizes.
  if (!prizesCache.length) prizesCache = clone(prizes.value);
  // Filter out any currently inactive prizes from cache.
  prizesCache = prizesCache.filter((prize) => !!prize.startTime && !!prize.endTime
    && Date.now() > prize.startTime && Date.now() < prize.endTime);
  // Just return nothing if cache now happens to be empty.
  if (!prizesCache.length) return undefined;
  return prizesCache.shift();
}

// Gets a random active milestone.
// TODO: Make this sequential?
// TODO: Implement original "weighted" code!
function getBid(): Bids[0] | undefined {
  // Just return nothing if there are no bids to show.
  if (!bids.value.length) return undefined;
  const rand = Math.floor(Math.random() * bids.value.length);
  return clone(bids.value[rand]);
}

// Gets a random active milestone.
// TODO: Make this sequential?
function getMilestone(): DonationTotalMilestones[0] | undefined {
  const filtered = donationTotalMilestones.value.filter((m) => m.enabled && m.amount);
  // Just return nothing if there are no filtered milestones to show.
  if (!filtered.length) return undefined;
  const rand = Math.floor(Math.random() * filtered.length);
  return clone(filtered[rand]);
}

// TODO: Work out what to do if we get stuck on an infinite loop.
function showNext(): void {
  if (omnibar.value.alertQueue.length) {
    const alert = omnibar.value.alertQueue.shift();
    if (alert) {
      nodecg().log.debug('[Omnibar] Alert available, will show:', alert?.type);
      const { type, id, data } = alert;
      omnibar.value.current = {
        type,
        id,
        props: {
          msg: data?.msg, // Tweet, CrowdControl
          user: data?.user, // Tweet
        },
      };
    } else showNext();
  } else {
    // If nothing in the rotation anymore, just stop for now.
    if (!omnibar.value.rotation.length) {
      delete omnibar.value.lastId;
      omnibar.value.current = null;
      return;
    }
    const lastIndex = omnibar.value.rotation.findIndex((r) => r.id === omnibar.value.lastId);
    let nextIndex = lastIndex + 1;
    if (omnibar.value.rotation.length - 1 < nextIndex) nextIndex = 0;
    const next = omnibar.value.rotation[nextIndex];
    omnibar.value.lastId = next.id;
    if (next.type === 'UpcomingRun') {
      const run = getUpcomingRun();
      if (!run) { showNext(); return; }
      omnibar.value.current = { ...next, props: { ...next.props, run } };
    } else if (next.type === 'Prize') {
      const prize = getPrize();
      if (!prize) { showNext(); return; }
      omnibar.value.current = { ...next, props: { ...next.props, prize } };
    } else if (next.type === 'Milestone') {
      const milestone = getMilestone();
      if (!milestone) { showNext(); return; }
      omnibar.value.current = { ...next, props: { ...next.props, milestone } };
    } else if (next.type === 'Bid') {
      const bid = getBid();
      if (!bid) { showNext(); return; }
      omnibar.value.current = { ...next, props: { ...next.props, bid } };
    } else {
      omnibar.value.current = clone(next);
    }
    nodecg().log.debug('[Omnibar] Will now show message of type:', next.type);
  }
}

omnibar.on('change', (newVal, oldVal) => {
  // If nothing is currently being shown, and the rotation is filled from being empty,
  // or we get alerts in the queue, trigger the cycle to start up again.
  if (!newVal.current && oldVal
  && ((newVal.rotation.length && !oldVal.rotation.length)
  || (newVal.alertQueue.length && !oldVal.alertQueue.length))) {
    showNext();
  }
});

// Listens for messages from the graphic to change to the next message.
nodecg().listenFor('omnibarShowNext', (data, ack) => {
  showNext();
  if (ack && !ack?.handled) ack();
});

// Listens for messages from the graphic to play the "donation" SFX via OBS source.
nodecg().listenFor('omnibarPlaySound', async (data, ack) => {
  if (config.obs.enabled && obs.connected) {
    try {
      await obs.conn.send('RestartMedia', { sourceName: config.obs.names.sources.donationSound });
    } catch (err) { /* catch */ }
  }
  if (ack && !ack?.handled) ack();
});

// Screened data from our moderation tool, used for the omnibar.
mq.evt.on('newScreenedTweet', (data) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const msgData: { [k: string]: any } = data.message; // TODO: Update MQ event!
  let message = msgData.full_text as string;

  // Regex removes multiple spaces/newlines from tweets.
  message = message.replace(/\s\s+|\n/g, ' ');
  // Regex removes Twitter URL shortener links.
  message = message.replace(/https:\/\/t\.co\/\w+/g, (match) => {
    if (msgData.entities?.urls?.length > 0) {
      const replacementUrl = msgData.entities.urls
        .find((urlInfo: { url: string }) => urlInfo.url === match);
      if (replacementUrl) return replacementUrl.display_url;
    }
    return '';
  });
  nodecg().log.debug('[Omnibar] Received new tweet from %s:', data.user.name, message);

  // Add Tweet to queue.
  omnibar.value.alertQueue.push({
    type: 'Tweet',
    id: uuid(),
    data: {
      user: data.user.name,
      msg: message,
    },
  });
});
mq.evt.on('newScreenedCrowdControl', (data) => {
  if (config.event.thisEvent === 1) {
    nodecg().log.debug('[Omnibar] Received new crowd control message:', data.message);
    // Add crowd control message to queue.
    omnibar.value.alertQueue.push({
      type: 'CrowdControl',
      id: uuid(),
      data: {
        msg: data.message.trailing,
      },
    });
  }
});
