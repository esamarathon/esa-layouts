import { NodeCG } from '../../../../types/server';
import * as nodecgApiContext from './util/nodecg-api-context';

export = (nodecg: NodeCG) => {
  nodecgApiContext.set(nodecg);

  // MUST BE DONE FIRST!
  require('./util/rabbitmq'); // temp?

  require('./tracker');
  require('./stream-deck-buttons');
  require('./timer');
};
