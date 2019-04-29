"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var nodecgApiContext = __importStar(require("./util/nodecg-api-context"));
var amqplib_1 = __importDefault(require("amqplib"));
var nodecg = nodecgApiContext.get();
var options = {
    protocol: nodecg.bundleConfig.rabbitmq.protocol,
    hostname: nodecg.bundleConfig.rabbitmq.hostname,
    username: nodecg.bundleConfig.rabbitmq.username,
    password: nodecg.bundleConfig.rabbitmq.password,
    vhost: nodecg.bundleConfig.rabbitmq.vhost,
};
amqplib_1.default.connect(options).then(function (conn) {
    console.log('rabbitmq connected');
    // connected
}).catch(function (err) {
    console.log(err);
    // error
});
//# sourceMappingURL=rabbitmq.js.map