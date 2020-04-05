import { Configschema } from 'configschema';
import { EventEmitter } from 'events';
import ObsWebsocketJs from 'obs-websocket-js';
import { findBestMatch } from 'string-similarity';
import { get as nodecg } from './nodecg';

const config = (nodecg().bundleConfig as Configschema).obs;

interface OBS {
  on(event: 'currentSceneChanged', listener: (currentScene?: string) => void): this;
  on(event: 'sceneListChanged', listener: (sceneList: string[]) => void): this;
}

class OBS extends EventEmitter {
  conn = new ObsWebsocketJs();
  currentScene: string | undefined;
  sceneList: string [] = [];
  settings = {
    address: config.address,
    password: config.password,
  };

  constructor() {
    super();
    if (config.enable) {
      nodecg().log.info('[OBS] Setting up connection');
      this.connect();

      this.conn.on('ConnectionClosed', () => {
        this.currentScene = undefined;
        this.sceneList.length = 0;
        this.emit('currentSceneChanged', this.currentScene);
        this.emit('sceneListChanged', this.sceneList);
        nodecg().log.warn('[OBS] Connection lost, retrying in 5 seconds');
        setTimeout(this.connect, 5000);
      });

      this.conn.on('SwitchScenes', (data) => {
        this.currentScene = data['scene-name'];
        this.emit('currentSceneChanged', this.currentScene);
      });

      this.conn.on('ScenesChanged', async () => {
        const scenes = await this.conn.send('GetSceneList');
        this.sceneList = scenes.scenes.map((s) => s.name);
      });

      // @ts-ignore: Pretty sure this emits an error.
      this.conn.on('error', (err) => {
        nodecg().log.warn('[OBS] Connection error');
        nodecg().log.debug('[OBS] Connection error:', err);
      });
    }
  }

  async connect(): Promise<void> {
    try {
      await this.conn.connect(this.settings);
      await this.conn.send('SetHeartbeat', { enable: true });
      const scenes = await this.conn.send('GetSceneList');
      this.currentScene = scenes['current-scene'];
      this.sceneList = scenes.scenes.map((s) => s.name);
      this.emit('currentSceneChanged', this.currentScene);
      this.emit('sceneListChanged', this.sceneList);
      nodecg().log.info('[OBS] Connection successful');
    } catch (err) {
      nodecg().log.warn('[OBS] Connection error');
      nodecg().log.debug('[OBS] Connection error:', err);
    }
  }

  /**
   * Find scene based on string; at least the start of the name should be supplied.
   * @param name Name of scene, at least starting of name.
   */
  // eslint-disable-next-line class-methods-use-this
  findScene(name: string): string | undefined {
    let match: string | undefined;
    const matches = this.sceneList.filter((s) => s.startsWith(name));
    if (matches.length > 1) {
      const bestMatches = findBestMatch(name, matches);
      match = bestMatches.bestMatch.target;
    } else if (matches.length === 0) {
      [match] = matches;
    }
    return match;
  }

  /**
   * Check if we are on a specified scene; at least the start of the name should be supplied.
   * @param name Name of scene to check we are on, at least starting of name.
   */
  isCurrentScene(name: string): boolean {
    return !!this.currentScene && this.currentScene === this.findScene(name);
  }

  /**
   * Change to the OBS scene with the closest matched name.
   * @param name Name of the scene.
   */
  async changeScene(name: string): Promise<void> {
    if (!config.enable) {
      // OBS not enabled, don't even try to set.
      throw new Error('No OBS connection available');
    }
    try {
      const scene = this.findScene(name);
      if (scene) {
        await this.conn.send('SetCurrentScene', { 'scene-name': scene });
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
      await this.conn.send('SetSourceSettings', {
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

const obs = new OBS();
export default obs;
