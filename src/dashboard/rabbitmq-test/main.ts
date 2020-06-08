import type { Configschema } from 'configschema';
import Component from 'esa-layouts-shared/rabbitmq/dashboard';

const config = (nodecg.bundleConfig as Configschema);

Component(config.rabbitmq.enable, config.useTestData);
