import { Configschema } from 'configschema';
import { get as nodecg } from './nodecg';

const config = nodecg().bundleConfig as Configschema;

/**
 * Checks if number needs a 0 adding to the start and does so if needed.
 * @param num Number which you want to turn into a padded string.
 */
export function padTimeNumber(num: number): string {
  return num.toString().padStart(2, '0');
}

/**
 * Returns the current event short according to the configuration file.
 */
export function getCurrentEventShort(): string {
  if (!Array.isArray(config.tracker.events)) {
    return config.tracker.events;
  }
  return config.tracker.events[config.tracker.streamEvent - 1];
}
