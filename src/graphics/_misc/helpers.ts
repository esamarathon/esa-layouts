import { Configschema } from 'configschema';

const config = nodecg.bundleConfig as Configschema;

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
  if (!Array.isArray(config.event.shorts)) {
    return config.event.shorts;
  }
  return config.event.shorts[config.event.thisEvent - 1];
}

/**
 * Returns the other stream's event short according to the configuration file, if applicable.
 */
export function getOtherStreamEventShort(): string | undefined {
  if (!Array.isArray(config.event.shorts) || config.event.shorts.length === 1) {
    return undefined;
  }
  const eventNumber = config.event.thisEvent === 1 ? 2 : 1;
  return config.event.shorts[eventNumber - 1];
}
