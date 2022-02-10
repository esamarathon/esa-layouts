import type { Configschema } from '@esa-layouts/types/schemas/configschema';
import { logError, wait } from './util/helpers';
import { get as nodecg } from './util/nodecg';
import obs from './util/obs';
import { currentRunDelay, obsData } from './util/replicants';
import x32 from './util/x32';

const config = (nodecg().bundleConfig as Configschema);

function getNonGameScenes(): string[] {
  // These scenes will *not* have "LIVE Game/Mics" DCAs audible.
  return [
    obs.findScene(config.obs.names.scenes.commercials),
    obs.findScene(config.obs.names.scenes.intermission),
    obs.findScene(config.obs.names.scenes.intermissionPlayer),
    obs.findScene(config.obs.names.scenes.countdown),
  ].filter(Boolean) as string[];
}

export function setFaderName(fader: string, name: string): void {
  if (config.x32.enabled) {
    x32.conn?.send({
      address: `${fader}/config/name`,
      args: [{ type: 's', value: name }],
    });
  }
}

function toggleFadeHelper(
  address: string,
  scenes: (string | undefined)[],
  data: { 'from-scene'?: string, 'to-scene': string },
  mute = true,
  nofade = false,
): void {
  try {
    let scene1 = scenes.includes(data['to-scene']);
    let scene2 = scenes.includes(data['from-scene']);
    if (!mute) {
      scene1 = scenes.includes(data['from-scene']);
      scene2 = scenes.includes(data['to-scene']);
    }
    if (scene1 && !scene2) {
      if (nofade) {
        x32.setFader(address, 0);
      } else {
        x32.fade(address, 0.75, 0, 1000);
      }
    } else if (!scene1 && scene2) {
      if (nofade) {
        x32.setFader(address, 0.75);
      } else {
        x32.fade(address, 0, 0.75, 1000);
      }
    }
  } catch (err) {
    logError(
      '[Mixer] Error toggling fader [address: %s, scenes: %s, data: %s]',
      err,
      address,
      scenes,
      data,
    );
  }
}

export function toggleLiveMics(scene: string): void {
  const nonGameScenes = getNonGameScenes();
  const fromScene = obsData.value.scene;
  const toScene = obs.findScene(scene);
  if (fromScene && toScene) {
    toggleFadeHelper('/dca/2/fader', nonGameScenes, {
      'from-scene': fromScene, 'to-scene': toScene,
    });
  }
}

let init = false;
async function setInitialFaders(): Promise<void> {
  await wait(1000); // Waiting 1s as a workaround to make sure the OBS helper has all info.
  if (!init && obs.connected && x32.ready) {
    init = true;
    // On-Site
    if (!config.event.online) {
      const readerScenes = [
        obs.findScene(config.obs.names.scenes.commercials),
        obs.findScene(config.obs.names.scenes.gameLayout),
        obs.findScene(config.obs.names.scenes.intermission),
        obs.findScene(config.obs.names.scenes.readerIntroduction),
      ].filter(Boolean) as string[];
      // These scenes will have the game and players audible.
      const gameScenes = [
        obs.findScene(config.obs.names.scenes.gameLayout),
      ].filter(Boolean) as string[];
      if (readerScenes.includes(obs.currentScene || '')) {
        x32.setFader('/dca/2/fader', 0.75); // LIVE Readers
      } else {
        x32.setFader('/dca/2/fader', 0); // LIVE Readers
      }
      if (gameScenes.includes(obs.currentScene || '')) {
        x32.setFader('/dca/1/fader', 0.75); // LIVE Runners
        x32.setFader('/dca/3/fader', 0.75); // LIVE Games
      } else {
        x32.setFader('/dca/1/fader', 0); // LIVE Runners
        x32.setFader('/dca/3/fader', 0); // LIVE Games
      }
    }
  }
}

x32.on('ready', async () => {
  await setInitialFaders();
});
obs.conn.on('AuthenticationSuccess', async () => {
  await setInitialFaders();
});

obs.conn.on('TransitionBegin', async (data) => {
  if (config.x32.enabled) {
    // On-Site
    if (!config.event.online) {
      // These scenes will have the reader audible.
      const readerScenes = [
        obs.findScene(config.obs.names.scenes.commercials),
        obs.findScene(config.obs.names.scenes.gameLayout),
        obs.findScene(config.obs.names.scenes.intermission),
        obs.findScene(config.obs.names.scenes.readerIntroduction),
      ].filter(Boolean) as string[];
      // These scenes will have the game and players audible.
      const gameScenes = [
        obs.findScene(config.obs.names.scenes.gameLayout),
      ].filter(Boolean) as string[];
      toggleFadeHelper('/dca/1/fader', gameScenes, data, false); // LIVE Runners
      toggleFadeHelper('/dca/2/fader', readerScenes, data, false); // LIVE Readers
      toggleFadeHelper('/dca/3/fader', gameScenes, data, false); // LIVE Games
    // Online
    } if (config.event.online === true || config.event.online === 'full') {
      const nonGameScenes = getNonGameScenes(); // These scenes will *not* have "LIVE" DCAs audible.
      const intermissionScenes = [ // These scenes *will* have "Intrmsn Mics" DCA audible.
        obs.findScene(config.obs.names.scenes.commercials),
        obs.findScene(config.obs.names.scenes.intermission),
      ];
      toggleFadeHelper('/dca/1/fader', nonGameScenes, data);
      if (currentRunDelay.value.audio > 0) {
        setTimeout(() => { // Delayed hard cut as backup!
          toggleFadeHelper('/dca/2/fader', nonGameScenes, data, true, true);
        }, 1500);
      } else {
        toggleFadeHelper('/dca/2/fader', nonGameScenes, data);
      }
      toggleFadeHelper('/dca/3/fader', intermissionScenes, data, false);
    }
  }
});
