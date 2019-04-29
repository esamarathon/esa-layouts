import { NodeCG } from '../../../../types/server';
import * as nodecgApiContext from './util/nodecg-api-context';

export = (nodecg: NodeCG) => {
  nodecgApiContext.set(nodecg);

  require('./streamdeck');
  require('./rabbitmq');
};