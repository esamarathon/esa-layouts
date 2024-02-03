import { Timer } from 'speedcontrol-util/types';
import WebSocket from 'ws';
import companion from './util/companion';
import { sc } from './util/speedcontrol';

/**
 * Helper function to send over updated nodecg-speedcontrol timer data.
 */
function sendTimerData({ data, socket }: { data?: Timer, socket?: WebSocket }) {
  companion.send({
    name: 'timer',
    value: data || sc.timer.value,
  }, socket);
}

// Sending replicant data on any changes.
sc.timer.on('change', (data) => sendTimerData({ data }));

// Sending things on connection.
companion.evt.on('open', (socket) => {
  sendTimerData({ socket });
});

// Listening for any actions triggered from Companion.
companion.evt.on('action', async (name) => {
  // Controls the nodecg-speedcontrol timer when the action is called.
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
  }
});
