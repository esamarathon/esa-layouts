import needle from 'needle';
import { Emotes } from '../../schemas';
import * as nodecgApiContext from './util/nodecg-api-context';

const nodecg = nodecgApiContext.get();
const refreshTime = 1800000; // Get emotes every 30m.
const url = 'https://twitchemotes.com/api_cache/v3/global.json';
const emotes = nodecg.Replicant<Emotes>('emotes');

getTwitchEmotes();
setInterval(getTwitchEmotes, refreshTime);

// Get Twitch global emoticons.
async function getTwitchEmotes() {
  try {
    const resp = await needle('get', url);
    if (resp.statusCode === 200) {
      emotes.value = resp.body;
    } else {
      nodecg.log.warn('Error updating Twitch emoticons (%s).', resp.statusCode);
    }
  } catch (err) {
    nodecg.log.warn('Error updating Twitch emoticons.');
    nodecg.log.debug('Error updating Twitch emoticons:', err);
  }
}
