import { VideoPlayer } from '@esa-layouts/types/schemas';
import type { Configschema } from '@esa-layouts/types/schemas/configschema';
import SpeedcontrolUtil from 'speedcontrol-util';
import type { RunData } from 'speedcontrol-util/types';
import { changeScene } from './layouts';
import { formatPronouns, getCurrentEventShort, getOtherStreamEventShort } from './util/helpers';
import { logRunChange, logVideoPlay } from './util/logging';
import { get as nodecg } from './util/nodecg';
import obs from './util/obs';
import { mq } from './util/rabbitmq';
import { assetsVideos, commentators, donationReader, obsData, otherStreamData, videoPlayer } from './util/replicants';

const config = (nodecg().bundleConfig as Configschema);
const sc = new SpeedcontrolUtil(nodecg());

let ranAdLastTime = false;
setInterval(async () => {
  if (ranAdLastTime) {
    ranAdLastTime = false;
    return;
  }
  const today = new Date();
  const currentMinute = today.getMinutes();
  const run = sc.getCurrentRun();
  if (run && run.externalID && run.externalID === 'BTRLDOOM'
  && [15, 30, 45, 0].includes(currentMinute)) {
    try {
      await sc.sendMessage('twitchStartCommercial', { duration: 60 });
      ranAdLastTime = true;
      nodecg().log.info('[Misc] Triggered commercial for BTRLDOOM');
    } catch (err) {
      nodecg().log.warn('[Misc] Could not successfully trigger commercial for BTRLDOOM');
      nodecg().log.debug('[Misc] Could not successfully trigger commercial for BTRLDOOM:', err);
    }
  }
}, 60 * 1000);

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
  if (getCurrentEventShort() === data.flagcarrier.group) {
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
  logRunChange(newVal);

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

// Set the upcoming intermission video.
sc.on('timerStopped', () => {
  const run = sc.getCurrentRun();
  if (run?.customData.intermission) {
    // Creates a compiled list of what videos should be played and
    // where commercials should be played if needed.
    const splitList = run.customData.intermission.split(',');
    const formattedList: { name?: string, commercial: number }[] = [];
    for (let i = 0; i < splitList.length;) {
      if (splitList[i].startsWith('ad')) {
        const replaceStr = splitList[i].startsWith('adwait') ? 'adwait' : 'ad';
        const commercial = Number(splitList[i].replace(replaceStr, ''));
        if (commercial) {
          let name: string | undefined;
          if (!splitList[i].startsWith('adwait')) {
            name = splitList[i + 1];
            i += 2;
          } else {
            i += 1;
          }
          formattedList.push({ name, commercial });
        }
      } else {
        formattedList.push({ name: splitList[i], commercial: 0 });
        i += 1;
      }
    }

    // This filters out any items that have no asset *and* no commercial, which are useless.
    videoPlayer.value.playlist = formattedList.reduce<VideoPlayer['playlist']>(
      (prev, { name, commercial }) => {
        const asset = assetsVideos.value.find((v) => v.name === name?.trim());
        if (asset || commercial) prev.push({ sum: asset?.sum, commercial });
        return prev;
      },
      [],
    );

    nodecg().log.info('[Misc] Automatically set video player playlist from run data');
  }
});

nodecg().listenFor('videoPlayerStartCommercial', async (duration: number) => {
  try {
    await sc.sendMessage('twitchStartCommercial', { duration });
  } catch (err) {
    nodecg().log.warn('[Misc] Could not successfully trigger video player commercials');
    nodecg().log.debug('[Misc] Could not successfully trigger video player commercials:', err);
  }
});

// Switch back to the last scene when the video player finishes.
nodecg().listenFor('videoPlayerFinished', async () => {
  try {
    await changeScene(config.obs.names.scenes.intermission);
  } catch (err) {
    nodecg().log.warn('[Misc] Could not return to intermission after videos finished');
    nodecg().log.debug('[Misc] Could not return to intermission after videos finished:', err);
  }
});

videoPlayer.on('change', (newVal, oldVal) => {
  if (newVal.current && newVal.current !== oldVal?.current) {
    logVideoPlay(newVal.current);
  }
  if (!newVal.playing && oldVal?.playing) {
    obsData.value.disableTransitioning = false;
  }
});
