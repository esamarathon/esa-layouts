import * as nodecgApiContext from './nodecg-api-context';
import obsWebsocketJs from 'obs-websocket-js';

const nodecg = nodecgApiContext.get();
const obs = new obsWebsocketJs();
const settings = {
  address: nodecg.bundleConfig.obs.address,
  password: nodecg.bundleConfig.obs.password,
};

if (nodecg.bundleConfig.obs.enable) {
  nodecg.log.info('Setting up OBS connection.');
  connect();
  obs.on('ConnectionClosed', () => {
    nodecg.log.warn('OBS connection lost, retrying in 5 seconds.');
    setTimeout(connect, 5000);
  });

  // @ts-ignore: Pretty sure this emits an error.
  obs.on('error', (err: Error) => {
    nodecg.log.warn('OBS connection error: ', err);
  });
}

function connect() {
  obs.connect(settings).then(() => {
    nodecg.log.info('OBS connection successful.');
  }).catch((err) => {
    nodecg.log.warn('OBS connection error: ', err);
  });
}

export default obs;
