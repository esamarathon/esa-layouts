import { CompanionStaticUpgradeScript } from '@companion-module/base';
import { Config } from './config';

/**
 * Upgrade scripts are stored here.
 * Once you add a upgrade script here, remmeber that it cannot be removed!
 */
const upgradeScripts: CompanionStaticUpgradeScript<Config>[] = [
  // set up upgrade scripts here
];
export default upgradeScripts;
