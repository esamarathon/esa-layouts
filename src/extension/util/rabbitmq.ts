import amqpConnectionManager, { AmqpConnectionManager, ChannelWrapper } from 'amqp-connection-manager'; // eslint-disable-line max-len
import amqplib, { ConfirmChannel, Message } from 'amqplib';
import { Configschema } from 'configschema';
import { EventEmitter } from 'events';
import { MQEmitter, MQOpts } from 'types';
import { getCurrentEventShort } from './helpers';
import { get as nodecg } from './nodecg';

const config = (nodecg().bundleConfig as Configschema).rabbitmq;
const exchange = 'cg';
const event = getCurrentEventShort();
export const mq = new EventEmitter() as MQEmitter;

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
    name: 'gameSceneChanged',
    exchange,
    key: 'obs.scene.*.*.gamescene',
  },
];

function url(): string {
  return `${config.protocol}://${config.hostname}${config.vhost ? `/${config.vhost}` : ''}`;
}

function opts(): MQOpts | undefined {
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
        mq.emit(topic.name, JSON.parse(msg.content.toString()));
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

let conn: AmqpConnectionManager | undefined;
let chan: ChannelWrapper | undefined;
if (config.enable) {
  nodecg().log.info('[RabbitMQ] Setting up connection');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  conn = amqpConnectionManager.connect([url()], opts() as any)
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
}

/**
 * Used to send messages over the RabbitMQ connection.
 * Automatically prepends the event name to the key.
 * @param key The routing key this message will be published with.
 * @param data The data that should be sent in this message.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function send(key: string, data: any): void {
  if (!config.enable) {
    // RabbitMQ not enabled, don't even try to send.
    return;
  }
  if (!chan) {
    nodecg().log.debug('[RabbitMQ] Could not send message as channel is not defined');
    return;
  }
  chan.publish(
    exchange,
    `${event}.${key}`,
    Buffer.from(JSON.stringify(data)),
    { persistent: true },
  );
  nodecg().log.debug('[RabbitMQ] Sending message with routing key: %s: %s',
    key, JSON.stringify(data));
}
