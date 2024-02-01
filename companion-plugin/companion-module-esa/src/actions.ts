import { InstanceBase } from '@companion-module/base';
import { Config } from './config';

/**
 * Called by module instance class when ations should be set up.
 * @param instance Copy of current module instance class
 */
function initActions(instance: InstanceBase<Config>) {
  instance.setActionDefinitions({
    // set up actions here
  });
}
export default initActions;
