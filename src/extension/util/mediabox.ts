import MediaBox from '@shared/extension/mediabox';
import { get as nodecg } from './nodecg';
import { mq } from './rabbitmq';

const mb = new MediaBox(nodecg(), mq.evt);
export default mb;
