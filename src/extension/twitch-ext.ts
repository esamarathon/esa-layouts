import type { Configschema } from '@esa-layouts/types/schemas/configschema';
import _ from 'lodash';
import needle from 'needle';
import { get as nodecg } from './util/nodecg';
import { twitchAPIData } from './util/replicants';

const config = (nodecg().bundleConfig as Configschema).twitchExt;

async function setChannels(usernames: string[]): Promise<void> {
  nodecg().log.info('[Twitch Ext] Attempting to update');
  try {
    const resp = await needle(
      'get',
      `https://api.furious.pro/featuredchannels/bot/${config.token}/${usernames.join(',')}`,
    );

    if (resp.statusCode === 200) {
      nodecg().log.info('[Twitch Ext] Successfully updated');
    } else {
      throw new Error(`Status Code ${resp.statusCode}`);
    }
  } catch (err) {
    nodecg().log.warn('[Twitch Ext] Error updating');
    nodecg().log.debug('[Twitch Ext] Error updating:', err);
  }
}

if (config.enable && config.token) {
  // Poor way of doing this, should change in the future/include in nodecg-speedcontrol.
  twitchAPIData.on('change', (newV, oldV) => {
    if (oldV && !_.isEqual(_.sortBy(newV.featuredChannels), _.sortBy(oldV.featuredChannels))) {
      setChannels(newV.featuredChannels);
    }
  });
}
