import { Configschema } from 'configschema';
import SpeedcontrolUtil from 'speedcontrol-util';
import { get as nodecg } from './util/nodecg';
import obs from './util/obs';
import { mq } from './util/rabbitmq';

const config = (nodecg().bundleConfig as Configschema);
const sc = new SpeedcontrolUtil(nodecg());

// Controls the nodecg-speedcontrol timer when the big buttons are pressed.
mq.on('bigbuttonPressed', (data) => {
  const buttonID = data.button_id - 1;

  // Make sure we're listening for the right message.
  // The message should *never* be used for anything else, but I like to be safe.
  if (!data.time && !data.button_message_count) {
    return;
  }

  // If the button was pressed more than 10s ago, ignore it.
  if (data.time.unix < (Date.now() / 1000) - 10) {
    return;
  }

  // Note: the nodecg-speedcontrol bundle will check if it *can* do these actions,
  // we do not need to check that here.
  switch (sc.timer.value.state) {
    case 'stopped':
    case 'paused':
      sc.startTimer();
      break;
    case 'running':
      sc.stopTimer(buttonID);
      break;
    case 'finished':
      sc.resetTimer();
      break;
    default:
      // Don't do anything
      break;
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
