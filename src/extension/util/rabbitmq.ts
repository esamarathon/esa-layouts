import type { Configschema } from '@esa-layouts/types/schemas/configschema';
import RabbitMQ from '@esamarathon/esa-layouts-shared/rabbitmq/extension';
import { getCurrentEventShort } from './helpers';
import { get as nodecg } from './nodecg';

const { useTestData } = nodecg().bundleConfig as Configschema;
const exchange = 'cg';
const event = getCurrentEventShort();

export const mq = new RabbitMQ(nodecg(), useTestData, {
  config: (nodecg().bundleConfig as Configschema).rabbitmq,
  exchange,
  event,
  listenTopics: [
    {
      name: 'donationTotalUpdated',
      exchange: 'tracker',
      key: '*.donation_total.updated',
    },
    {
      name: 'donationFullyProcessed',
      exchange: 'tracker',
      key: `${event}.donation.*.fully_processed`,
    },
    {
      name: 'newScreenedTweet',
      exchange: 'moderation',
      key: 'screened.tweet',
    },
    {
      name: 'newScreenedSub',
      exchange: 'moderation',
      key: 'screened.sub',
    },
    {
      name: 'newScreenedCheer',
      exchange: 'moderation',
      key: 'screened.cheer',
    },
    {
      name: 'newScreenedCrowdControl',
      exchange: 'moderation',
      key: 'screened.crowdcontrol',
    },
    {
      name: 'bigbuttonTagScanned',
      exchange: 'bigbutton',
      key: '*.tag_scanned',
    },
    {
      name: 'bigbuttonPressed',
      exchange: 'bigbutton',
      key: '*.pressed',
    },
    {
      name: 'runChanged',
      exchange,
      key: '*.run.changed',
    },
    {
      name: 'streamingStatusChanged',
      exchange,
      key: '*.obs.stream.*',
    },
    {
      name: 'gameSceneChanged',
      exchange,
      key: '*.obs.scene.*.*.gamescene',
    },
  ],
});
