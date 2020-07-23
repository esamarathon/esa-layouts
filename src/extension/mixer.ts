import type { Configschema } from 'configschema';
import { get as nodecg } from './util/nodecg';
import obs from './util/obs';
import x32 from './util/x32';

const obsConfig = (nodecg().bundleConfig as Configschema).obs;

obs.conn.on('TransitionBegin', (data) => {
  const silentScenes = [
    obs.findScene(obsConfig.names.scenes.commercials),
    obs.findScene(obsConfig.names.scenes.intermission),
    obs.findScene(obsConfig.names.scenes.videoPlayer),
  ];
  if (silentScenes.includes(data['to-scene']) && !silentScenes.includes(data['from-scene'])) {
    x32.fade('/dca/1/fader', 0.75, 0, 1000);
  } else if (!silentScenes.includes(data['to-scene'])
    && silentScenes.includes(data['from-scene'])) {
    x32.fade('/dca/1/fader', 0, 0.75, 1000);
  }
});
