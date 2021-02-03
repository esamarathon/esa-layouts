import type { Configschema } from 'configschema';
import type { NodeCG } from 'nodecg/types/server';
import { set } from './util/nodecg';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export = (nodecg: NodeCG): { obs: any } => {
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
  require('./obsn');
  // require('./twitch-subs');

  return {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    obs: require('./util/obs').default,
  };
};
