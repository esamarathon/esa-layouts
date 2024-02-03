import companion from './util/companion';
import { streamDeckData } from './util/replicants';
import { sc } from './util/speedcontrol';

// Sending replicant data on any changes.
sc.timer.on('change', (value) => companion.send({ name: 'timer', value }));
sc.timerChangesDisabled.on('change', (value) => (
  companion.send({ name: 'timerChangesDisabled', value })));
streamDeckData.on('change', (value) => companion.send({ name: 'streamDeckData', value }));

// Sending things on connection.
companion.evt.on('open', (socket) => {
  companion.send({ name: 'timer', value: sc.timer.value }, socket);
  companion.send({ name: 'timerChangesDisabled', value: sc.timerChangesDisabled.value }, socket);
  companion.send({ name: 'streamDeckData', value: streamDeckData.value });
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
  }
});
