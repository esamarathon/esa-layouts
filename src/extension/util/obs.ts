import obsWebsocketJs from 'obs-websocket-js';
import * as nodecgApiContext from './nodecg-api-context';

interface ItemPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  croptop: number;
  cropright: number;
  cropbottom: number;
  cropleft: number;
}

// Extending the OBS library with some of our own functions.
class OBSUtility extends obsWebsocketJs {
  constructor() {
    super();
  }

  /**
   * Change to this OBS scene.
   * @param name Name of the scene.
   */
  changeScene(name: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.send('SetCurrentScene', { 'scene-name': name }).then(resolve).catch((err) => {
        nodecg.log.warn(`Cannot change OBS scene [${name}]: ${err.error}`);
        reject();
      });
    });
  }

  /**
   * Hide this item in the specified OBS scene.
   * @param item Name of the item.
   * @param scene Name of the scene.
   */
  hideItemInScene(item: string, scene: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // @ts-ignore: Typings say we need to specify *everything* when we really don't.
      this.send('SetSceneItemProperties', {
        item,
        visible: false,
        'scene-name': scene,
      }).then(resolve).catch((err: { error: any; }) => {
        nodecg.log.warn(`Cannot hide OBS item [${scene}: ${item}]: ${err.error}`);
        reject();
      });
    });
  }

  /**
   * Set up game/camera capture in specified OBS scene; turns on, repositions and resizes.
   * @param item Name of the item.
   * @param scene Name of the scene.
   * @param position Position details (x/y/width/height/cropping).
   */
  setUpCaptureInScene(item: string, scene: string, position: ItemPosition): Promise<void> {
    return new Promise((resolve, reject) => {
      this.send('SetSceneItemProperties', {
        item,
        visible: true,
        'scene-name': scene,
        // @ts-ignore: See above.
        position: {
          x: position.x,
          y: position.y,
        },
        // @ts-ignore: See above.
        bounds: {
          x: position.width,
          y: position.height,
        },
        crop: {
          top: position.croptop,
          right: position.cropright,
          bottom: position.cropbottom,
          left: position.cropleft,
        }
      }).then(resolve).catch((err: { error: any; }) => {
        nodecg.log.warn(`Cannot setup OBS item [${scene}: ${item}]: ${err.error}`);
        reject();
      });
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
    nodecg.log.debug('OBS connection error:', err);
  });
}

function connect() {
  obs.connect(settings).then(() => {
    nodecg.log.info('OBS connection successful.');
  }).catch((err) => {
    nodecg.log.warn('OBS connection error.');
    nodecg.log.debug('OBS connection error:', err);
  });
}

export default obs;
