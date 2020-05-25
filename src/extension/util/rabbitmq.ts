import { OmnibarModeration, Tracker } from '@esamarathon/mq-events/types';
import amqpConnectionManager from 'amqp-connection-manager';
import type { AmqpConnectionManager, ChannelWrapper } from 'amqp-connection-manager';
import amqplib from 'amqplib';
import type { ConfirmChannel, Message } from 'amqplib';
import type { Configschema } from 'configschema';
import { EventEmitter } from 'events';
import type { RabbitMQ } from 'types';
import { getCurrentEventShort } from './helpers';
import { get as nodecg } from './nodecg';

const { useTestData } = nodecg().bundleConfig as Configschema;
const config = (nodecg().bundleConfig as Configschema).rabbitmq;
const exchange = 'cg';
const event = getCurrentEventShort();
export const evt = new EventEmitter() as RabbitMQ.Events;

// List of topics we are going to listen to.
const listenTopics = [
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
  {
    name: 'rvtServerStarted',
    exchange: 'restreamviewertool',
    key: `${event}.*.server.started`,
  },
];

function getTimeInfo(): { unix: number; iso: string } {
  const nowDate: Date = new Date();
  return {
    unix: nowDate.getTime() / 1000,
    iso: nowDate.toISOString(),
  };
}

function url(): string {
  return `${config.protocol}://${config.hostname}${config.vhost ? `/${config.vhost}` : ''}`;
}

function opts(): RabbitMQ.Options | undefined {
  if (config.username || !config.password) {
    return {
      connectionOptions: {
        credentials: amqplib.credentials.plain(config.username, config.password),
      },
    };
  }
  return undefined;
}

function validateMsg(msg: Message): boolean {
  return msg.fields.exchange !== exchange || !msg.fields.routingKey.startsWith(`${event}.`);
}

async function setupChan(chan: ConfirmChannel): Promise<void> {
  chan.assertExchange(exchange, 'topic', { durable: true, autoDelete: true });
  listenTopics.forEach((topic) => {
    const queueName = `${exchange}-${event}-${topic.name}`;
    chan.assertExchange(topic.exchange, 'topic', { durable: true, autoDelete: true });
    chan.assertQueue(queueName, { durable: true, expires: 4 * 60 * 60 * 1000 });
    chan.bindQueue(queueName, topic.exchange, topic.key);
    chan.consume(queueName, (msg) => {
      if (msg && msg.content && validateMsg(msg)) {
        setTimeout(() => {
          evt.emit(topic.name, JSON.parse(msg.content.toString()));
        }, 0);
        nodecg().log.debug('[RabbitMQ] Received message from topic %s: %s',
          topic.name, msg.content.toString());
      }
      if (msg) {
        chan.ack(msg);
      }
    }, { noAck: false });
  });
  nodecg().log.info('[RabbitMQ] Server connection listening for messages');
}

let donationID = 0;
function generateDonationMsg(): Tracker.DonationFullyProcessed {
  donationID += 1;
  /* eslint-disable @typescript-eslint/camelcase */
  return {
    event: 'testevt1',
    _id: donationID,
    donor_visiblename: 'Anonymous',
    amount: Math.floor(Math.random() * 100),
    comment_state: 'APPROVED',
    comment: 'This is a comment!',
    time_received: new Date(Date.now()).toISOString(),
  };
  /* eslint-enable */
}

function initTest(): void {
  const testData: {
    donationFullyProcessed: Tracker.DonationFullyProcessed;
    newScreenedSub: OmnibarModeration.NewScreenedSub;
    newScreenedCheer: OmnibarModeration.NewScreenedCheer;
  } = {
    donationFullyProcessed: generateDonationMsg(),
    newScreenedSub: {
      message: {
        trailing: 'This is an extra message from the user!',
        tags: {
          'system-msg': 'ExampleUser subscribed at Tier 1. They\'ve subscribed for'
            + '26 months, currently on a 26 month streak!',
        },
      },
    },
    newScreenedCheer: {
      message: {
        trailing: 'This is a message included with the cheer!',
        tags: {
          'display-name': 'ExampleUser',
          bits: '500',
        },
      },
    },
  };
  /* eslint-enable */

  nodecg().listenFor(
    'testRabbitMQ',
    (msgType: 'donationFullyProcessed' | 'newScreenedSub' | 'newScreenedCheer') => {
      if (msgType === 'donationFullyProcessed') {
        testData.donationFullyProcessed = generateDonationMsg();
      }
      nodecg().log.debug('[RabbitMQ] Sending test message out for topic %s: %s',
        msgType, JSON.stringify(testData[msgType]));
      evt.emit(msgType, testData[msgType]);
    },
  );
}

let conn: AmqpConnectionManager | undefined;
let chan: ChannelWrapper | undefined;
if (config.enable) {
  if (!useTestData) {
    nodecg().log.info('[RabbitMQ] Setting up connection');
    conn = amqpConnectionManager.connect([url()], opts())
      .on('connect', () => {
        nodecg().log.info('[RabbitMQ] Server connection successful');
      })
      .on('disconnect', (err) => {
        nodecg().log.warn('[RabbitMQ] Server connection closed');
        if (err) {
          nodecg().log.warn('[RabbitMQ] Server connection error');
          nodecg().log.debug('[RabbitMQ] Server connection error:', err);
        }
      });
    chan = conn.createChannel({
      json: false,
      setup: setupChan,
    }).on('error', (err) => {
      nodecg().log.warn('[RabbitMQ] Server channel error');
      nodecg().log.debug('[RabbitMQ] Server channel error:', err);
    });
  } else {
    initTest();
  }
}

/**
 * Used to send messages over the RabbitMQ connection.
 * Automatically prepends the event name to the key.
 * @param key The routing key this message will be published with.
 * @param data The data that should be sent in this message.
 */
export function send(key: string, data: {}): void {
  if (!config.enable) {
    // RabbitMQ not enabled, don't even try to send.
    return;
  }
  if (!chan && !useTestData) {
    nodecg().log.debug('[RabbitMQ] Could not send message as channel is not defined');
    return;
  }
  const newData = {
    ...data,
    ...{
      event,
      time: getTimeInfo(),
    },
  };
  const fullKey = `${event}.${key}`;
  if (chan && !useTestData) {
    chan.publish(
      exchange,
      fullKey,
      Buffer.from(JSON.stringify(newData)),
      { persistent: true },
    );
  }
  nodecg().log.debug('[RabbitMQ] Sending message with routing key: %s: %s',
    fullKey, JSON.stringify(newData));
}
