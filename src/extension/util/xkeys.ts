import XKeysClass from '@shared/extension/xkeys-esa';
import { get as nodecg } from './nodecg';

const xkeys = new XKeysClass(nodecg(), nodecg().bundleConfig.xkeys);
export default xkeys;
