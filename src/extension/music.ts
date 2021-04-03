import { Configschema } from '@esa-layouts/types/schemas/configschema';
import Music from '@esamarathon/esa-layouts-shared/music/extension';
import { get as nodecg } from './util/nodecg';
import obs from './util/obs';

const config = (nodecg().bundleConfig as Configschema).music;
const music = new Music(nodecg(), config);

// Listen to OBS transitions to play/pause correctly.
obs.conn.on('TransitionBegin', (data) => {
  if (data['to-scene']) {
    if (data['to-scene'].endsWith('[M]')) {
      music.play();
    } else {
      music.pause();
    }
  }
});
