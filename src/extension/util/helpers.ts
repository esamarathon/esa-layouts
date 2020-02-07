/* eslint-disable import/prefer-default-export */

/**
 * Checks if number needs a 0 adding to the start and does so if needed.
 * @param num Number which you want to turn into a padded string.
 */
export function padTimeNumber(num: number): string {
  return num.toString().padStart(2, '0');
}
