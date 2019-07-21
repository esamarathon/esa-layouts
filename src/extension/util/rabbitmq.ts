import amqpConnectionManager from 'amqp-connection-manager';
import amqplib from 'amqplib';
import { EventEmitter } from 'events';
import * as nodecgApiContext from './nodecg-api-context';
import { bundleConfig } from './nodecg-bundleconfig';

interface MQEmitter extends EventEmitter {
  on(event: 'evt-donation-total', listener: (data: any) => void): this;
  on(event: 'donation-fully-processed', listener: (data: any) => void): this;
  on(event: 'new-screened-tweet', listener: (data: any) => void): this;
  on(event: 'new-screened-sub', listener: (data: any) => void): this;
  on(event: 'new-screened-cheer', listener: (data: any) => void): this;
  on(event: 'bigbutton-tag-scanned', listener: (data: any) => void): this;
  on(event: 'bigbutton-pressed', listener: (data: any) => void): this;
  on(event: 'run-changed', listener: (data: any) => void): this;
  on(event: 'game-scene-changed', listener: (data: any) => void): this;

  on(event: string, listener: Function): this;
}

interface RabbitMQConfig {
  protocol: string;
  hostname: string | undefined;
  username: string | undefined;
  password: string | undefined;
  vhost: string | undefined;
}

const eventShort: string = getCurrentEventShort();

// exchanges we need to listen/publish on.
const ourExchange = 'cg';
const theirTopics = [
  { name: 'evt-donation-total', exchange: 'tracker', key: '*.donation_total.updated' },
  { name: 'donation-fully-processed', exchange: 'tracker',
    key: `${eventShort}.donation.*.fully_processed` },
  { name: 'new-screened-tweet', exchange: 'moderation', key: 'screened.tweet' },
  { name: 'new-screened-sub', exchange: 'moderation', key: 'screened.sub' },
  { name: 'new-screened-cheer', exchange: 'moderation', key: 'screened.cheer' },
  { name: 'bigbutton-tag-scanned', exchange: 'bigbutton', key: '*.tag_scanned' },
  { name: 'bigbutton-pressed', exchange: 'bigbutton', key: '*.pressed' },
  { name: 'run-changed', exchange: ourExchange, key: '*.run.changed' },
  { name: 'game-scene-changed', exchange: ourExchange, key: 'obs.scene.*.*.gamescene' },
];

const nodecg = nodecgApiContext.get();
export const mq: MQEmitter = new EventEmitter();
let mqChan: amqpConnectionManager.ChannelWrapper;

if (bundleConfig.rabbitmq.enable) {
  nodecg.log.info('Setting up RabbitMQ connection.');
  rabbitInit();
}

// Remote connection.
function rabbitInit() {
  const remoteConn = amqpConnectionManager.connect(
    [buildMQURL(nodecg.bundleConfig.rabbitmq)],
  ).on('connect', () => {
    nodecg.log.info('RabbitMQ server connection successful.');
  }).on('disconnect', (err) => {
    nodecg.log.warn('RabbitMQ server connection closed.');
    if (err) {
      nodecg.log.warn('RabbitMQ server connection error.');
      nodecg.log.debug('RabbitMQ server connection error:', err);
    }
  });
  mqChan = remoteConn.createChannel({
    json: false,
    setup(chan: amqplib.ConfirmChannel) {
      setupMqChannel(chan);
      nodecg.log.info('RabbitMQ server connection listening for messages.');
      return;
    },
  }).on('error', (err) => {
    nodecg.log.warn('RabbitMQ server channel error.');
    nodecg.log.debug('RabbitMQ server connection error:', err);
  });
}

function setupMqChannel(chan: amqplib.ConfirmChannel) {
  chan.assertExchange(ourExchange, 'topic', { durable: true, autoDelete: true });

  for (const topic of theirTopics) {
    const queueName: string = `speedcontrol-${eventShort}-${topic.name}`;

    chan.assertExchange(topic.exchange, 'topic', { durable: true, autoDelete: true });

    chan.assertQueue(queueName, { durable: true, expires: 4 * 60 * 60 * 1000 });
    chan.bindQueue(queueName, topic.exchange, topic.key);

    chan.consume(queueName, (msg) => {
      if (msg) {
        if (msg.content && validateMqMsg(msg)) {
          mq.emit(topic.name, JSON.parse(msg.content.toString()));
          nodecg.log.debug(
            'Received message from RabbitMQ %s: %s',
            topic.name, msg.content.toString(),
          );
        }

        chan.ack(msg);
      }
    }, { // tslint:disable-next-line: align
      noAck: false,
    });
  }
}

function validateMqMsg(msg: amqplib.Message) {
  return msg.fields.exchange !== ourExchange || !msg.fields.routingKey.startsWith(`${eventShort}.`);
}

/**
 * Used to send messages over the RabbitMQ connections.
 * Automatically prepends the event name to the key.
 * @param key The routing key this message will be published with (topic exchange)
 * @param data The data that should be sent in this message.
 */
export function send(key: string, data: object) {
  if (!mqChan) {
    nodecg.log.debug('Could not send MQ message as channel is not defined.');
    return;
  }
  mqChan.publish(
    ourExchange,
    `${eventShort}.${key}`,
    Buffer.from(JSON.stringify(data)),
    { persistent: true },
  );
  queueLog(key, JSON.stringify(data));
}

// Used for debugging.
function queueLog(key: string, data: string) {
  nodecg.log.debug(
    'Sending message to RabbitMQ with routing key %s: %s',
    key, data,
  );
}

function buildMQURL(rabbitmq: RabbitMQConfig) {
  let url = `${rabbitmq.protocol}://${rabbitmq.hostname}`;

  if (rabbitmq.vhost) {
    url += `/${rabbitmq.vhost}`;
  }

  if (!rabbitmq.username && !rabbitmq.password) {
    return { url } as any;
  }

  return { url, connectionOptions: {
    credentials: amqplib.credentials.plain(
        rabbitmq.username as string,
        rabbitmq.password as string,
      ),
  }} as any;
}

function getCurrentEventShort() {
  if (!Array.isArray(bundleConfig.tracker.events)) {
    return bundleConfig.tracker.events as string;
  }
  return bundleConfig.tracker.events[bundleConfig.tracker.streamEvent - 1];
}
