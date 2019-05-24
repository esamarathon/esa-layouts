import * as nodecgApiContext from './util/nodecg-api-context';
import streamDeck from './util/stream-deck';
import obs from './util/obs';

const nodecg = nodecgApiContext.get();
let initDone = false;

streamDeck.on('init', () => {
  if (!initDone) { init(); }
  initDone = true;

  // com.esamarathon.streamdeck.timer
  // Set default text on buttons.
  setTextOnAllButtonsWithAction('com.esamarathon.streamdeck.timer', 'Start\nTimer');
  setTextOnAllButtonsWithAction('com.esamarathon.streamdeck.twitchads', 'STEP 1\nTWITCH AD');
});

function init() {
  // com.esamarathon.streamdeck.timer
  // Controls the text on the buttons.
  const timer = nodecg.Replicant<any>('timer', 'nodecg-speedcontrol');
  timer.on('change', (newVal: any) => {
    const buttons = streamDeck.findButtonsWithAction('com.esamarathon.streamdeck.timer');
    buttons.forEach((button) => {
      switch (newVal.state) {
        case 'stopped':
          streamDeck.updateButtonText(button.context, 'Start\nTimer');
          break;
        case 'running':
          streamDeck.updateButtonText(button.context, 'Stop\nTimer');
          break;
        case 'paused':
          streamDeck.updateButtonText(button.context, 'Resume\nTimer');
          break;
        case 'finished':
          streamDeck.updateButtonText(button.context, 'Reset\nTimer');
          break;
      }
    });
  });

  streamDeck.on('keyUp', (data: any) => {
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

    // com.esamarathon.streamdeck.twitchads
    if (data.action === 'com.esamarathon.streamdeck.twitchads') {
      obs.changeScene(nodecg.bundleConfig.obs.names.scenes.ads);
    }
  });
}

function setTextOnAllButtonsWithAction(action: string, text: string) {
  const buttons = streamDeck.findButtonsWithAction(action);
  buttons.forEach((button) => {
    streamDeck.updateButtonText(button.context, text);
  });
}
