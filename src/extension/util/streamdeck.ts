import * as nodecgApiContext from './nodecg-api-context';
import streamdeckUtil from 'streamdeck-util';

const nodecg = nodecgApiContext.get();
const sd = new streamdeckUtil();

if (nodecg.bundleConfig.streamdeck.enable) {
  sd.listen({
    key: nodecg.bundleConfig.streamdeck.key,
    port: nodecg.bundleConfig.streamdeck.port,
    debug: nodecg.bundleConfig.streamdeck.debug,
  });

  sd.on('open', () => {
    nodecg.log.info('Stream Deck connection successful.');
  });
  sd.on('close', (code) => {
    nodecg.log.warn('Stream Deck connection lost (%s).', code);
  });
  sd.on('error', (err) => {
    nodecg.log.warn('Stream Deck connection error: ', err);
  });
}

export default sd;
