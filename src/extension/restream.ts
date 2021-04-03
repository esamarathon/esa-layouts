import type { Configschema } from '@esa-layouts/types/schemas/configschema';
import Restream from '@esamarathon/esa-layouts-shared/restream/extension';
import { queue } from 'async';
import SpeedcontrolUtil from 'speedcontrol-util';
import { get as nodecg } from './util/nodecg';
import obs from './util/obs';

const config = (nodecg().bundleConfig as Configschema);
const { restreamSources } = config.obs.names.sources;
const sc = new SpeedcontrolUtil(nodecg());
const restream = new Restream(nodecg(), true, (nodecg().bundleConfig as Configschema).restream);

if (config.restream.enable) {
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

  if (config.obs.enable) {
    const obsQ = queue(async () => {
      const channels = restream.instances.map((i) => i.channel);
      // If there is a 2nd channel loaded, treat this as 2 player.
      // Otherwise, make stream 1 fill the screen.
      if (channels[1] && Array.isArray(restreamSources) && restreamSources.length >= 2) {
        for (let i = 0; i < channels.length; i += 1) {
          try {
            await obs.configureSceneItem(
              config.obs.names.scenes.gameLayout,
              config.obs.names.sources.restreamSources[i],
              {
                x: i === 0 ? 0 : 960,
                width: 960,
              },
              {
                left: i === 0 ? 0 : 960,
                right: i === 1 ? 0 : 960,
              },
              true,
            );
          } catch { /* catch */ }
        }
      } else {
        if (Array.isArray(restreamSources) && restreamSources[1]) {
          try {
            await obs.configureSceneItem(
              config.obs.names.scenes.gameLayout,
              restreamSources[1],
              undefined,
              undefined,
              false,
            );
          } catch { /* catch */ }
        }
        try {
          await obs.configureSceneItem(
            config.obs.names.scenes.gameLayout,
            Array.isArray(restreamSources) ? restreamSources[0] : restreamSources,
            undefined,
            undefined,
            true,
          );
        } catch { /* catch */ }
      }
    }, 1);

    restream.instances.forEach((instance) => {
      instance.on('channelChange', (channel) => {
        obsQ.push(channel);
      });
    });
  }
}
