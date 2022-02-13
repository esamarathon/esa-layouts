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
 * Generates a promise that waits the length (in milliseconds) supplied.
 * @param length Length to wait in milliseconds
 * @returns A promise.
 */
export async function wait(length: number): Promise<void> {
  return new Promise((res) => { setTimeout(res, length); });
}

/**
 * Returns the current event short according to the configuration file.
 */
export function getCurrentEventShort(): string {
  if (!Array.isArray(config.event.shorts)) return config.event.shorts;
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function logError(msg: string, err: any, ...args: unknown[]): void {
  const msgWithArgs = util.format(msg, ...args);
  nodecg().log.warn(msgWithArgs);
  nodecg().log.debug(`${msgWithArgs}: %s`, err);
}

/**
 * Takes the basic speedrun.com pronouns string and formats it for the layouts.
 * @param pronouns Pronouns string from speedrun.com, if any
 * @returns Formatted string, or undefined if the input was also undefined.
 */
export function formatSrcomPronouns(pronouns?: string): string | undefined {
  if (!pronouns) return undefined;
  const split = pronouns.split(',').map((p) => p.trim().toLowerCase());
  if (split.length > 1) {
    if (split.includes('he/him') && split.includes('she/her') && !split.includes('they/them')) {
      return 'he or she';
    }
    const list: string[] = [];
    if (split.includes('he/him')) list.push('he');
    if (split.includes('she/her')) list.push('she');
    if (split.includes('they/them')) list.push('they');
    return list.join('/');
  }
  return split[0];
}

/**
 * Simple formatter for displaying USD amounts.
 * @param amount Amount as a integer/float.
 * @param noCents Never display cents, even if under $100.
 */
export function formatUSD(amount: number, noCents = false): string {
  if (amount >= 100 || noCents) {
    return `$${Math.floor(amount).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  }
  return `$${amount.toFixed(2)}`;
}
