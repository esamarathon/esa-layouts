import X32 from '@shared/extension/x32';
import { get as nodecg } from './nodecg';

const x32 = new X32(nodecg(), nodecg().bundleConfig.x32);
export default x32;
