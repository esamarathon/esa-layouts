import { Configschema } from 'configschema';
import SpeedcontrolUtil from 'speedcontrol-util';
import { get as nodecg } from './util/nodecg';
import obs from './util/obs';

const config = (nodecg().bundleConfig as Configschema);
const sc = new SpeedcontrolUtil(nodecg());
let commercialTO: NodeJS.Timeout;

function getCycleTime(): number {
  return (sc.timer.value.milliseconds > (59 * 60 * 1000) ? 15 : 20) * 60;
}

/**
 * Will attempt to play a commercial if >19 minutes is left for the run
 * and the estimate is higher than 39 minutes.
 */
async function playCommercial(): Promise<void> {
  const run = sc.getCurrentRun();
  if (!run) {
    return;
  }
  const timeLeft = run && run.estimateS
    ? (run.estimateS + 60) - (sc.timer.value.milliseconds / 1000) : 0;
  if (run.estimateS && run.estimateS > (60 * (40 - 1)) && timeLeft > (60 * 20)) {
    try {
      await sc.sendMessage('twitchStartCommercial', { duration: 60 });
      const cycleTime = getCycleTime();
      commercialTO = setTimeout(playCommercial, 1000 * cycleTime);
      nodecg().log.info('[Commercial] Triggered, will check again'
        + ` in ${Math.floor(cycleTime / 60)} minutes`);
    } catch (err) {
      nodecg().log.warn('[Commercial] Could not successfully be triggered');
      nodecg().log.debug('[Commercial] Could not successfully be triggered:', err);
    }
  } else {
    nodecg().log.info('[Commercial] Does not need to be triggered,'
      + ' will not check again for this run');
  }
}

sc.on('timerStarted', () => {
  clearTimeout(commercialTO);
  nodecg().log.info('[Commercial] Will check if we can trigger in 20 minutes');
  commercialTO = setTimeout(playCommercial, 1000 * 60 * 20);
});

sc.on('timerStopped', () => {
  clearTimeout(commercialTO);
});

sc.on('timerReset', () => {
  clearTimeout(commercialTO);
});

// Trigger a Twitch commercial when on the relevant scene.
obs.on('SwitchScenes', async (data) => {
  if (data['scene-name'] === config.obs.names.scenes.commercials) {
    try {
      await sc.sendMessage('twitchStartCommercial', { duration: 180 });
      nodecg().log.info('[Commercial] Triggered on change to relevant scene');
    } catch (err) {
      nodecg().log.warn('[Commercial] Could not successfully be triggered');
      nodecg().log.debug('[Commercial] Could not successfully be triggered:', err);
    }
  }
});

// If the timer has been recovered on start up,
// need to make sure the commercial checking is going to run.
if (sc.timer.value.state === 'running') {
  const run = sc.getCurrentRun();
  if (run) {
    const cycleTime = (sc.timer.value.milliseconds / 1000) % getCycleTime();
    const timeLeft = (getCycleTime() - cycleTime);
    nodecg().log.info('[Commercial] Will check if we can trigger in'
      + ` ~${Math.round(timeLeft / 60)} minutes`);
    commercialTO = setTimeout(playCommercial, 1000 * timeLeft);
  }
}
