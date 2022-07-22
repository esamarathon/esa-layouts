import { SpeedcontrolUtil } from 'speedcontrol-util';
import { get as nodecg } from './nodecg';

// TODO: "any" typecase is temp fix for differing NodeCG versions!
// eslint-disable-next-line import/prefer-default-export
export const sc = new SpeedcontrolUtil(nodecg() as any);
