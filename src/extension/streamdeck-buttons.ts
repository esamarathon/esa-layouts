import * as nodecgApiContext from './util/nodecg-api-context';
import streamdeck from './util/streamdeck';
import obs from './util/obs';

const nodecg = nodecgApiContext.get();
let initDone = false;

streamdeck.on('init', () => {
  if (!initDone) { init(); }
  initDone = true;

  // com.esamarathon.streamdeck.timer
  // Set default text on buttons.
  const timerButtons = streamdeck.findButtonsWithAction('com.esamarathon.streamdeck.timer');
  timerButtons.forEach((button) => {
    streamdeck.updateButtonText(button.context, 'Start\nTimer');
  });
  const adButtons = streamdeck.findButtonsWithAction('com.esamarathon.streamdeck.twitchads');
  adButtons.forEach((button) => {
    streamdeck.updateButtonText(button.context, 'STEP 1\nTWITCH AD');
  });
});

function init() {
  // com.esamarathon.streamdeck.timer
  // Controls the text on the buttons.
  const timer = nodecg.Replicant<any>('timer', 'nodecg-speedcontrol');
  timer.on('change', (newVal: any) => {
    const buttons = streamdeck.findButtonsWithAction('com.esamarathon.streamdeck.timer');
    buttons.forEach((button) => {
      switch (newVal.state) {
        case 'stopped':
          streamdeck.updateButtonText(button.context, 'Start\nTimer');
          break;
        case 'running':
          streamdeck.updateButtonText(button.context, 'Stop\nTimer');
          break;
        case 'paused':
          streamdeck.updateButtonText(button.context, 'Resume\nTimer');
          break;
        case 'finished':
          streamdeck.updateButtonText(button.context, 'Reset\nTimer');
          break;
      }
    });
  });

  streamdeck.on('keyUp', (data: any) => {
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

    if (data.action === 'com.esamarathon.streamdeck.twitchads') {
      obs.changeScene(nodecg.bundleConfig.obs.names.scenes.ads);
    }
  });
}
