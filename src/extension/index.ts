/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */

// This must go first so we can use module aliases!
/* eslint-disable import/first */
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('module-alias').addAlias('@', require('path').join(__dirname, '.'));

import { ExtensionReturn } from '@/types';
import type { Configschema } from '@/types/schemas/configschema';
import { set } from '@/util/nodecg';
import type { NodeCG } from 'nodecg/types/server';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export = (nodecg: NodeCG): ExtensionReturn => {
  set(nodecg);

  // If `thisEvent` is 2, checks if we actually have 2 event shorts to
  // pick from before mounting the extension.
  const config: Configschema = nodecg.bundleConfig;
  if (config.event.thisEvent === 2
  && (typeof config.event.shorts === 'string' || config.event.shorts.length === 1)) {
    throw new Error('event.thisEvent in config is set to 2 but you only '
      + 'have 1 event short at event.shorts');
  }

  const { useTestData } = nodecg.bundleConfig as Configschema;
  if (useTestData) {
    nodecg.log.warn('USING TEST DATA, MAKE SURE TO DISABLE THIS IN PRODUCTION!');
  }

  require('./obs-data');
  require('./layouts');
  require('./tracker');
  require('./misc');
  require('./mixer');
  require('./streamdeck-buttons');
  require('./timer');
  require('./restream');
  require('./media-box');
  require('./text-to-speech');
  require('./twitch-ext');
  require('./music');
  // require('./twitch-subs');

  return {
    obs: require('./util/obs').default,
    setFaderName: require('./mixer').setFaderName,
  };
};
