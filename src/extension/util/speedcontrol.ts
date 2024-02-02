import { SpeedcontrolUtil } from 'speedcontrol-util';
import { get as nodecg } from './nodecg';

// eslint-disable-next-line import/prefer-default-export
export const sc = new SpeedcontrolUtil(nodecg());
