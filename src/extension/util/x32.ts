import type { Configschema } from 'configschema';
import X32 from 'esa-layouts-shared/x32/extension';
import { get as nodecg } from './nodecg';

const x32 = new X32(nodecg(), (nodecg().bundleConfig as Configschema).x32, ['/dca/1/fader']);
export default x32;
