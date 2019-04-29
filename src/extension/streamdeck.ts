import * as nodecgApiContext from './util/nodecg-api-context';
import streamdeckUtil from 'streamdeck-util';

const nodecg = nodecgApiContext.get();

const sd = new streamdeckUtil({
  key: nodecg.bundleConfig.streamdeck.key,
  port: nodecg.bundleConfig.streamdeck.port,
  debug: nodecg.bundleConfig.streamdeck.debug,
});

sd.on('init', () => {
  // connection initilized
});