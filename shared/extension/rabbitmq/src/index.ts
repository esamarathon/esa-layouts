import type { BigButton, FlagCarrier, OmnibarModeration, Tracker } from '@esamarathon/mq-events/types';
import type NodeCGTypes from '@nodecg/types';
import type { ChannelWrapper } from 'amqp-connection-manager';
import amqpConnectionManager from 'amqp-connection-manager';
import type { ConfirmChannel, Message } from 'amqplib';
import amqplib from 'amqplib';
import { EventEmitter } from 'events';
import { v4 as uuid } from 'uuid';
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
    _id: Math.floor(Math.random() * 1000000000),
    donor_visiblename: 'Anonymous',
    amount: Math.floor(Math.random() * 100),
    comment_state: 'APPROVED',
    comment: 'This is a comment!',
    time_received: new Date(Date.now()).toISOString(),
  };
  /* eslint-enable */
}
function generateUserTagMsg(tag: number, id: string): FlagCarrier.TagScanned {
  return {
    flagcarrier: {
      id,
      group: 'stream1',
      time: {
        iso: (new Date()).toISOString(),
        unix: Date.now() / 1000,
      },
      uid: uuid(),
    },
    user: {
      displayName: (() => {
        switch (tag) {
          case 1:
            return 'ExampleUser1';
          case 2:
            return 'ExampleUser2';
          case 3:
            return 'ExampleUser3';
          default:
            return 'ExampleUser';
        }
      })(),
    },
    raw: {
      pronouns: (() => {
        switch (tag) {
          case 1:
            return 'he/him';
          case 2:
            return 'she/her';
          case 3:
            return 'they/them';
          default:
            return '';
        }
      })(),
      twitch_name: (() => {
        switch (tag) {
          case 1:
            return 'exampleuser1';
          case 2:
            return 'exampleuser2';
          case 3:
            return 'exampleuser3';
          default:
            return '';
        }
      })(),
      country_code: (() => {
        switch (tag) {
          case 1:
            return 'DE';
          case 2:
            return 'SE';
          case 3:
            return 'FI';
          default:
            return '';
        }
      })(),
    },
  };
}
const buttonMsgCount: { [k: string]: number } = {};
function generateBigbuttonPressMsg(id: number): BigButton.ButtonPress {
  if (!buttonMsgCount[id]) buttonMsgCount[id] = 1;
  else buttonMsgCount[id] += 1;
  return {
    button_id: id,
    button_message_count: buttonMsgCount[id],
    time: {
      iso: (new Date()).toISOString(),
      unix: Date.now() / 1000,
    },
  };
}
const testData: {
  donationFullyProcessed: Tracker.DonationFullyProcessed;
  // newScreenedSub: OmnibarModeration.NewScreenedSub;
  newScreenedSub: { [k: string]: unknown }; // TODO: Update MQ event!
  newScreenedCheer: OmnibarModeration.NewScreenedCheer;
  bigbuttonTagScanned: FlagCarrier.TagScanned;
  bigbuttonPressed: BigButton.ButtonPress;
  newScreenedTweet: OmnibarModeration.NewScreenedTweet;
  newScreenedCrowdControl: OmnibarModeration.NewScreenedCrowdControl;
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
    user: {
      displayName: 'ExampleUser',
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
  bigbuttonTagScanned: generateUserTagMsg(1, '1'),
  bigbuttonPressed: generateBigbuttonPressMsg(1),
  newScreenedTweet: {
    message: {
      full_text: 'Some lengthy tweet that will need some scrolling. '
        + 'Some lengthy tweet that will need some scrolling? '
        + 'Some lengthy tweet that will need some scrolling!',
    },
    user: {
      name: 'Some Cool Twitter User',
    },
  },
  newScreenedCrowdControl: {
    message: {
      trailing: 'SomeExampleUser has received 1000 coins!',
    },
  },
};

class RabbitMQ {
  private nodecg: NodeCGTypes.ServerAPI;
  private config: RabbitMQTypes.Config;
  private chan: ChannelWrapper | undefined;
  private exchange: string;
  private event: string;
  private listenTopics: RabbitMQTypes.ListenTopics;
  private useTestData: boolean;
  evt = new EventEmitter() as RabbitMQTypes.Events;

  constructor(
    nodecg: NodeCGTypes.ServerAPI,
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

    if (opts.config.enabled) {
      if (!useTestData) {
        try {
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
          }).on('close', () => {
            nodecg.log.warn('[RabbitMQ] Server channel closed');
          });
        } catch (err) {
          nodecg.log.warn('[RabbitMQ] Some caught error, YOU PROBABLY NEED TO RESTART NODECG!');
          nodecg.log.debug(
            '[RabbitMQ] Some caught error, YOU PROBABLY NEED TO RESTART NODECG!:',
            err,
          );
        }
      } else {
        nodecg.listenFor(
          'testRabbitMQ',
          ({ msgType, data }: {
            msgType: 'donationFullyProcessed' | 'newScreenedSub'
            | 'newScreenedCheer' | 'bigbuttonTagScanned' | 'bigbuttonPressed'
            | 'newScreenedTweet' | 'newScreenedCrowdControl',
            data?: { [k: string]: unknown },
          }) => {
            if (msgType === 'donationFullyProcessed') {
              testData.donationFullyProcessed = generateDonationMsg();
            } else if (msgType === 'bigbuttonTagScanned') {
              testData.bigbuttonTagScanned = generateUserTagMsg(
                (data?.tag || 1) as number,
                (data?.id || '1') as string,
              );
            } else if (msgType === 'bigbuttonPressed') {
              testData.bigbuttonPressed = generateBigbuttonPressMsg((data?.id || 1) as number);
            }
            nodecg.log.debug(
              '[RabbitMQ] Sending test message out for topic %s: %s',
              msgType,
              JSON.stringify(testData[msgType]),
            );
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
    try {
      chan.assertExchange(this.exchange, 'topic', { durable: true, autoDelete: true });
      this.listenTopics.forEach((topic) => {
        let queueName = `${this.exchange}-${this.event}-${topic.name}`;
        if (this.config.queuePrepend) queueName = `${this.config.queuePrepend}_${queueName}`;
        chan.assertExchange(topic.exchange, 'topic', { durable: true, autoDelete: true });
        chan.assertQueue(queueName, { durable: true, expires: 4 * 60 * 60 * 1000 });
        chan.bindQueue(queueName, topic.exchange, topic.key);
        chan.consume(queueName, (msg) => {
          if (msg && msg.content && this.validateMsg(msg)) {
            setTimeout(() => {
              this.evt.emit(topic.name, JSON.parse(msg.content.toString()));
            }, 0);
            this.nodecg.log.debug(
              '[RabbitMQ] Received message from topic %s: %s',
              topic.name,
              msg.content.toString(),
            );
          }
          if (msg) {
            chan.ack(msg);
          }
        }, { noAck: false });
      });
      this.nodecg.log.info('[RabbitMQ] Server connection listening for messages');
    } catch (err) {
      this.nodecg.log.warn('[RabbitMQ] Some caught channel error');
      this.nodecg.log.debug('[RabbitMQ] Some caught channel error:', err);
    }
  }

  /**
   * Used to send messages over the RabbitMQ connection.
   * Automatically prepends the event name to the key.
   * @param key The routing key this message will be published with.
   * @param data The data that should be sent in this message.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async send(key: string, data: { [k: string]: any }): Promise<void> {
    if (!this.config.enabled) {
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
      try {
        await this.chan.publish(
          this.exchange,
          fullKey,
          Buffer.from(JSON.stringify(newData)),
          { persistent: true },
        );
      } catch (err) {
        this.nodecg.log.warn('[RabbitMQ] Error sending message, YOU MAY NEED TO RESTART NODECG!');
        this.nodecg.log.debug(
          '[RabbitMQ] Error sending message, YOU MAY NEED TO RESTART NODECG!:',
          err,
        );
      }
    }
    this.nodecg.log.debug(
      '[RabbitMQ] Sending message with routing key: %s: %s',
      fullKey,
      JSON.stringify(newData),
    );
  }
}

export = RabbitMQ;
