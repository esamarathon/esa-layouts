import type { Configschema } from '@esa-layouts/types/schemas/configschema';
import SpeedcontrolUtil from 'speedcontrol-util';
import { logTimerChange } from './util/logging';
import { get as nodecg } from './util/nodecg';
import obs from './util/obs';
import { mq } from './util/rabbitmq';

const config = nodecg().bundleConfig as Configschema;
const sc = new SpeedcontrolUtil(nodecg());

// Controls the nodecg-speedcontrol timer when the big buttons are pressed.
mq.evt.on('bigbuttonPressed', async (data) => {
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
obs.on('currentSceneChanged', (current) => {
  if (current) {
    if (obs.isCurrentScene(config.obs.names.scenes.gameLayout)) {
      sc.enableTimerChanges();
    } else {
      sc.disableTimerChanges();
    }
  }
});

// Logs changes to the timer using helper function in logging.ts
sc.on('timerStarted', () => logTimerChange('started'));
sc.on('timerPaused', () => logTimerChange('paused'));
sc.on('timerResumed', () => logTimerChange('resumed'));
sc.on('timerStopped', () => logTimerChange('finished'));
sc.on('timerReset', () => logTimerChange('reset'));
sc.on('timerEdited', () => logTimerChange('edited'));
sc.on('timerTeamStopped', (id) => logTimerChange('team_finished', id));
sc.on('timerTeamUndone', (id) => logTimerChange('team_undid_finish', id));
