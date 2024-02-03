import companion from './util/companion';
import { get as nodecg } from './util/nodecg';
import { streamDeckData } from './util/replicants';
import { sc } from './util/speedcontrol';

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

// Sending things on connection.
companion.evt.on('open', (socket) => {
  companion.send({ name: 'timer', value: sc.timer.value }, socket);
  companion.send({ name: 'timerChangesDisabled', value: sc.timerChangesDisabled.value }, socket);
  companion.send({ name: 'streamDeckData', value: streamDeckData.value });
  companion.send({ name: 'twitchCommercialTimer', value: sc.twitchCommercialTimer.value });
  companion.send({ name: 'twitchCommercialsDisabled', value: twitchCommercialsDisabled.value });
});

// Listening for any actions triggered from Companion.
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
  }
});
