import needle from 'needle';
import * as nodecgApiContext from './util/nodecg-api-context';
import { bundleConfig } from './util/nodecg-bundleconfig';

const nodecg = nodecgApiContext.get();

if (bundleConfig.twitchExt.enable && bundleConfig.twitchExt.token) {
  nodecg.listenFor('ffzUpdateFeaturedChannels', 'nodecg-speedcontrol', setButtons);
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
