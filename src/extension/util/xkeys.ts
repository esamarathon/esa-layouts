import type { Configschema } from '@esa-layouts/types/schemas/configschema';
import XKeysClass from '@shared/extension/xkeys-esa';
import { get as nodecg } from './nodecg';

const xkeys = new XKeysClass(nodecg(), (nodecg().bundleConfig as Configschema).xkeys);
export default xkeys;
