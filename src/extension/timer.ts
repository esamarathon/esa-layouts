import speedcontrolUtil from 'speedcontrol-util';
import * as nodecgApiContext from './util/nodecg-api-context';
import { mq } from './util/rabbitmq';

const nodecg = nodecgApiContext.get();
const sc = new speedcontrolUtil(nodecg);

// Controls the nodecg-speedcontrol timer when the big buttons are pressed.
mq.on('BigButton', (data: any) => {
  const buttonID = data.button_id - 1;

  // Make sure we're listening for the right message.
  if (!data.time && !data.button_message_count) {
    return;
  }

  switch (sc.timer.value.state) {
    case 'stopped':
      sc.startTimer();
      break;
    case 'running':
      sc.stopTimer(buttonID);
      break;
  }
});
