import { InstanceBase, InstanceStatus, SomeCompanionConfigField, runEntrypoint } from '@companion-module/base';
import initActions from './actions';
import { Config, getConfigFields } from './config';
import initFeedbacks from './feedbacks';
import upgradeScripts from './upgrades';
import initVariables from './variables';

class ModuleInstance extends InstanceBase<Config> {
  config: Config;

  /**
   * The usual JS class constructor.
   * @param internal ??? Unsure but needs to be passed into "super"
   */
  constructor(internal: unknown) {
    super(internal);
    this.config = {};
  }

  /**
   * Called when the module instance is OK to start setting up.
   * @param config The initial configuration object
   * @param isFirstInit ??? Unsure when this changes
   */
  async init(config: Config, isFirstInit: boolean) {
    this.config = config;
    initVariables(this);
    initFeedbacks(this);
    initActions(this);
    this.updateStatus(InstanceStatus.Ok);
  }

  /**
   * Called when this module instance is going to be destroyed, to do clean up.
   */
  async destroy() {
    this.log('debug', `destroy ${this.id}`);
  }

  /**
   * Called when the user updates the configuration of this module instance in Companion.
   * @param config The updated configuration object
   */
  async configUpdated(config: Config) {
    this.config = config;
  }

  /**
   * Called when the user configuration of this module instance in Companion needs to be created.
   * @returns The configuration array
   */
  // eslint-disable-next-line class-methods-use-this
  getConfigFields(): SomeCompanionConfigField[] {
    return getConfigFields();
  }
}

// Sets up the module for execution.
runEntrypoint(ModuleInstance, upgradeScripts);
