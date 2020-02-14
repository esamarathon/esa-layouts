/* eslint-disable global-require */

import { NodeCG } from 'nodecg/types/server';
import { set } from './util/nodecg';

export = (nodecg: NodeCG): void => {
  set(nodecg);

  require('./obs-data');
  require('./layouts');
  require('./tracker');
  require('./misc');
  require('./streamdeck-buttons');
  require('./timer');
  require('./sponsors');
  require('./text-to-speech');
  require('./twitch-ext');
  require('./fcb');
  require('./commercials');
  // require('./logging');
};
