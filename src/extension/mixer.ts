import type { Configschema } from 'configschema';
import { logError } from './util/helpers';
import { get as nodecg } from './util/nodecg';
import obs from './util/obs';
import x32 from './util/x32';

const obsConfig = (nodecg().bundleConfig as Configschema).obs;
const config = (nodecg().bundleConfig as Configschema).x32;

export function setFaderName(fader: string, name: string): void {
  if (config.enable) {
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
): void {
  try {
    if (scenes.includes(data['to-scene']) && !scenes.includes(data['from-scene'])) {
      x32.fade(address, 0.75, 0, 1000);
    } else if (!scenes.includes(data['to-scene'])
      && scenes.includes(data['from-scene'])) {
      x32.fade(address, 0, 0.75, 1000);
    }
  } catch (err) {
    logError(
      '[Mixer] Error toggling fader [address: %s, scenes: %s, data: %s]',
      err, address, scenes, data,
    );
  }
}

if (config.enable) {
  obs.conn.on('TransitionBegin', async (data) => {
    const nonGameScenes = [ // These scenes will *not* have "LIVE Game/Mics" DCAs audible.
      obs.findScene(obsConfig.names.scenes.commercials),
      obs.findScene(obsConfig.names.scenes.intermission),
      obs.findScene(obsConfig.names.scenes.videoPlayer),
      obs.findScene(obsConfig.names.scenes.countdown),
    ];
    const intermissionScenes = [ // These scenes *will* have "Intrmsn Mics" DCA audible.
      obs.findScene(obsConfig.names.scenes.commercials),
      obs.findScene(obsConfig.names.scenes.intermission),
    ];
    toggleFadeHelper('/dca/1/fader', nonGameScenes, data);
    toggleFadeHelper('/dca/2/fader', nonGameScenes, data); // TODO: add "negative" delay somehow
    toggleFadeHelper('/dca/3/fader', intermissionScenes, data);
  });
}
