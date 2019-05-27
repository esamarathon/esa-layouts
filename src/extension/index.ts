import { NodeCG } from '../../../../types/server';
import * as nodecgUtils from './util/nodecg';

export = (nodecg: NodeCG) => {
  nodecgUtils.setCtx(nodecg);

  // MUST BE DONE FIRST!
  require('./util/rabbitmq'); // temp?

  require('./tracker');
  require('./emotes');
  require('./stream-deck-buttons');
  require('./timer');
};
