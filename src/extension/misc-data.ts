import { Configschema } from 'configschema';
import { OtherStreamData } from 'schemas';
import { RunDataActiveRun } from '../../../nodecg-speedcontrol/schemas';
import { eventInfo } from './tracker';
import { get as nodecg } from './util/nodecg';
import { mq } from './util/rabbitmq';

const otherStreamData = nodecg().Replicant<OtherStreamData>('otherStreamData');
const config = (nodecg().bundleConfig as Configschema).tracker;
const { short } = eventInfo[config.streamEvent - 1] || {};

// Screened data from our moderation tool.
mq.on('newScreenedSub', (data) => {
  nodecg().log.info('[Misc Data] Received new subscriber');
  nodecg().sendMessage('newSub', data);
});
mq.on('newScreenedTweet', (data) => {
  nodecg().log.info('[Misc Data] Received new tweet');
  nodecg().sendMessage('newTweet', data);
});
mq.on('newScreenedCheer', (data) => {
  nodecg().log.info('[Misc Data] Received new cheer');
  nodecg().sendMessage('newCheer', data);
});
mq.on('newScreenedCrowdControl', (data) => {
  nodecg().log.info('[Misc Data] Received new crowd control message');
  nodecg().sendMessage('newCrowdControl', data);
});

// Information that should come from our 2nd stream.
// Currently assumes only 1 other "event" going on at the time.
mq.on('runChanged', (data) => {
  if (short && data.event !== short) {
    otherStreamData.value.runData = data.run as RunDataActiveRun;
    nodecg().log.info('[Misc Data] Received modified run data from other stream');
  }
});
mq.on('gameSceneChanged', (data) => {
  if (short && data.event !== short) {
    nodecg().log.info('[Misc Data] Received game scene change from other stream:', data.action);
    if (data.action === 'start') {
      otherStreamData.value.show = true;
    } else if (data.action === 'end') {
      otherStreamData.value.show = false;
    }
  }
});
