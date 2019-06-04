import obsWebsocketJs from 'obs-websocket-js';
import * as nodecgApiContext from './nodecg-api-context';

// Extending the OBS library with some of our own functions.
class OBSUtility extends obsWebsocketJs {
  constructor() {
    super();
  }

  /**
   * Change to this scene in OBS.
   * @param name Name of the scene.
   */
  changeScene(name: string) {
    this.send('SetCurrentScene', { 'scene-name': name }).catch((err) => {
      nodecg.log.warn(`Cannot change OBS scene [${name}]: ${err.error}`);
    });
  }
}

const nodecg = nodecgApiContext.get();
const obs = new OBSUtility();
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
  obs.on('error', (err) => {
    nodecg.log.warn('OBS connection error.');
    nodecg.log.debug('OBS connection error:\n', err);
  });
}

function connect() {
  obs.connect(settings).then(() => {
    nodecg.log.info('OBS connection successful.');
  }).catch((err) => {
    nodecg.log.warn('OBS connection error.');
    nodecg.log.debug('OBS connection error:\n', err);
  });
}

export default obs;
