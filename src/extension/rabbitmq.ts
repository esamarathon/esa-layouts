import * as nodecgApiContext from './util/nodecg-api-context';
import amqplib from 'amqplib';

const nodecg = nodecgApiContext.get();

const options: amqplib.Options.Connect = {
  protocol: nodecg.bundleConfig.rabbitmq.protocol,
  hostname: nodecg.bundleConfig.rabbitmq.hostname,
  username: nodecg.bundleConfig.rabbitmq.username,
  password: nodecg.bundleConfig.rabbitmq.password,
  vhost: nodecg.bundleConfig.rabbitmq.vhost,
};

amqplib.connect(options).then((conn) => {
  console.log('rabbitmq connected');
  // connected
}).catch((err) => {
  console.log(err);
  // error
});
