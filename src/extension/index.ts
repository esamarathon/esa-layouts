import { NodeCG } from 'nodecg/types/server';
import * as nodecgApiContext from './util/nodecg-api-context';

export = (nodecg: NodeCG) => {
  nodecgApiContext.set(nodecg);

  require('./layouts');
  require('./emotes');
  require('./tracker');
  require('./music');
  require('./stream-deck-buttons');
  require('./timer');
  require('./logging');
  require('./sponsors');
  require('./video-player');
  require('./tts-donations');
  require('./twitch-ext');

  return {
    obs: require('./util/obs').default,
  };
};
