import { InstanceBase } from '@companion-module/base';
import { Config } from './config';

/**
 * Called by module instance class when feedbacks should be set up.
 * @param instance Copy of current module instance class
 */
function initFeedbacks(instance: InstanceBase<Config>) {
  instance.setFeedbackDefinitions({
    // set up feedbacks here
  });
}
export default initFeedbacks;
