'use strict';

import needle from 'needle';
import { Emotes } from '../../schemas';
import { getCtx } from './util/nodecg';

const nodecg = getCtx();
const refreshTime = 1800000; // Get emotes every 30m.
const twitchURL = 'https://twitchemotes.com/api_cache/v3/global.json';
const emotes = nodecg.Replicant<Emotes>('emotes');

updateEmotes();
function updateEmotes() {
  getTwitchEmotes();
  setTimeout(updateEmotes, refreshTime);
}

// Get Twitch global emoticons.
async function getTwitchEmotes(callback?: Function) {
  const resp = await needle('get', twitchURL);

  if (resp.statusCode === 200) {
    emotes.value = resp.body;
  } else {
    nodecg.log.warn('Error updating Twitch emoticons.');
  }

  if (callback) {
    callback();
  }
}
