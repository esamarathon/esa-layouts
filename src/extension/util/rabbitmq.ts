import amqplib from 'amqplib';
import { EventEmitter } from 'events';
import * as nodecgUtils from './nodecg';

interface MQEmitter extends EventEmitter {
  // Remote
  on(event: 'evt-donation-total', listener: (data: any) => void): this;
  on(event: 'donation-fully-processed', listener: (data: any) => void): this;
  on(event: 'new-screened-tweet', listener: (data: any) => void): this;
  on(event: 'new-screened-sub', listener: (data: any) => void): this;

  // Local
  on(event: 'flagcarrier-tag-scanned', listener: (data: any) => void): this;
  on(event: 'BigButton', listener: (data: any) => void): this;

  on(event: string, listener: Function): this;
}

const nodecg = nodecgUtils.getCtx();
export const mq: MQEmitter = new EventEmitter();
nodecg.log.info('Setting up RabbitMQ connections.');

// Remote/local queues we need to listen on.
const remoteQueues = [
  'evt-donation-total',
  'donation-fully-processed',
  'new-screened-tweet',
  'new-screened-sub',
];
const localQueues = [
  'flagcarrier-tag-scanned',
  'BigButton',
];

// Remote connection.
const remoteOpts = nodecg.bundleConfig.rabbitmq.remote;
const remoteConn = amqplib.connect(remoteOpts);
let remoteChan: amqplib.Channel;
remoteConn.then((conn) => {
  nodecg.log.info('RabbitMQ remote server connection successful.');
  conn.createChannel().then((chan) => {
    remoteChan = chan;
    listenToQueues();
    nodecg.log.info('RabbitMQ remote server connection listening to queues.');
  }).catch(err => logRabbitMQErrors(err));
}).catch(err => logRabbitMQErrors(err));

// Local connection.
const localOpts = nodecg.bundleConfig.rabbitmq.local;
const localConn = amqplib.connect(localOpts);
let localChan: amqplib.Channel;
localConn.then((conn) => {
  nodecg.log.info('RabbitMQ local server connection successful.');
  conn.createChannel().then((chan) => {
    localChan = chan;
    listenToQueues(true);
    nodecg.log.info('RabbitMQ local server connection listening to queues.');
  }).catch(err => logRabbitMQErrors(err, true));
}).catch(err => logRabbitMQErrors(err, true));

function listenToQueues(local?: boolean) {
  const queues = local ? localQueues : remoteQueues;
  const chan = local ? localChan : remoteChan;
  for (const queue of queues) {
    chan.assertQueue(queue);
    chan.consume(queue, (msg) => {
      if (msg && msg.content) {
        mq.emit(queue, JSON.parse(msg.content.toString()));
      }
    }, { // tslint:disable-next-line: align
      noAck: true,
    });
  }
}

function logRabbitMQErrors(err: any, local?: boolean) {
  nodecg.log.warn(`RabbitMQ ${local ? 'local' : 'remote'} server connection error: `, err);
}

/**
 * Used to send messages over the RabbitMQ connections.
 * @param queue The name of the queue this message should be sent to.
 * @param data The data that should be sent in this message.
 * @param local If this should be sent to the local server (instead of the remove server).
 */
export function send(queue: string, data: object, local?: boolean) {
  const chan = local ? localChan : remoteChan;
  chan.sendToQueue(
    queue,
    Buffer.from(JSON.stringify(data)),
  );
  queueLog(queue, JSON.stringify(data));
}

// Used for debugging.
function queueLog(queue: string, data: string, local?: boolean) {
  nodecg.log.debug(
    `Sending message to RabbitMQ queue [${local ? 'local' : 'remote'} server] %s: %s`,
    queue, data,
  );
}
