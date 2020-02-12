import SpeedcontrolUtil from 'speedcontrol-util';
import { get as nodecg } from './util/nodecg';

const sc = new SpeedcontrolUtil(nodecg());
let commercialTO: NodeJS.Timeout;

/**
 * Will attempt to play a commercial if >19 minutes is left for the run
 * and the estimate is higher than 39 minutes.
 */
function playCommercial(): void {
  const run = sc.getCurrentRun();
  if (!run) {
    return;
  }
  const timeLeft = run && run.estimateS
    ? (run.estimateS + 60) - (sc.timer.value.milliseconds / 1000) : 0;
  if (run.estimateS && run.estimateS > (60 * (40 - 1)) && timeLeft > (60 * 20)) {
    sc.sendMessage('twitchStartCommercial', { duration: 60 });
    commercialTO = setTimeout(playCommercial, 1000 * 60 * 20);
    nodecg().log.info('[Commercial] Triggered, will check again in 20 minutes');
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

// If the timer has been recovered on start up,
// need to make sure the commercial checking is going to run.
if (sc.timer.value.state === 'running') {
  const run = sc.getCurrentRun();
  if (run) {
    const cycleTime = (sc.timer.value.milliseconds / 1000) % (60 * 20);
    const timeLeft = ((60 * 20) - cycleTime);
    nodecg().log.info('[Commercial] Will check if we can trigger in'
      + ` ~${Math.round(timeLeft / 60)} minutes`);
    commercialTO = setTimeout(playCommercial, 1000 * timeLeft);
  }
}
