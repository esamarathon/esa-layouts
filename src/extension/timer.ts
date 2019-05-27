import { Timer } from '../../../nodecg-speedcontrol/types';
import * as nodecgUtils from './util/nodecg';
import { mq } from './util/rabbitmq';

const nodecg = nodecgUtils.getCtx();
const timer = nodecg.Replicant<Timer>('timer', 'nodecg-speedcontrol');

// Controls the nodecg-speedcontrol timer when the big buttons are pressed.
mq.on('BigButton', (data: any) => {
  const buttonID = data.button_id - 1;

  // Make sure we're listening for the right message.
  if (!data.time && !data.button_message_count) {
    return;
  }

  switch (timer.value.state) {
    case 'stopped':
      // @ts-ignore: NodeCG not declaring this (yet).
      nodecg.sendMessageToBundle('startTimer', 'nodecg-speedcontrol');
      break;
    case 'running':
      // @ts-ignore: NodeCG not declaring this (yet).
      nodecg.sendMessageToBundle('stopTimer', 'nodecg-speedcontrol', buttonID);
      break;
  }
});
