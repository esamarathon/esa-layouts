import needle from 'needle';
import { TwitchAPIData } from '../../../nodecg-speedcontrol/schemas';
import * as nodecgApiContext from './util/nodecg-api-context';
import { bundleConfig } from './util/nodecg-bundleconfig';

const nodecg = nodecgApiContext.get();
const apiData = nodecg.Replicant<TwitchAPIData>('twitchAPIData', 'nodecg-speedcontrol');

if (bundleConfig.twitchExt.enable && bundleConfig.twitchExt.token) {
  // bad way of doing this, we need to change in the future
  apiData.on('change', (newVal, oldVal) => {
    if (oldVal && newVal.featuredChannels.toString() !== oldVal.featuredChannels.toString()) {
      setButtons(newVal.featuredChannels);
    }
  });
}

async function setButtons(usernames: string[]) {
  const userString = (usernames.length) ? usernames.join(',') : '';
  nodecg.log.info('Attempting to update Twitch extension "Featured Channels" information.');
  try {
    const resp = await needle(
      'get',
      `https://api.furious.pro/featuredchannels/bot/${bundleConfig.twitchExt.token}/${userString}`,
    );

    if (resp.statusCode === 200) {
      nodecg.log.info('Successfully updated Twitch extension "Featured Channels" information.');
    } else {
      throw new Error('');
    }
  } catch (err) {
    nodecg.log.warn('Error updating Twitch extension "Featured Channels" information.');
  }
}
