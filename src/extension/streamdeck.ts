import * as nodecgApiContext from './util/nodecg-api-context';
import streamdeckUtil from 'streamdeck-util';
import obs from './util/obs';

const nodecg = nodecgApiContext.get();
let initDone = false;
const sd = new streamdeckUtil({
  key: nodecg.bundleConfig.streamdeck.key,
  port: nodecg.bundleConfig.streamdeck.port,
  debug: nodecg.bundleConfig.streamdeck.debug,
});

sd.on('init', () => {
  if (!initDone) { init(); }
  initDone = true;

  // com.esamarathon.streamdeck.timer
  // Set default text on buttons.
  const timerButtons = sd.findButtonsWithAction('com.esamarathon.streamdeck.timer');
  timerButtons.forEach((button) => {
    sd.updateButtonText(button.context, 'Start\nTimer');
  });
});

function init() {
  // com.esamarathon.streamdeck.timer
  // Controls the text on the buttons.
  const timer = nodecg.Replicant<any>('timer', 'nodecg-speedcontrol');
  timer.on('change', (newVal: any, oldVal: any) => {
    const buttons = sd.findButtonsWithAction('com.esamarathon.streamdeck.timer');
    buttons.forEach((button) => {
      switch (newVal.state) {
        case 'stopped':
          sd.updateButtonText(button.context, 'Start\nTimer');
          break;
        case 'running':
          sd.updateButtonText(button.context, 'Stop\nTimer');
          break;
        case 'paused':
          sd.updateButtonText(button.context, 'Resume\nTimer');
          break;
        case 'finished':
          sd.updateButtonText(button.context, 'Reset\nTimer');
          break;
      }
    });
  });

  sd.on('keyUp', (data: any) => {
    // com.esamarathon.streamdeck.timer
    // Controls the nodecg-speedcontrol timer when the button is pressed.
    // USES "UNSUPPORTED" API STUFF, NEEDS CHANGING IN FUTURE.
    // The "@ts-ignore" lines need removing when NodeCG is updated.
    if (data.action === 'com.esamarathon.streamdeck.timer') {
      switch (timer.value.state) {
        case 'stopped':
        case 'paused':
          // @ts-ignore
          nodecg.sendMessageToBundle('startTime', 'nodecg-speedcontrol');
          break;
        case 'running':
          // @ts-ignore
          nodecg.sendMessageToBundle('finishTime', 'nodecg-speedcontrol');
          break;
        case 'finished':
          // @ts-ignore
          nodecg.sendMessageToBundle('resetTime', 'nodecg-speedcontrol');
          break;
      }
    }
  });
}
