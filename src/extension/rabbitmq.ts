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

nodecg.log.info('Setting up RabbitMQ Connection.');
amqplib.connect(options).then((conn) => {
  nodecg.log.info('RabbitMQ connection successful.');
}).catch((err) => {
  nodecg.log.warn('RabbitMQ connection error: ', err);
});
