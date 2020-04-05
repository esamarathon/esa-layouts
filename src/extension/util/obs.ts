import { Configschema } from 'configschema';
import obsWebsocketJs from 'obs-websocket-js';
import { findBestMatch } from 'string-similarity';
import { get as nodecg } from './nodecg';

const config = (nodecg().bundleConfig as Configschema).obs;

// Extending the OBS library with some of our own functions.
class OBSUtility extends obsWebsocketJs {
  /**
   * Change to the OBS scene with the closest matched name.
   * @param name Name of the scene.
   * @param ignore Ignore scene if it has this name.
   */
  async changeScene(name: string): Promise<void> {
    if (!config.enable) {
      // OBS not enabled, don't even try to set.
      throw new Error('No OBS connection available');
    }
    try {
      const sceneList = await this.send('GetSceneList');
      const scenes = sceneList.scenes.map((s) => s.name);
      const match = findBestMatch(name, scenes);
      // This rating threshold should be upped, but not too important right now.
      if (match.bestMatch.rating > 0) {
        await this.send('SetCurrentScene', { 'scene-name': match.bestMatch.target });
      } else {
        throw new Error('Scene could not be found');
      }
    } catch (err) {
      nodecg().log.warn(`[OBS] Cannot change scene [${name}]: ${err.error || err}`);
      throw err;
    }
  }

  /**
   * Modify a sources settings.
   * @param sourceName Name of the source.
   * @param sourceType Source type (has the be the internal name, not the display name).
   * @param sourceSettings Settings you wish to pass to OBS to change.
   */
  // eslint-disable-next-line max-len
  async setSourceSettings(sourceName: string, sourceType: string, sourceSettings: {}): Promise<void> {
    if (!config.enable) {
      // OBS not enabled, don't even try to set.
      throw new Error('No OBS connection available');
    }
    try {
      await this.send('SetSourceSettings', {
        sourceName,
        sourceType,
        sourceSettings,
      });
    } catch (err) {
      nodecg().log.warn(`[OBS] Cannot set source settings [${sourceName}]: ${err.error || err}`);
      throw err;
    }
  }
}

const obs = new OBSUtility();
const settings = {
  address: config.address,
  password: config.password,
};

async function connect(): Promise<void> {
  try {
    await obs.connect(settings);
    obs.send('SetHeartbeat', { enable: true });
    nodecg().log.info('[OBS] Connection successful');
  } catch (err) {
    nodecg().log.warn('[OBS] Connection error');
    nodecg().log.debug('[OBS] Connection error:', err);
  }
}

if (config.enable) {
  nodecg().log.info('[OBS] Setting up connection');
  connect();
  obs.on('ConnectionClosed', () => {
    nodecg().log.warn('[OBS] Connection lost, retrying in 5 seconds');
    setTimeout(connect, 5000);
  });

  // @ts-ignore: Pretty sure this emits an error.
  obs.on('error', (err) => {
    nodecg().log.warn('[OBS] Connection error');
    nodecg().log.debug('[OBS] Connection error:', err);
  });
}

export default obs;
