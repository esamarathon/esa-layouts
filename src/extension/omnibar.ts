import { Bids, Configschema, DonationTotalMilestones, Omnibar, Prizes } from '@esa-layouts/types/schemas';
import clone from 'clone';
import { orderBy } from 'lodash';
import { RunData } from 'speedcontrol-util/types';
import { v4 as uuid } from 'uuid';
import { get as nodecg } from './util/nodecg';
import obs from './util/obs';
import { mq } from './util/rabbitmq';
import { bids, commentators, donationReader, donationTotalMilestones, omnibar, prizes } from './util/replicants';
import { sc } from './util/speedcontrol';

const config = nodecg().bundleConfig as Configschema;

// Temporary storage used for mini credits subscriptions/cheers/alerts while they are playing.
let tempMiniCreditsStorage: Omnibar['miniCredits'] = {
  runSubs: [],
  runCheers: [],
  runDonations: [],
};

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
  // If there is a pin to start showing.
  const { pin } = omnibar.value;
  if (pin) {
    let item: DonationTotalMilestones[0] | Bids[0] | undefined;
    if (pin.type === 'Milestone') {
      item = donationTotalMilestones.value.find((m) => m.id === pin.id);
    } else if (pin.type === 'Bid') {
      item = bids.value.find((b) => b.id === pin.id);
    }
    if (item) {
      item = clone(item);
      nodecg().log.debug('[Omnibar] Pin available, will show:', pin.type);
      omnibar.value.current = {
        type: pin.type,
        id: uuid(),
        props: {
          seconds: -1,
          bid: pin.type === 'Bid' ? item : undefined,
          milestone: pin.type === 'Milestone' ? item : undefined,
        },
      };
    } else {
      // If the pin item wasn't found, erase it and continue on.
      omnibar.value.pin = null;
      // showNext(); This is done in the "omnibar" replicant change listener
    }
  // If there is alerts in the queue to show.
  } else if (omnibar.value.alertQueue.length) {
    const alert = omnibar.value.alertQueue.shift();
    if (alert) {
      nodecg().log.debug('[Omnibar] Alert available, will show:', alert?.type);
      const { type, id, data } = alert;
      omnibar.value.current = {
        type,
        id,
        props: {
          seconds: (data?.seconds as number | undefined) || 15, // Fallback 15 seconds!
          msg: data?.msg, // Tweet, CrowdControl
          user: data?.user, // Tweet

          // MiniCredits
          players: data?.players,
          comms: data?.comms,
          reader: data?.reader,
          screeners: data?.screeners,
          tech: data?.tech,
          donators: data?.donators,
          subscribers: data?.subscribers,
          cheers: data?.cheers,
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

  // If a pin is removed, continue cycle.
  if (oldVal && oldVal.pin && !newVal.pin) {
    nodecg().log.debug('[Omnibar] Pin removed, will continue');
    showNext();
  }
});

// Listens for messages from the graphic to change to the next message.
nodecg().listenFor('omnibarShowNext', (data, ack) => {
  // If omnibar was just showing mini credits and ended successfully, erase temp storage.
  if (omnibar.value.current?.type === 'MiniCredits') {
    tempMiniCreditsStorage = { runSubs: [], runCheers: [], runDonations: [] };
  }
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

// Pushes subscriptions/cheers/donations made during the run to the respective arrays.
mq.evt.on('newScreenedSub', (data) => {
  const overriddenTypes = data as unknown as never; // TODO: Update MQ event!
  omnibar.value.miniCredits.runSubs.push(clone(overriddenTypes));
});
mq.evt.on('newScreenedCheer', (data) => {
  const overriddenTypes = data as unknown as never;
  omnibar.value.miniCredits.runCheers.push(clone(overriddenTypes));
});
mq.evt.on('donationFullyProcessed', (data) => {
  const overriddenTypes = data as unknown as never;
  omnibar.value.miniCredits.runDonations.push(clone(overriddenTypes));
});

// Pushes our "mini credits" to the alert queue.
sc.on('timerStopped', () => {
  nodecg().log.debug('[Omnibar] Timer stopped, generating mini credits');
  // If there's any credits in the queue, removes them.
  const oldCreditsIndex = omnibar.value.alertQueue.findIndex((a) => a.type === 'MiniCredits');
  if (oldCreditsIndex >= 0) omnibar.value.alertQueue.splice(oldCreditsIndex, 1);
  // If the current omnibar message is already mini credits, also remove those.
  if (omnibar.value.current?.type === 'MiniCredits') {
    showNext();
  }

  // Adds the collected subscriptions/cheers/donations in a local object.
  // These arrays will be empty if the last mini credits were ran successfully.
  tempMiniCreditsStorage.runSubs.push(...clone(omnibar.value.miniCredits.runSubs));
  tempMiniCreditsStorage.runCheers.push(...clone(omnibar.value.miniCredits.runCheers));
  tempMiniCreditsStorage.runDonations.push(...clone(omnibar.value.miniCredits.runDonations));

  // Erase the ones stored in the replicant.
  omnibar.value.miniCredits = { runSubs: [], runCheers: [], runDonations: [] };

  // Collect all information needed.
  const { runSubs, runCheers, runDonations } = tempMiniCreditsStorage;
  const run = sc.getRunDataArray().find((r) => r.id === sc.runDataActiveRun.value?.id);
  const players = run
    ? run.teams.reduce<string[]>((prev, team) => {
      prev.push(...team.players.map((p) => p.name));
      return prev;
    }, [])
    : undefined;
  const comms = commentators.value.length // Regex removes pronouns
    ? commentators.value.map((c) => c.replace(/\((.*?)\)/g, '').trim())
    : undefined;
  const reader = donationReader.value?.replace(/\((.*?)\)/g, '').trim(); // Regex removes pronouns
  const donators = runDonations.length
    ? orderBy( // Groups donation totals amounts by name and sorts descending.
      Object.entries(runDonations.reduce<{ [k: string]: number }>((prev, curr) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const current = curr as any;
        const obj = prev;
        if (!obj[current.donor_visiblename]) obj[current.donor_visiblename] = 0;
        obj[current.donor_visiblename] += Number(curr.amount);
        return obj;
      }, {})).filter(([,v]) => v > 0),
      ([,v]) => v,
      'desc',
    )
    : undefined;
  const subscribers = runSubs.length // TODO: Update MQ event, change subgifts logic!
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // ? runSubs.map((s) => (s as unknown as { [k: string]: any }).user.displayName)
    ? orderBy( // Groups subs/giftsub bombs by name, counts them and sorts descending.
      Object.entries(runSubs.reduce<{ [k: string]: number }>((prev, curr) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const current = curr as any;
        const obj = prev;
        if (!obj[current.user.displayName]) {
          obj[current.user.displayName] = 0;
        }
        obj[current.user.displayName] += 1;
        return obj;
      }, {})).filter(([,v]) => v > 0),
      ([,v]) => v,
      'desc',
    )
    : undefined;
  const cheers = runCheers.length
    ? orderBy( // Groups cheer amounts by name and sorts descending.
      Object.entries(runCheers.reduce<{ [k: string]: number }>((prev, curr) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const current = curr as any;
        const obj = prev;
        if (!obj[current.message.tags['display-name']]) {
          obj[current.message.tags['display-name']] = 0;
        }
        obj[current.message.tags['display-name']] += Number(current.message.tags.bits);
        return obj;
      }, {})).filter(([,v]) => v > 0),
      ([,v]) => v,
      'desc',
    )
    : undefined;

  // Push actual data to the queue.
  omnibar.value.alertQueue.push({
    type: 'MiniCredits',
    id: uuid(),
    data: {
      seconds: 25,
      players,
      comms,
      reader,
      screeners: config.omnibar?.miniCredits?.screeners,
      tech: config.omnibar?.miniCredits?.tech,
      donators,
      subscribers,
      cheers,
    },
  });
});
