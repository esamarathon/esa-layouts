import type { Configschema } from '@esa-layouts/types/schemas/configschema';
import util from 'util';
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

/**
 * Error log helper that logs a basic warn but a more detailed debug.
 * @param msg String to be logged.
 * @param err Error to be logged.
 * @param args List of argments to be supplied/substitued in the msg string.
 */
export function logError(msg: string, err: Error, ...args: unknown[]): void {
  const msgWithArgs = util.format(msg, ...args);
  nodecg().log.warn(msgWithArgs);
  nodecg().log.debug(`${msgWithArgs}: %s`, err);
}

// ALSO IN graphics/_misc/helpers.ts, CHANGE THERE TOO!
export function formatPronouns(pronouns?: string): string | undefined {
  if (!pronouns) {
    return undefined;
  }
  const split = pronouns.split(',').map((p) => p.trim().toLowerCase());
  if (split.length > 1) {
    if (split.includes('he/him') && split.includes('she/her') && !split.includes('they/them')) {
      return 'he or she';
    }
    const list: string[] = [];
    if (split.includes('he/him')) {
      list.push('he');
    }
    if (split.includes('she/her')) {
      list.push('she');
    }
    if (split.includes('they/them')) {
      list.push('they');
    }
    return list.join('/');
  }
  return split[0];
}
