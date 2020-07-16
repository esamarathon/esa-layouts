import type { Configschema } from 'configschema';
import Restream from 'esa-layouts-shared/restream/extension';
import { get as nodecg } from './util/nodecg';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const restream = new Restream(nodecg(), true, (nodecg().bundleConfig as Configschema).restream);
