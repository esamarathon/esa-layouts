import speedcontrolUtil from 'speedcontrol-util';
import * as nodecgApiContext from './util/nodecg-api-context';
import { bundleConfig } from './util/nodecg-bundleconfig';
import obs from './util/obs';
import streamDeck from './util/stream-deck';

if (!bundleConfig.streamdeck.enable) {
  // @ts-ignore: Gonna do this anyway :)
  return;
}

const nodecg = nodecgApiContext.get();
const sc = new speedcontrolUtil(nodecg);
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
  sc.timer.on('change', (newVal) => {
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
    // Currently the "Stop Timer" state only works if there's only 1 team.
    if (data.action === 'com.esamarathon.streamdeck.timer') {
      switch (sc.timer.value.state) {
        case 'stopped':
        case 'paused':
          sc.startTimer();
          break;
        case 'running':
          sc.stopTimer();
          break;
        case 'finished':
          sc.resetTimer();
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
