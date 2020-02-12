/* eslint-disable global-require */

import { NodeCG } from 'nodecg/types/server';
import { set } from './util/nodecg';

export = (nodecg: NodeCG): void => {
  set(nodecg);

  require('./layouts');
  require('./tracker');
  require('./music');
  require('./misc-data');
  require('./streamdeck-buttons');
  require('./timer');
  require('./logging');
  require('./sponsors');
  require('./text-to-speech');
  require('./twitch-ext');
  require('./fcb');
  require('./commercials');
};
