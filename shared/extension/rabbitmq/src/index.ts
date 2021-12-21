import type { OmnibarModeration, Tracker } from '@esamarathon/mq-events/types';
import type { ChannelWrapper } from 'amqp-connection-manager';
import amqpConnectionManager from 'amqp-connection-manager';
import type { ConfirmChannel, Message } from 'amqplib';
import amqplib from 'amqplib';
import { EventEmitter } from 'events';
import type { NodeCG } from 'nodecg/types/server';
import { RabbitMQ as RabbitMQTypes } from '../../../types';

function getTimeInfo(): { unix: number; iso: string } {
  const nowDate: Date = new Date();
  return {
    unix: nowDate.getTime() / 1000,
    iso: nowDate.toISOString(),
  };
}

// Below chunk of code used if "useTestData" is enabled.
function generateDonationMsg(): Tracker.DonationFullyProcessed {
  /* eslint-disable @typescript-eslint/naming-convention */
  return {
    event: 'testevt1',
    _id: Math.random() * 1000000000,
    donor_visiblename: 'Anonymous',
    amount: Math.floor(Math.random() * 100),
    comment_state: 'APPROVED',
    comment: 'This is a comment!',
    time_received: new Date(Date.now()).toISOString(),
  };
  /* eslint-enable */
}
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
        'system-msg': 'ExampleUser subscribed at Tier 1. They\'ve subscribed for '
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

class RabbitMQ {
  private nodecg: NodeCG;
  private config: RabbitMQTypes.Config;
  private chan: ChannelWrapper | undefined;
  private exchange: string;
  private event: string;
  private listenTopics: RabbitMQTypes.ListenTopics;
  private useTestData: boolean;
  evt = new EventEmitter() as RabbitMQTypes.Events;

  constructor(
    nodecg: NodeCG,
    useTestData: boolean,
    opts: {
      config: RabbitMQTypes.Config,
      exchange: string,
      event: string,
      listenTopics: RabbitMQTypes.ListenTopics,
    },
  ) {
    this.nodecg = nodecg;
    this.config = opts.config;
    this.exchange = opts.exchange;
    this.event = opts.event;
    this.listenTopics = opts.listenTopics;
    this.useTestData = useTestData;

    if (opts.config.enable) {
      if (!useTestData) {
        nodecg.log.info('[RabbitMQ] Setting up connection');
        const conn = amqpConnectionManager.connect([this.url()], this.opts())
          .on('connect', () => {
            nodecg.log.info('[RabbitMQ] Server connection successful');
          })
          .on('disconnect', (err) => {
            nodecg.log.warn('[RabbitMQ] Server connection closed');
            if (err) {
              nodecg.log.warn('[RabbitMQ] Server connection error');
              nodecg.log.debug('[RabbitMQ] Server connection error:', err);
            }
          });
        this.chan = conn.createChannel({
          json: false,
          setup: (chan: ConfirmChannel) => this.setupChan(chan),
        }).on('error', (err) => {
          nodecg.log.warn('[RabbitMQ] Server channel error');
          nodecg.log.debug('[RabbitMQ] Server channel error:', err);
        });
      } else {
        nodecg.listenFor(
          'testRabbitMQ',
          (msgType: 'donationFullyProcessed' | 'newScreenedSub' | 'newScreenedCheer') => {
            if (msgType === 'donationFullyProcessed') {
              testData.donationFullyProcessed = generateDonationMsg();
            }
            nodecg.log.debug('[RabbitMQ] Sending test message out for topic %s: %s',
              msgType, JSON.stringify(testData[msgType]));
            this.evt.emit(msgType, testData[msgType]);
          },
        );
      }
    }
  }

  private url(): string {
    return `${this.config.protocol}://${
      this.config.hostname}${this.config.vhost ? `/${this.config.vhost}` : ''}`;
  }

  private opts(): RabbitMQTypes.Options | undefined {
    if (this.config.username || !this.config.password) {
      return {
        connectionOptions: {
          credentials: amqplib.credentials.plain(this.config.username, this.config.password),
        },
      };
    }
    return undefined;
  }

  private validateMsg(msg: Message): boolean {
    return msg.fields.exchange !== this.exchange
    || !msg.fields.routingKey.startsWith(`${this.event}.`);
  }

  private async setupChan(chan: ConfirmChannel): Promise<void> {
    chan.assertExchange(this.exchange, 'topic', { durable: true, autoDelete: true });
    this.listenTopics.forEach((topic) => {
      const queueName = `${this.exchange}-${this.event}-${topic.name}`;
      chan.assertExchange(topic.exchange, 'topic', { durable: true, autoDelete: true });
      chan.assertQueue(queueName, { durable: true, expires: 4 * 60 * 60 * 1000 });
      chan.bindQueue(queueName, topic.exchange, topic.key);
      chan.consume(queueName, (msg) => {
        if (msg && msg.content && this.validateMsg(msg)) {
          setTimeout(() => {
            this.evt.emit(topic.name, JSON.parse(msg.content.toString()));
          }, 0);
          this.nodecg.log.debug('[RabbitMQ] Received message from topic %s: %s',
            topic.name, msg.content.toString());
        }
        if (msg) {
          chan.ack(msg);
        }
      }, { noAck: false });
    });
    this.nodecg.log.info('[RabbitMQ] Server connection listening for messages');
  }

  /**
   * Used to send messages over the RabbitMQ connection.
   * Automatically prepends the event name to the key.
   * @param key The routing key this message will be published with.
   * @param data The data that should be sent in this message.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  send(key: string, data: { [k: string]: any }): void {
    if (!this.config.enable) {
      // RabbitMQ not enabled, don't even try to send.
      return;
    }
    if (!this.chan && !this.useTestData) {
      this.nodecg.log.debug('[RabbitMQ] Could not send message as channel is not defined');
      return;
    }
    const newData = {
      ...data,
      ...{
        event: this.event,
        time: getTimeInfo(),
      },
    };
    const fullKey = `${this.event}.${key}`;
    if (this.chan && !this.useTestData) {
      this.chan.publish(
        this.exchange,
        fullKey,
        Buffer.from(JSON.stringify(newData)),
        { persistent: true },
      );
    }
    this.nodecg.log.debug('[RabbitMQ] Sending message with routing key: %s: %s',
      fullKey, JSON.stringify(newData));
  }
}

export = RabbitMQ;
