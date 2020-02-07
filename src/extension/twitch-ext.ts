import { Configschema } from 'configschema';
import _ from 'lodash';
import needle from 'needle';
import { TwitchAPIData } from '../../../nodecg-speedcontrol/schemas';
import { get as nodecg } from './util/nodecg';

const config = (nodecg().bundleConfig as Configschema).twitchExt;
const apiData = nodecg().Replicant<TwitchAPIData>('twitchAPIData', 'nodecg-speedcontrol');

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
  apiData.on('change', (newVal, oldVal) => {
    if (oldVal && _.isEqual(_.sortBy(newVal.featuredChannels), _.sortBy(oldVal.featuredChannels))) {
      setChannels(newVal.featuredChannels);
    }
  });
}
