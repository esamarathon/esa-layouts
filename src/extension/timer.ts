import type { Configschema } from '@esa-layouts/types/schemas/configschema';
import * as mqLogging from './util/mq-logging';
import { get as nodecg } from './util/nodecg';
import obs from './util/obs';
import { mq } from './util/rabbitmq';
import { sc } from './util/speedcontrol';

const config = nodecg().bundleConfig as Configschema;

// Controls the nodecg-speedcontrol timer when the big buttons are pressed.
mq.evt.on('bigbuttonPressed', async (data) => {
  // Only listen to this event on stream 1.
  if (config.event.thisEvent !== 1) return;

  // If the button was pressed more than 10s ago, ignore it.
  if (data.time.unix < (Date.now() / 1000) - 10) return;

  // Stop/log warning if timestamp happens to be in the future.
  if (data.time.unix > (Date.now() / 1000) + 10) {
    nodecg().log.warn('[Timer] Big button unix timestamp is in the future, this is bad!');
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
        // Only allow stop command to work if timer is more than 10s.
        if (sc.timer.value.milliseconds > 10 * 1000) {
          await sc.stopTimer(buttonID);
        }
        break;
      default:
        break;
    }
  } catch (err) {
    nodecg().log.debug('[Timer] Error changing timer state on bigbuttonPressed event:', err);
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
// TODO: This may be changed!
sc.on('timerStarted', () => mqLogging.logTimerChange('started'));
sc.on('timerPaused', () => mqLogging.logTimerChange('paused'));
sc.on('timerResumed', () => mqLogging.logTimerChange('resumed'));
sc.on('timerStopped', () => mqLogging.logTimerChange('finished'));
sc.on('timerReset', () => mqLogging.logTimerChange('reset'));
sc.on('timerEdited', () => mqLogging.logTimerChange('edited'));
sc.on('timerTeamStopped', (id) => mqLogging.logTimerChange('team_finished', id));
sc.on('timerTeamUndone', (id) => mqLogging.logTimerChange('team_undid_finish', id));
