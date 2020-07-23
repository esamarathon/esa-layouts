import type { Configschema } from 'configschema';
import X32 from 'esa-layouts-shared/x32/extension';
import { get as nodecg } from './nodecg';

const config = (nodecg().bundleConfig as Configschema).x32;
const x32 = new X32(nodecg(), config.ip, ['/dca/1/fader']);
export default x32;
