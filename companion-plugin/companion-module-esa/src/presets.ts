import { InstanceBase } from '@companion-module/base';
import { Config } from './config';

/**
 * Called by module instance class when presets should be set up.
 * @param instance Copy of current module instance class
 */
function initPresets(instance: InstanceBase<Config>) {
  instance.setPresetDefinitions({
    // set up presets here
  });
}

export default initPresets;
