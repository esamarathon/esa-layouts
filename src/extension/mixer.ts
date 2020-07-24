import type { Configschema } from 'configschema';
import { get as nodecg } from './util/nodecg';
import obs from './util/obs';
import x32 from './util/x32';

const obsConfig = (nodecg().bundleConfig as Configschema).obs;
const config = (nodecg().bundleConfig as Configschema).x32;

if (config.enable) {
  obs.conn.on('TransitionBegin', (data) => {
    const silentScenes = [
      obs.findScene(obsConfig.names.scenes.commercials),
      obs.findScene(obsConfig.names.scenes.intermission),
      obs.findScene(obsConfig.names.scenes.videoPlayer),
      obs.findScene(obsConfig.names.scenes.countdown),
    ];
    try {
      if (silentScenes.includes(data['to-scene']) && !silentScenes.includes(data['from-scene'])) {
        x32.fade('/dca/1/fader', 0.75, 0, 1000);
      } else if (!silentScenes.includes(data['to-scene'])
        && silentScenes.includes(data['from-scene'])) {
        x32.fade('/dca/1/fader', 0, 0.75, 1000);
      }
    } catch (err) {
      nodecg().log.warn('[Mixer] Could not change mixer fader');
      nodecg().log.debug('[Mixer] Could not change mixer fader:', err);
    }
  });
}
