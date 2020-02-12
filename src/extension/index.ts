/* eslint-disable global-require */

import { NodeCG } from 'nodecg/types/server';
import { set } from './util/nodecg';

export = (nodecg: NodeCG): void => {
  set(nodecg);

  require('./layouts');
  require('./obs-data');
  require('./tracker');
  require('./music');
  require('./misc');
  require('./streamdeck-buttons');
  require('./timer');
  require('./logging');
  require('./sponsors');
  require('./text-to-speech');
  require('./twitch-ext');
  require('./fcb');
  require('./commercials');
};
