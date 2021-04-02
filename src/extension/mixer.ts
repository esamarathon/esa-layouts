import type { Configschema } from '@/types/schemas/configschema';
import { logError } from './util/helpers';
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
    obs.findScene(config.obs.names.scenes.videoPlayer),
    obs.findScene(config.obs.names.scenes.countdown),
  ].filter(Boolean) as string[];
}

export function setFaderName(fader: string, name: string): void {
  if (config.x32.enable) {
    x32.conn?.send({
      address: `${fader}/config/name`,
      args: [{ type: 's', value: name }],
    });
  }
}

function toggleFadeHelper(
  address: string,
  scenes: (string | undefined)[],
  data: { 'from-scene': string, 'to-scene': string },
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
      err, address, scenes, data,
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

if (config.x32.enable && config.event.online !== 'partial') {
  obs.conn.on('TransitionBegin', async (data) => {
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
  });
}
