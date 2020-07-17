import type { Configschema } from 'configschema';
import Restream from 'esa-layouts-shared/restream/extension';
import SpeedcontrolUtil from 'speedcontrol-util';
import { get as nodecg } from './util/nodecg';

const sc = new SpeedcontrolUtil(nodecg());
const restream = new Restream(nodecg(), true, (nodecg().bundleConfig as Configschema).restream);

// Change streams when run changes but not on server (re)start.
let init = false;
sc.runDataActiveRun.on('change', async (newVal, oldVal) => {
  if (init && newVal?.id !== oldVal?.id) {
    nodecg().log.info('[Restream] Attempting to update channels from run change');
    const channels = newVal?.teams.map((t) => (
      t.players[0] && t.players[0].social.twitch ? t.players[0].social.twitch : undefined
    )) || [];
    restream.updateMultipleInstances(channels);
  }
  init = true;
});
