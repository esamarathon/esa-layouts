"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var amqp_connection_manager_1 = __importDefault(require("amqp-connection-manager"));
var amqplib_1 = __importDefault(require("amqplib"));
var events_1 = require("events");
function getTimeInfo() {
    var nowDate = new Date();
    return {
        unix: nowDate.getTime() / 1000,
        iso: nowDate.toISOString(),
    };
}
// Below chunk of code used if "useTestData" is enabled.
function generateDonationMsg() {
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
var testData = {
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
var RabbitMQ = /** @class */ (function () {
    function RabbitMQ(nodecg, useTestData, opts) {
        var _this = this;
        this.evt = new events_1.EventEmitter();
        this.nodecg = nodecg;
        this.config = opts.config;
        this.exchange = opts.exchange;
        this.event = opts.event;
        this.listenTopics = opts.listenTopics;
        this.useTestData = useTestData;
        if (opts.config.enable) {
            if (!useTestData) {
                nodecg.log.info('[RabbitMQ] Setting up connection');
                var conn = amqp_connection_manager_1.default.connect([this.url()], this.opts())
                    .on('connect', function () {
                    nodecg.log.info('[RabbitMQ] Server connection successful');
                })
                    .on('disconnect', function (err) {
                    nodecg.log.warn('[RabbitMQ] Server connection closed');
                    if (err) {
                        nodecg.log.warn('[RabbitMQ] Server connection error');
                        nodecg.log.debug('[RabbitMQ] Server connection error:', err);
                    }
                });
                this.chan = conn.createChannel({
                    json: false,
                    setup: function (chan) { return _this.setupChan(chan); },
                }).on('error', function (err) {
                    nodecg.log.warn('[RabbitMQ] Server channel error');
                    nodecg.log.debug('[RabbitMQ] Server channel error:', err);
                });
            }
            else {
                nodecg.listenFor('testRabbitMQ', function (msgType) {
                    if (msgType === 'donationFullyProcessed') {
                        testData.donationFullyProcessed = generateDonationMsg();
                    }
                    nodecg.log.debug('[RabbitMQ] Sending test message out for topic %s: %s', msgType, JSON.stringify(testData[msgType]));
                    _this.evt.emit(msgType, testData[msgType]);
                });
            }
        }
    }
    RabbitMQ.prototype.url = function () {
        return this.config.protocol + "://" + this.config.hostname + (this.config.vhost ? "/" + this.config.vhost : '');
    };
    RabbitMQ.prototype.opts = function () {
        if (this.config.username || !this.config.password) {
            return {
                connectionOptions: {
                    credentials: amqplib_1.default.credentials.plain(this.config.username, this.config.password),
                },
            };
        }
        return undefined;
    };
    RabbitMQ.prototype.validateMsg = function (msg) {
        return msg.fields.exchange !== this.exchange
            || !msg.fields.routingKey.startsWith(this.event + ".");
    };
    RabbitMQ.prototype.setupChan = function (chan) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                chan.assertExchange(this.exchange, 'topic', { durable: true, autoDelete: true });
                this.listenTopics.forEach(function (topic) {
                    var queueName = _this.exchange + "-" + _this.event + "-" + topic.name;
                    chan.assertExchange(topic.exchange, 'topic', { durable: true, autoDelete: true });
                    chan.assertQueue(queueName, { durable: true, expires: 4 * 60 * 60 * 1000 });
                    chan.bindQueue(queueName, topic.exchange, topic.key);
                    chan.consume(queueName, function (msg) {
                        if (msg && msg.content && _this.validateMsg(msg)) {
                            setTimeout(function () {
                                _this.evt.emit(topic.name, JSON.parse(msg.content.toString()));
                            }, 0);
                            _this.nodecg.log.debug('[RabbitMQ] Received message from topic %s: %s', topic.name, msg.content.toString());
                        }
                        if (msg) {
                            chan.ack(msg);
                        }
                    }, { noAck: false });
                });
                this.nodecg.log.info('[RabbitMQ] Server connection listening for messages');
                return [2 /*return*/];
            });
        });
    };
    /**
     * Used to send messages over the RabbitMQ connection.
     * Automatically prepends the event name to the key.
     * @param key The routing key this message will be published with.
     * @param data The data that should be sent in this message.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    RabbitMQ.prototype.send = function (key, data) {
        if (!this.config.enable) {
            // RabbitMQ not enabled, don't even try to send.
            return;
        }
        if (!this.chan && !this.useTestData) {
            this.nodecg.log.debug('[RabbitMQ] Could not send message as channel is not defined');
            return;
        }
        var newData = __assign(__assign({}, data), {
            event: this.event,
            time: getTimeInfo(),
        });
        var fullKey = this.event + "." + key;
        if (this.chan && !this.useTestData) {
            this.chan.publish(this.exchange, fullKey, Buffer.from(JSON.stringify(newData)), { persistent: true });
        }
        this.nodecg.log.debug('[RabbitMQ] Sending message with routing key: %s: %s', fullKey, JSON.stringify(newData));
    };
    return RabbitMQ;
}());
module.exports = RabbitMQ;
