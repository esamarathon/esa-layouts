"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const amqp_connection_manager_1 = __importDefault(require("amqp-connection-manager"));
const amqplib_1 = __importDefault(require("amqplib"));
const events_1 = require("events");
const nodecgApiContext = __importStar(require("./nodecg-api-context"));
const nodecg_bundleconfig_1 = require("./nodecg-bundleconfig");
const eventShort = getCurrentEventShort();
// exchanges we need to listen/publish on.
const ourExchange = 'cg';
const theirTopics = [
    { name: 'evt-donation-total', exchange: 'tracker', key: '*.donation_total.updated' },
    { name: 'donation-fully-processed', exchange: 'tracker',
        key: `${eventShort}.donation.*.fully_processed` },
    { name: 'new-screened-tweet', exchange: 'moderation', key: 'screened.tweet' },
    { name: 'new-screened-sub', exchange: 'moderation', key: 'screened.sub' },
    { name: 'new-screened-cheer', exchange: 'moderation', key: 'screened.cheer' },
    { name: 'new-screened-crowdcontrolexchange', exchange: 'moderation',
        key: 'screened.crowdcontrol' },
    { name: 'bigbutton-tag-scanned', exchange: 'bigbutton', key: '*.tag_scanned' },
    { name: 'bigbutton-pressed', exchange: 'bigbutton', key: '*.pressed' },
    { name: 'run-changed', exchange: ourExchange, key: '*.run.changed' },
    { name: 'game-scene-changed', exchange: ourExchange, key: 'obs.scene.*.*.gamescene' },
];
const nodecg = nodecgApiContext.get();
exports.mq = new events_1.EventEmitter();
let mqChan;
if (nodecg_bundleconfig_1.bundleConfig.rabbitmq.enable) {
    nodecg.log.info('Setting up RabbitMQ connection.');
    rabbitInit();
}
// Remote connection.
function rabbitInit() {
    const remoteConn = amqp_connection_manager_1.default.connect([buildMQURL(nodecg.bundleConfig.rabbitmq)]).on('connect', () => {
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
        setup(chan) {
            setupMqChannel(chan);
            nodecg.log.info('RabbitMQ server connection listening for messages.');
            return;
        },
    }).on('error', (err) => {
        nodecg.log.warn('RabbitMQ server channel error.');
        nodecg.log.debug('RabbitMQ server channel error:', err);
    });
}
function setupMqChannel(chan) {
    chan.assertExchange(ourExchange, 'topic', { durable: true, autoDelete: true });
    for (const topic of theirTopics) {
        const queueName = `speedcontrol-${eventShort}-${topic.name}`;
        chan.assertExchange(topic.exchange, 'topic', { durable: true, autoDelete: true });
        chan.assertQueue(queueName, { durable: true, expires: 4 * 60 * 60 * 1000 });
        chan.bindQueue(queueName, topic.exchange, topic.key);
        chan.consume(queueName, (msg) => {
            if (msg) {
                if (msg.content && validateMqMsg(msg)) {
                    exports.mq.emit(topic.name, JSON.parse(msg.content.toString()));
                    nodecg.log.debug('Received message from RabbitMQ %s: %s', topic.name, msg.content.toString());
                }
                chan.ack(msg);
            }
        }, {
            noAck: false,
        });
    }
}
function validateMqMsg(msg) {
    return msg.fields.exchange !== ourExchange || !msg.fields.routingKey.startsWith(`${eventShort}.`);
}
/**
 * Used to send messages over the RabbitMQ connections.
 * Automatically prepends the event name to the key.
 * @param key The routing key this message will be published with (topic exchange)
 * @param data The data that should be sent in this message.
 */
function send(key, data) {
    if (!mqChan) {
        nodecg.log.debug('Could not send MQ message as channel is not defined.');
        return;
    }
    mqChan.publish(ourExchange, `${eventShort}.${key}`, Buffer.from(JSON.stringify(data)), { persistent: true });
    queueLog(key, JSON.stringify(data));
}
exports.send = send;
// Used for debugging.
function queueLog(key, data) {
    nodecg.log.debug('Sending message to RabbitMQ with routing key %s: %s', key, data);
}
function buildMQURL(rabbitmq) {
    let url = `${rabbitmq.protocol}://${rabbitmq.hostname}`;
    if (rabbitmq.vhost) {
        url += `/${rabbitmq.vhost}`;
    }
    if (!rabbitmq.username && !rabbitmq.password) {
        return { url };
    }
    return { url, connectionOptions: {
            credentials: amqplib_1.default.credentials.plain(rabbitmq.username, rabbitmq.password),
        } };
}
function getCurrentEventShort() {
    if (!Array.isArray(nodecg_bundleconfig_1.bundleConfig.tracker.events)) {
        return nodecg_bundleconfig_1.bundleConfig.tracker.events;
    }
    return nodecg_bundleconfig_1.bundleConfig.tracker.events[nodecg_bundleconfig_1.bundleConfig.tracker.streamEvent - 1];
}
//# sourceMappingURL=rabbitmq.js.map