import { player, startPlaylist } from './intermission-player';
import companion from './util/companion';
import { wait } from './util/helpers';
import { get as nodecg } from './util/nodecg';
import obs, { canChangeScene, changeScene } from './util/obs';
import { assetsVideos, obsData, streamDeckData, videoPlayer } from './util/replicants';
import { sc } from './util/speedcontrol';

const config = nodecg().bundleConfig;

// Replicants only applicable to this file from another bundle.
const twitchCommercialsDisabled = nodecg().Replicant<boolean>('disabled', 'esa-commercials');

// Sending replicant data on any changes.
sc.timer.on('change', (value) => companion.send({ name: 'timer', value }));
sc.timerChangesDisabled.on('change', (value) => (
  companion.send({ name: 'timerChangesDisabled', value })));
streamDeckData.on('change', (value) => companion.send({ name: 'streamDeckData', value }));
sc.twitchCommercialTimer.on('change', (value) => (
  companion.send({ name: 'twitchCommercialTimer', value })));
twitchCommercialsDisabled.on('change', (value) => (
  companion.send({ name: 'twitchCommercialsDisabled', value })));
obsData.on('change', (value) => (
  companion.send({ name: 'obsData', value: { ...value, gameLayoutScreenshot: undefined } })));
assetsVideos.on('change', (value) => companion.send({ name: 'videos', value }));

// Sending things on connection.
companion.evt.on('open', (socket) => {
  companion.send({ name: 'timer', value: sc.timer.value }, socket);
  companion.send({ name: 'timerChangesDisabled', value: sc.timerChangesDisabled.value }, socket);
  companion.send({ name: 'streamDeckData', value: streamDeckData.value });
  companion.send({ name: 'twitchCommercialTimer', value: sc.twitchCommercialTimer.value });
  companion.send({ name: 'twitchCommercialsDisabled', value: twitchCommercialsDisabled.value });
  companion.send({ name: 'obsData', value: { ...obsData.value, gameLayoutScreenshot: undefined } });
  companion.send({ name: 'cfgScenes', value: nodecg().bundleConfig.obs.names.scenes });
  companion.send({ name: 'videos', value: assetsVideos.value });
});

// Listening for any actions triggered from Companion.
let videoPlayPressedRecently = false;
companion.evt.on('action', async (name, value) => {
  // Controls the nodecg-speedcontrol timer.
  // Currently the "Stop Timer" state works if there's only 1 team.
  // TODO: Add team support.
  if (name === 'timer_toggle') {
    try {
      // Note: the nodecg-speedcontrol bundle will check if it *can* do these actions,
      // we do not need to check that here.
      switch (sc.timer.value.state) {
        case 'stopped':
        case 'paused':
          await sc.startTimer();
          break;
        case 'running':
          await sc.stopTimer();
          break;
        case 'finished':
          await sc.resetTimer();
          break;
        default:
          // Don't do anything
          break;
      }
    } catch (err) {
      // Drop for now
    }
  // Used to toggle the "Player HUD Trigger" type.
  } else if (name === 'player_hud_trigger_toggle') {
    const val = value as string;
    if (streamDeckData.value.playerHUDTriggerType === val) {
      delete streamDeckData.value.playerHUDTriggerType;
    } else {
      streamDeckData.value.playerHUDTriggerType = val;
    }
  // Used to disable the Twitch commercials for the remainder of a run.
  } else if (name === 'twitch_commercials_disable') {
    if (!twitchCommercialsDisabled.value
    && !['stopped', 'finished'].includes(sc.timer.value.state)) {
      // Sends a message to the esa-commercials bundle.
      // Because we are using server-to-server messages, no confirmation yet.
      nodecg().sendMessageToBundle('disable', 'esa-commercials');
    }
  // Used to cycle scenes if applicable, usually used by hosts.
  // Some of this is copied from obs-data.ts
  } else if (name === 'scene_cycle') {
    const { disableTransitioning, transitioning, connected } = obsData.value;
    const { scenes } = config.obs.names;
    // If transitioning is disabled, or we *are* transitioning, and OBS is connected,
    // and the timer is not running or paused, we can trigger these actions.
    if (!disableTransitioning && !transitioning && connected
    && !['running', 'paused'].includes(sc.timer.value.state)) {
      // If the current scene is any of the applicable intermission ones, the next scene
      // will be the game layout, so change to it.
      if (obs.isCurrentScene(scenes.commercials)
      || obs.isCurrentScene(scenes.intermission)
      || obs.isCurrentScene(scenes.intermissionCrowd)) {
        await changeScene({ scene: config.obs.names.scenes.gameLayout });
      // If the current scene is the game layout, the next scene will be the intermission,
      // so change to it.
      } else if (obs.isCurrentScene(scenes.gameLayout)) {
        // If the commercial intermission scene exists, use that, if not, use the regular one.
        if (obs.findScene(scenes.commercials)) {
          await changeScene({ scene: scenes.commercials });
        } else {
          await changeScene({ scene: scenes.intermission });
        }
      }
    }
  // Used to change between intermission scenes using a supplied scene name config key.
  } else if (name === 'intermission_scene_change') {
    const { scenes } = config.obs.names;
    const val = value as string;
    const scene = (scenes as { [k: string]: string })[val];
    await changeScene({ scene, force: true });
  // Used to play back a single video in the "Intermission Player" scene,
  // intended to be used by hosts.
  } else if (name === 'video_play') {
    if (!videoPlayPressedRecently && !videoPlayer.value.playing
    && canChangeScene({ scene: config.obs.names.scenes.intermissionPlayer, force: true })) {
      videoPlayPressedRecently = true;
      setTimeout(() => { videoPlayPressedRecently = false; }, 1000);
      const val = value as string;
      nodecg().log.debug('[Companion] Message received to play video (sum: %s)', val);
      const videos = assetsVideos.value.filter((v) => v.sum === val);
      if (videos.length > 1) {
        // VIDEO WAS FOUND TWICE, MAKES NO SENSE!
        nodecg().log.debug('[Companion] Multiple videos with the same sum found!');
      } else if (!videos.length) {
        // VIDEO WAS NOT FOUND
        nodecg().log.debug('[Companion] No videos found with that sum!');
      } else {
        nodecg().log.debug('[Companion] Video found matching sum: %s', videos[0].name);
        videoPlayer.value.playlist = [
          {
            sum: videos[0].sum,
            length: 0,
            commercial: false,
          },
        ];
        wait(500); // Safety wait
        await startPlaylist();
      }
    }
  } else if (name === 'video_stop') {
    await player.endPlaylistEarly();
  }
});
