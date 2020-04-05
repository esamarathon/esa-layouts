import { Configschema } from 'configschema';
import SpeedcontrolUtil from 'speedcontrol-util';
import { get as nodecg } from './util/nodecg';
import obs from './util/obs';
import { evt } from './util/rabbitmq';

const config = (nodecg().bundleConfig as Configschema);
const sc = new SpeedcontrolUtil(nodecg());

// Controls the nodecg-speedcontrol timer when the big buttons are pressed.
evt.on('bigbuttonPressed', async (data) => {
  // Only listen to this event on stream 1.
  if (config.event.thisEvent !== 1) {
    return;
  }

  // If the button was pressed more than 10s ago, ignore it.
  if (data.time.unix < (Date.now() / 1000) - 10) {
    return;
  }

  // Stop/log warning if timestamp happens to be in the future.
  if (data.time.unix > (Date.now() / 1000) + 10) {
    nodecg().log.warn('[Timer] Big button unix timestamp in the future, this is bad!');
    return;
  }

  const run = sc.getCurrentRun();
  const buttonID = (run && run.teams.length > 1) ? data.button_id - 1 : 0;

  try {
    // Note: the nodecg-speedcontrol bundle will check if it *can* do these actions,
    // we do not need to check that here.
    switch (sc.timer.value.state) {
      case 'stopped':
      case 'paused':
        await sc.startTimer();
        break;
      case 'running':
        if (sc.timer.value.milliseconds > 10 * 1000) {
          await sc.stopTimer(buttonID);
        }
        break;
      default:
        // Don't do anything
        break;
    }
  } catch (err) {
    // Drop for now
  }
});

// Enable/disable nodecg-speedcontrol timer changes if on/not on a game layout scene.
obs.on('SwitchScenes', (data) => {
  if (data['scene-name'].includes(config.obs.names.scenes.gameLayout)) {
    sc.enableTimerChanges();
  } else {
    sc.disableTimerChanges();
  }
});
