import { SomeCompanionConfigField } from '@companion-module/base';

/**
 * Both the interface and the configuration fields below should match!
 */

/**
 * Interface of the configuration types.
 */
export interface Config {
  address?: string;
  key?: string;
}

/**
 * Function that returns the configuration fields.
 * @returns The configuration array
 */
export function getConfigFields(): SomeCompanionConfigField[] {
  return [
    {
      type: 'textinput',
      id: 'address',
      label: 'Address',
      width: 6,
      default: 'localhost:9092',
    },
    {
      type: 'textinput',
      id: 'key',
      label: 'Key',
      width: 6,
      default: 'DEFAULT_KEY',
    },
  ];
}
