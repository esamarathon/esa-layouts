import type { Configschema } from '@esa-layouts/types/schemas/configschema';
import type { RunData } from 'speedcontrol-util/types';
import { formatPronouns, getOtherStreamEventShort } from './util/helpers';
import * as mqLogging from './util/mq-logging';
import { get as nodecg } from './util/nodecg';
import obs from './util/obs';
import { mq } from './util/rabbitmq';
import { commentators, donationReader, otherStreamData } from './util/replicants';
import { sc } from './util/speedcontrol';

const config = (nodecg().bundleConfig as Configschema);

// Screened data from our moderation tool.
mq.evt.on('newScreenedSub', (data) => {
  nodecg().log.debug('[Misc] Received new subscription');
  nodecg().sendMessage('newSub', data);
});
mq.evt.on('newScreenedTweet', (data) => {
  nodecg().log.debug('[Misc] Received new tweet');
  nodecg().sendMessage('newTweet', data);
});
mq.evt.on('newScreenedCheer', (data) => {
  nodecg().log.debug('[Misc] Received new cheer');
  nodecg().sendMessage('newCheer', data);
});
mq.evt.on('newScreenedCrowdControl', (data) => {
  if (config.event.thisEvent === 1) {
    nodecg().log.debug('[Misc] Received new crowd control message');
    nodecg().sendMessage('newCrowdControl', data);
  }
});

// Information that should come from our 2nd stream.
mq.evt.on('runChanged', (data) => {
  if (getOtherStreamEventShort() === data.event) {
    otherStreamData.value.runData = (data.run as RunData | undefined) || null;
    nodecg().log.debug('[Misc] Received modified run data from other stream');
  }
});
mq.evt.on('gameSceneChanged', (data) => {
  if (getOtherStreamEventShort() === data.event) {
    nodecg().log.debug('[Misc] Received game scene change from other stream:', data.action);
    if (data.action === 'start') {
      otherStreamData.value.show = true;
    } else if (data.action === 'end') {
      otherStreamData.value.show = false;
    }
  }
});

// When someone scans in on one of the big timer buttons.
// Currently only used for commentators.
mq.evt.on('bigbuttonTagScanned', (data) => {
  if (data.flagcarrier.group === 'stream1') {
    const name = data.user.displayName;
    nodecg().sendMessage('bigbuttonTagScanned', data);
    if (!commentators.value.includes(name)) {
      commentators.value.push(name);
      nodecg().log.debug('[Misc] Added new commentator:', name);
    }
  }
});

let init = false;
sc.runDataActiveRun.on('change', (newVal, oldVal) => {
  // Reset the commentators when the run changes and
  // not on the game layout scene (if OBS is connected).
  if (oldVal?.id !== newVal?.id && ((!obs.connected && init) || (obs.connected
    && !obs.isCurrentScene(config.obs.names.scenes.gameLayout)))) {
    commentators.value.length = 0;
    nodecg().log.debug('[Misc] Cleared commentators');
  }

  // This will also be triggered on server start up.
  mqLogging.logRunChange(newVal);

  init = true;
});

async function searchSrcomPronouns(val: string): Promise<string> {
  const name = val.replace(/\((.*?)\)/g, '').trim();
  let pronouns = (val.match(/\((.*?)\)/g) || [])[0]?.replace(/[()]/g, '');
  if (!pronouns) {
    const data = await sc.sendMessage('srcomSearchForUserDataMultiple', [
      { type: 'twitch', val: name },
      { type: 'name', val: name },
    ]);
    pronouns = formatPronouns(data?.pronouns || '') || '';
  }
  return pronouns ? `${name} (${pronouns})` : name;
}

nodecg().listenFor('commentatorAdd', async (val: string | null | undefined, ack) => {
  if (val && !commentators.value.includes(val)) {
    commentators.value.push(await searchSrcomPronouns(val));
  }
  if (ack && !ack.handled) {
    ack(null);
  }
});

nodecg().listenFor('readerModify', async (val: string | null | undefined, ack) => {
  if (!val) {
    donationReader.value = null;
  } else {
    donationReader.value = await searchSrcomPronouns(val);
  }
  if (ack && !ack.handled) {
    ack(null);
  }
});
