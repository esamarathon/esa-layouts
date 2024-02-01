import { SomeCompanionConfigField } from '@companion-module/base';

/**
 * Both the interface and the configuration fields below should match!
 */

/**
 * Interface of the configuration types.
 */
export interface Config {
  // add configuration types here
}

/**
 * Function that returns the configuration fields.
 * @returns The configuration array
 */
export function getConfigFields(): SomeCompanionConfigField[] {
  return [
    // set up configuration fields here
  ];
}
