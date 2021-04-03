import type { Configschema } from '@esa-layouts/types/schemas/configschema';

const config = nodecg.bundleConfig as Configschema;

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
 * Checks if number needs a 0 adding to the start and does so if needed.
 * @param num Number which you want to turn into a padded string.
 */
export function padTimeNumber(num: number): string {
  return num.toString().padStart(2, '0');
}

/**
 * Converts milliseconds into a time string (HH:MM:SS).
 * @param ms Milliseconds you wish to convert.
 */
export function msToTimeStr(ms: number): string {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor(ms / (1000 * 60 * 60));
  return `${padTimeNumber(hours)
  }:${padTimeNumber(minutes)
  }:${padTimeNumber(seconds)}`;
}

/**
 * Simple formatter for displaying USD amounts.
 * @param amount Amount as a integer/float.
 */
export function formatUSD(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

// ALSO IN extension/util/helpers.ts, CHANGE THERE TOO!
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
