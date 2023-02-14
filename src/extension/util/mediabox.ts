import MediaBox from '@shared/extension/mediabox';
import { get as nodecg } from './nodecg';
import obs from './obs';
import { mq } from './rabbitmq';

const mb = new MediaBox(nodecg(), mq.evt, obs, nodecg().bundleConfig.obs);
export default mb;
