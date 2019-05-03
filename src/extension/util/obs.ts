import * as nodecgApiContext from './nodecg-api-context';
import obsWebsocketJs from 'obs-websocket-js';

const nodecg = nodecgApiContext.get();

const settings = {
  address: nodecg.bundleConfig.obs.address,
  password: nodecg.bundleConfig.obs.password,
};

nodecg.log.info('Setting up OBS connection.');
const obs = new obsWebsocketJs();
connect();
function connect() {
  obs.connect(settings).then(() => {
    nodecg.log.info('OBS connection successful.');
  }).catch((err) => {});
}

obs.on('ConnectionClosed', () => {
  nodecg.log.warn('OBS connection lost, retrying in 5 seconds.');
  setTimeout(connect, 5000);
});

// @ts-ignore: Pretty sure this emits an error.
obs.on('error', (err: Error) => {
  nodecg.log.warn('OBS connection error: ', err);
});

export default obs;
