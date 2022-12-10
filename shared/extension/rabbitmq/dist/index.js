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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var uuid_1 = require("uuid");
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
        _id: Math.floor(Math.random() * 1000000000),
        donor_visiblename: 'Anonymous',
        amount: Math.floor(Math.random() * 100),
        comment_state: 'APPROVED',
        comment: 'This is a comment!',
        time_received: new Date(Date.now()).toISOString(),
    };
    /* eslint-enable */
}
function generateUserTagMsg(tag, id) {
    return {
        flagcarrier: {
            id: id,
            group: 'stream1',
            time: {
                iso: (new Date()).toISOString(),
                unix: Date.now() / 1000,
            },
            uid: (0, uuid_1.v4)(),
        },
        user: {
            displayName: (function () {
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
            pronouns: (function () {
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
            twitch_name: (function () {
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
            country_code: (function () {
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
var buttonMsgCount = {};
function generateBigbuttonPressMsg(id) {
    if (!buttonMsgCount[id])
        buttonMsgCount[id] = 1;
    else
        buttonMsgCount[id] += 1;
    return {
        button_id: id,
        button_message_count: buttonMsgCount[id],
        time: {
            iso: (new Date()).toISOString(),
            unix: Date.now() / 1000,
        },
    };
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
        if (opts.config.enabled) {
            if (!useTestData) {
                try {
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
                    }).on('close', function () {
                        nodecg.log.warn('[RabbitMQ] Server channel closed');
                    });
                }
                catch (err) {
                    nodecg.log.warn('[RabbitMQ] Some caught error, YOU PROBABLY NEED TO RESTART NODECG!');
                    nodecg.log.debug('[RabbitMQ] Some caught error, YOU PROBABLY NEED TO RESTART NODECG!:', err);
                }
            }
            else {
                nodecg.listenFor('testRabbitMQ', function (_a) {
                    var msgType = _a.msgType, data = _a.data;
                    if (msgType === 'donationFullyProcessed') {
                        testData.donationFullyProcessed = generateDonationMsg();
                    }
                    else if (msgType === 'bigbuttonTagScanned') {
                        testData.bigbuttonTagScanned = generateUserTagMsg(((data === null || data === void 0 ? void 0 : data.tag) || 1), ((data === null || data === void 0 ? void 0 : data.id) || '1'));
                    }
                    else if (msgType === 'bigbuttonPressed') {
                        testData.bigbuttonPressed = generateBigbuttonPressMsg(((data === null || data === void 0 ? void 0 : data.id) || 1));
                    }
                    nodecg.log.debug('[RabbitMQ] Sending test message out for topic %s: %s', msgType, JSON.stringify(testData[msgType]));
                    _this.evt.emit(msgType, testData[msgType]);
                });
            }
        }
    }
    RabbitMQ.prototype.url = function () {
        return "".concat(this.config.protocol, "://").concat(this.config.hostname).concat(this.config.vhost ? "/".concat(this.config.vhost) : '');
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
            || !msg.fields.routingKey.startsWith("".concat(this.event, "."));
    };
    RabbitMQ.prototype.setupChan = function (chan) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                try {
                    chan.assertExchange(this.exchange, 'topic', { durable: true, autoDelete: true });
                    this.listenTopics.forEach(function (topic) {
                        var queueName = "".concat(_this.exchange, "-").concat(_this.event, "-").concat(topic.name);
                        if (_this.config.queuePrepend)
                            queueName = "".concat(_this.config.queuePrepend, "_").concat(queueName);
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
                }
                catch (err) {
                    this.nodecg.log.warn('[RabbitMQ] Some caught channel error');
                    this.nodecg.log.debug('[RabbitMQ] Some caught channel error:', err);
                }
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
        return __awaiter(this, void 0, void 0, function () {
            var newData, fullKey, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.config.enabled) {
                            // RabbitMQ not enabled, don't even try to send.
                            return [2 /*return*/];
                        }
                        if (!this.chan && !this.useTestData) {
                            this.nodecg.log.debug('[RabbitMQ] Could not send message as channel is not defined');
                            return [2 /*return*/];
                        }
                        newData = __assign(__assign({}, data), {
                            event: this.event,
                            time: getTimeInfo(),
                        });
                        fullKey = "".concat(this.event, ".").concat(key);
                        if (!(this.chan && !this.useTestData)) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.chan.publish(this.exchange, fullKey, Buffer.from(JSON.stringify(newData)), { persistent: true })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        this.nodecg.log.warn('[RabbitMQ] Error sending message, YOU MAY NEED TO RESTART NODECG!');
                        this.nodecg.log.debug('[RabbitMQ] Error sending message, YOU MAY NEED TO RESTART NODECG!:', err_1);
                        return [3 /*break*/, 4];
                    case 4:
                        this.nodecg.log.debug('[RabbitMQ] Sending message with routing key: %s: %s', fullKey, JSON.stringify(newData));
                        return [2 /*return*/];
                }
            });
        });
    };
    return RabbitMQ;
}());
module.exports = RabbitMQ;
