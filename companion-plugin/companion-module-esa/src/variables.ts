import { InstanceBase } from '@companion-module/base';
import { Config } from './config';

/**
 * Called by module instance class when variables should be set up.
 * @param instance Copy of current module instance class
 */
function initVariables(instance: InstanceBase<Config>) {
  instance.setVariableDefinitions([
    // set up variables here
  ]);
}
export default initVariables;
