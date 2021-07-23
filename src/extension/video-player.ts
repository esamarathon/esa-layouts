import { VideoPlayer } from '@esa-layouts/types/schemas';
import type { Configschema } from '@esa-layouts/types/schemas/configschema';
import SpeedcontrolUtil from 'speedcontrol-util';
import { changeScene } from './layouts';
import { logVideoPlay } from './util/logging';
import { get as nodecg } from './util/nodecg';
import { assetsVideos, obsData, videoPlayer } from './util/replicants';

const config = (nodecg().bundleConfig as Configschema);
const sc = new SpeedcontrolUtil(nodecg());

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

    nodecg().log.info('[Video Player] Automatically set video player playlist from run data');
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
