import type { Configschema } from '@esa-layouts/types/schemas/configschema';
import AudioNormaliser from '@shared/extension/audio-normaliser';
import type { RunData } from 'speedcontrol-util/types';
import { formatSrcomPronouns, getOtherStreamEventShort } from './util/helpers';
import * as mqLogging from './util/mq-logging';
import { get as nodecg } from './util/nodecg';
import obs from './util/obs';
import { mq } from './util/rabbitmq';
import { bigbuttonPlayerMap, commentators, donationReader, otherStreamData, serverTimestamp, upcomingRunID } from './util/replicants';
import { sc } from './util/speedcontrol';

const config = (nodecg().bundleConfig as Configschema);
new AudioNormaliser(nodecg()); // eslint-disable-line no-new

// Increase max listeners on the nodecg-speedcontrol timer a bit to stop errors.
// This may want to be moved to that bundle directly in the future? It impacts all bundles!
sc.timer.setMaxListeners(20);

serverTimestamp.value = Date.now();
setInterval(() => { serverTimestamp.value = Date.now(); }, 100);

// Screened data from our moderation tool.
mq.evt.on('newScreenedSub', (data) => {
  nodecg().log.debug('[Misc] Received new subscription');
  nodecg().sendMessage('newSub', data);
});
mq.evt.on('newScreenedCheer', (data) => {
  nodecg().log.debug('[Misc] Received new cheer');
  nodecg().sendMessage('newCheer', data);
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

let init = false;
sc.runDataActiveRun.on('change', (newVal, oldVal) => {
  // Do some stuff when the run changes and not on the game layout scene (if OBS is connected).
  if (oldVal?.id !== newVal?.id
  && ((!obs.connected && init)
  || (obs.connected && !obs.isCurrentScene(config.obs.names.scenes.gameLayout)))) {
    // Only trigger these changes if the new run has a scheduled time, which means it was
    // imported from an external schedule. This stops manually added runs (like bonus runs)
    // Having things erased.
    if (sc.runDataActiveRun.value && newVal && newVal.scheduled) {
      commentators.value.length = 0;
      // If not online, we also clear the teams and big button player map.
      if (!config.event.online) {
        bigbuttonPlayerMap.value = {};
        // TODO: Reselecting the current run would overwrite these, but not much I can do right now!
        sc.runDataActiveRun.value.teams = [];
        nodecg().log.debug('[Misc] Removed active run teams on run change');
      }
      nodecg().log.debug('[Misc] Cleared commentators and big button player mapping');
    }
  }

  // This will also be triggered on server start up.
  mqLogging.logRunChange(newVal);

  init = true;
});

// Update replicant that stores the ID of the upcoming run,
// both on timer stopping, if you somehow have no current run
// (usually if you're at the start of the run list),
// and also via a "force" button on the dashboard.
sc.on('timerStopped', () => {
  upcomingRunID.value = sc.runDataActiveRunSurrounding.value.next || null;
});
sc.runDataActiveRunSurrounding.on('change', (newVal) => {
  if (!newVal.current) {
    upcomingRunID.value = newVal.next || null;
  }
});
nodecg().listenFor('forceUpcomingRun', (id?: string) => {
  // Check supplied run ID exists in our array.
  const run = sc.runDataArray.value.find((r) => r.id === id);
  upcomingRunID.value = run?.id || null;
});

// Helper function to get pronouns of a specified user name from speedrun.com
// eslint-disable-next-line import/prefer-default-export
export async function searchSrcomPronouns(val: string): Promise<string> {
  const name = val.replace(/\((.*?)\)/g, '').trim();
  let pronouns = (val.match(/\((.*?)\)/g) || [])[0]?.replace(/[()]/g, '');
  if (!pronouns) {
    const data = await sc.sendMessage('srcomSearchForUserDataMultiple', [
      { type: 'twitch', val: name },
      { type: 'name', val: name },
    ]);
    pronouns = formatSrcomPronouns(data?.pronouns || '') || '';
  }
  return pronouns ? `${name} (${pronouns})` : name;
}

// Processes adding commentators from the dashboard panel.
nodecg().listenFor('commentatorAdd', async (val: string | null | undefined, ack) => {
  if (val) {
    const str = await searchSrcomPronouns(val);
    if (!commentators.value.includes(str)) {
      commentators.value.push(str);
    }
  }
  if (ack && !ack.handled) {
    ack(null);
  }
});

// Processes modifying the reader from the dasboard panel.
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
