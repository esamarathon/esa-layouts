import { VideoPlayer } from '@esa-layouts/types/schemas';
import type { Configschema } from '@esa-layouts/types/schemas/configschema';
import Player from '@shared/extension/video-player';
import { Asset } from '@shared/types';
import { TwitchCommercialTimer } from 'speedcontrol-util/types/speedcontrol/schemas';
import { v4 as uuid } from 'uuid';
import { logError } from './util/helpers';
import * as mqLogging from './util/mq-logging';
import { get as nodecg } from './util/nodecg';
import obs, { changeScene } from './util/obs';
import { assetsVideos, obsData, videoPlayer } from './util/replicants';
import { sc } from './util/speedcontrol';

const config = (nodecg().bundleConfig as Configschema);
const player = new Player(config.obs, obs);

// Reset replicant values on startup.
videoPlayer.value.playing = false;
videoPlayer.value.current = null;

// Helper function that returns a promise once commercials have ended.
async function waitForCommercialEnd(): Promise<void> {
  // If we're not on the normal intermission scene when we should be, switch to it!
  if (sc.twitchCommercialTimer.value.secondsRemaining > 2) {
    await changeScene({ scene: config.obs.names.scenes.intermission, force: true });
  }
  return new Promise((res, rej) => {
    if (sc.twitchCommercialTimer.value.secondsRemaining <= 0) res();
    else {
      const func = (val: TwitchCommercialTimer) => {
        if (!videoPlayer.value.playing) rej();
        if (val.secondsRemaining <= 0) {
          res();
          sc.twitchCommercialTimer.removeListener('change', func);
        }
      };
      sc.twitchCommercialTimer.on('change', func);
    }
  });
}

// Converts our current playlist to shared format.
function generatePlaylist(): { id: string, video?: Asset, commercial: number }[] {
  return videoPlayer.value.playlist.map(({ sum, commercial }) => ({
    id: uuid(),
    video: assetsVideos.value.find((v) => v.sum === sum),
    commercial,
  }));
}

// eslint-disable-next-line import/prefer-default-export
export async function startPlaylist(): Promise<void> {
  try {
    const playlist = generatePlaylist();
    player.loadPlaylist(playlist);
    videoPlayer.value.playing = true;
    // Switch to correct scene depending on if first element has a video or not.
    if (playlist[0].video) {
      await changeScene({ scene: config.obs.names.scenes.intermissionPlayer });
    } else {
      // Does not work if first element is not a video and we're already on the
      // intermission player scene, but waitForCommercialEnd handles that.
      await changeScene({ scene: config.obs.names.scenes.intermission });
    }
    obsData.value.disableTransitioning = true;
    await player.playNext();
    // Calculates when this playlist should end.
    videoPlayer.value.estimatedFinishTimestamp = Date.now()
      + (await player.calculatePlaylistLength() * 1000);
  } catch (err) {
    logError('[Intermission Player] Could not be started', err);
    // Return to the intermission scene if there was an issue starting the playlist.
    await new Promise((res) => { setTimeout(res, 5000); });
    // TODO: Should this be commercials scene if available?
    await changeScene({ scene: config.obs.names.scenes.intermission });
  }
}

// Set the upcoming intermission videos.
// TODO: Improve this? (it's very hard to read, but works!)
sc.on('timerStopped', () => {
  const run = sc.getCurrentRun();
  if (run?.customData.intermission) {
    // Creates a compiled list of what videos should be played and
    // where commercials should be played if needed.
    const splitList = run.customData.intermission.split(',').filter(Boolean);
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
        if (asset || commercial) {
          prev.push({ sum: asset?.sum, commercial });
        } else if (!asset) {
          nodecg().log.warn(
            '[Intermission Player] Asset named "%s" was not found, so skipping in playlist',
            name,
          );
        }
        return prev;
      },
      [],
    );
    nodecg().log.info('[Intermission Player] Automatically set playlist from run data');
  }
});

// RabbitMQ logging thing.
// TODO: Should this be moved?
videoPlayer.on('change', (newVal, oldVal) => {
  if (newVal.current && newVal.current !== oldVal?.current) {
    mqLogging.logVideoPlay(newVal.current);
  }
});

// Used if a user manually switches to the intermission player scene in OBS.
obs.conn.on('TransitionBegin', (data) => {
  if (obs.findScene(config.obs.names.scenes.intermissionPlayer) === data['to-scene']
  && !videoPlayer.value.playing) {
    startPlaylist();
  }
});

// Triggered from the intermission player control to stop early.
nodecg().listenFor('stopIntermissionPlayerEarly', () => {
  player.endPlaylistEarly();
});

player.on('videoStarted', async (item) => {
  videoPlayer.value.current = item.video?.sum || null;
  // Change to intermission player scene if needed and not done already.
  if (item.video) {
    await changeScene({ scene: config.obs.names.scenes.intermissionPlayer, force: true });
  } else {
    await changeScene({ scene: config.obs.names.scenes.intermission, force: true });
  }
});

player.on('videoEnded', async (item) => {
  // Update video play count.
  if (item.video) {
    if (!videoPlayer.value.plays[item.video.sum]) {
      videoPlayer.value.plays[item.video.sum] = 1;
    } else {
      videoPlayer.value.plays[item.video.sum] += 1;
    }
  }
  // Double wrapped try/catch here so if player is stopped
  // during commercials, code stops and does not continue.
  try {
    if (item.commercial) await waitForCommercialEnd();
    try {
      await player.playNext();
    } catch (err) {
      logError('[Intermission Player] Could not play next video', err);
      player.endPlaylistEarly();
    }
  } catch (err) { /* do nothing */ }
});

player.on('playlistEnded', async (early) => {
  videoPlayer.value.playing = false;
  videoPlayer.value.current = null;
  if (!early) videoPlayer.value.playlist.length = 0;
  videoPlayer.value.estimatedFinishTimestamp = 0;
  obsData.value.disableTransitioning = false;
  // Simple server-to-server message we need; currently used for esa-commercials only.
  if (!early) nodecg().sendMessage('intermissionPlayerFinished');
  await changeScene({ scene: config.obs.names.scenes.intermission, force: true });
});

player.on('playCommercial', async (item) => {
  try {
    await sc.sendMessage('twitchStartCommercial', { duration: item.commercial });
  } catch (err) { /* catch */ }
});
