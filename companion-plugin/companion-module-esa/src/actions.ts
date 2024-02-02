import type ModuleInstance from './index';

/**
 * Called by module instance class when actions should be set up.
 * @param instance Copy of current module instance class
 */
function initActions(instance: ModuleInstance) {
  instance.setActionDefinitions({
    // set up actions here
  });
}
export default initActions;
