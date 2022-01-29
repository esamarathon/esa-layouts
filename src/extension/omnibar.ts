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

// Filter helper used below.
function filterUpcomingRuns(run: RunData): boolean {
  return !run.scheduledS || run.scheduledS >= (Date.now() / 1000);
}

// Gets next upcoming run from the cache (after refilling it if needed).
let upcomingRunsCache: RunData[] = [];
function getUpcomingRun(): RunData | undefined {
  // Filter out any already passed runs (according to schedule) from cache.
  upcomingRunsCache = upcomingRunsCache.filter(filterUpcomingRuns);
  // Fill up cache if empty, also run the filter again.
  if (!upcomingRunsCache.length) upcomingRunsCache = sc.getNextRuns(4).filter(filterUpcomingRuns);
  // Just return nothing if cache now happens to be empty.
  if (!upcomingRunsCache.length) return undefined;
  return upcomingRunsCache.shift();
}

// Filter helper used below.
function filterPrizes(prize: Prizes[0]): boolean {
  return !!prize.startTime && !!prize.endTime
    && Date.now() > prize.startTime && Date.now() < prize.endTime;
}

// Gets next currently active prize from the cache (after refilling it if needed).
let prizesCache: Prizes = [];
function getPrize(): Prizes[0] | undefined {
  // Filter out any currently inactive prizes from cache.
  prizesCache = prizesCache.filter(filterPrizes);
  // Fill up cache if empty, also run the filter again.
  if (!prizesCache.length) prizesCache = clone(prizes.value).filter(filterPrizes);
  // Just return nothing if cache now happens to be empty.
  if (!prizesCache.length) return undefined;
  return prizesCache.shift();
}

// Gets a random (but weighted) active milestone.
let lastBidId = -1;
function getBid(): Bids[0] | undefined {
  // Just return nothing if there are no bids to show.
  if (!bids.value.length) return undefined;
  let filtered = clone(bids.value).filter((b) => b.id !== lastBidId);
  if (!filtered.length) filtered = clone(bids.value);
  const choices = filtered.reduce<{ bid: Bids[0], cumulativeWeight: number }[]>((prev, bid) => {
    // Weight: (15 minutes / time between now and prize ending), to the power of itself.
    // This is also capped between 0 and 1. Basically, anything in the next
    // 15 minutes is weighted 1, and after that quickly
    // gets lower.
    let weight = Math.max(Math.min((15 * 60 * 1000)
      / Math.max((bid.endTime ?? 0) - Date.now(), 0), 1), 0) ** 2;
    if (bid.id === lastBidId && bids.value.length > 1) weight = 0;
    prev.push({ bid, cumulativeWeight: (prev.slice(-1)[0]?.cumulativeWeight ?? 0) + weight });
    return prev;
  }, []);
  const rand = choices.slice(-1)[0].cumulativeWeight * Math.random();
  const choice = choices.find((opt) => opt.cumulativeWeight >= rand);
  lastBidId = choice?.bid.id ?? -1;
  return choice?.bid;
}

// Gets a random active milestone.
let lastMilestoneId = '';
function getMilestone(): DonationTotalMilestones[0] | undefined {
  const active = clone(donationTotalMilestones.value).filter((m) => m.enabled && m.amount);
  // Just return nothing if there are no active milestones to show.
  if (!active.length) return undefined;
  let filtered = active.filter((m) => m.id !== lastMilestoneId);
  if (!filtered.length) filtered = active;
  const rand = Math.floor(Math.random() * filtered.length);
  const chosen = filtered[rand];
  lastMilestoneId = chosen.id;
  return chosen;
}

let loopsWithoutResult = 0;
async function showNext(): Promise<void> {
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
    // If we get stuck in a loop, pause for 10s, then try again.
    if (loopsWithoutResult >= omnibar.value.rotation.length) {
      await new Promise((res) => { setTimeout(res, 10 * 1000); });
      loopsWithoutResult = 0;
    }
    const lastIndex = omnibar.value.rotation.findIndex((r) => r.id === omnibar.value.lastId);
    let nextIndex = lastIndex + 1;
    if (omnibar.value.rotation.length - 1 < nextIndex) nextIndex = 0;
    const next = omnibar.value.rotation[nextIndex];
    omnibar.value.lastId = next.id;
    loopsWithoutResult += 1;
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
    loopsWithoutResult = 0;
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
    if (msgData.entities.urls.length > 0) {
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
