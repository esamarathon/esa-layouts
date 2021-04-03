import type { Configschema } from '@esa-layouts/types/schemas/configschema';
import X32 from '@esamarathon/esa-layouts-shared/x32/extension';
import { get as nodecg } from './nodecg';

const x32 = new X32(nodecg(), (nodecg().bundleConfig as Configschema).x32);
export default x32;
