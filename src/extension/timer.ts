import { BigbuttonPlayerMap } from '@esa-layouts/types/schemas';
import clone from 'clone';
import * as mqLogging from './util/mq-logging';
import { get as nodecg } from './util/nodecg';
import obs from './util/obs';
import { mq } from './util/rabbitmq';
import { bigbuttonPlayerMap, currentRunDelay, delayedTimer } from './util/replicants';
import { sc } from './util/speedcontrol';

const config = nodecg().bundleConfig;

// This code keeps a delayed copy of the timer synced to a delay value from external sources.
// If no delay is present (if not an online marathon), we just make a straight copy.
const timerDelayTO: { delay: number, timeout: NodeJS.Timeout }[] = [];
delayedTimer.value = clone(sc.timer.value);
currentRunDelay.on('change', (newVal, oldVal) => {
  if (newVal.video !== oldVal?.video && timerDelayTO.length) {
    // Reset delayed timer to the same as normal timer.
    delayedTimer.value = clone(sc.timer.value);

    // Clear all the irrelevant timeouts currently active.
    const timeouts: NodeJS.Timeout[] = [];
    for (let i = 0; i < timerDelayTO.length;) {
      if (timerDelayTO[i] && timerDelayTO[i].delay !== newVal.video) {
        timeouts.push(timerDelayTO.shift()?.timeout as NodeJS.Timeout);
      } else {
        i += 1;
      }
    }
    timeouts.forEach((timeout) => clearTimeout(timeout));
  }
});
sc.timer.on('change', (val) => {
  const timerFreeze = clone(val);
  if (currentRunDelay.value.video === 0) {
    delayedTimer.value = timerFreeze;
  } else {
    timerDelayTO.push({
      delay: currentRunDelay.value.video,
      timeout: setTimeout(() => {
        delayedTimer.value = {
          ...timerFreeze,
          timestamp: Date.now(),
        };
      }, currentRunDelay.value.video),
    });
  }
});

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
  let id = 0;

  // If more than 1 team, uses the big button player mapping to find out what team to stop.
  if (run && run.teams.length > 1) {
    const userTag = bigbuttonPlayerMap.value[data.button_id] as BigbuttonPlayerMap[0] | undefined;
    const teamIndex = run.teams.findIndex((t) => t.players.find((p) => userTag
      ?.find((u) => u.user.displayName.toLowerCase() === p.name.toLowerCase())));
    if (teamIndex >= 0) id = teamIndex;
    else id = -1;
  }

  if (id < 0) return;
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
          await sc.stopTimer(id);
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
