import RabbitMQ from '@shared/extension/rabbitmq';
import { getCurrentEventShort } from './helpers';
import { get as nodecg } from './nodecg';

const { useTestData } = nodecg().bundleConfig;
const exchange = 'cg';
const event = getCurrentEventShort();

// eslint-disable-next-line import/prefer-default-export
export const mq = new RabbitMQ(nodecg(), useTestData, {
  config: nodecg().bundleConfig.rabbitmq,
  exchange,
  event,
  listenTopics: [
    {
      name: 'donationTotalUpdated',
      exchange: 'tracker',
      key: '*.donation_total.updated',
    },
    {
      name: 'donationFullyProcessedStream',
      exchange: 'tracker',
      key: `${event}.donation.*.fully_processed`,
    },
    {
      name: 'donationFullyProcessedTeam',
      exchange: 'tracker',
      key: 'esaw2024.donation.*.fully_processed', // HARDCODED! (ESAW24)
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
