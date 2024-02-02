import { InstanceBase, InstanceStatus, SomeCompanionConfigField, runEntrypoint } from '@companion-module/base';
import { WebSocket } from 'ws';
import initActions from './actions';
import { Config, getConfigFields } from './config';
import initFeedbacks from './feedbacks';
import upgradeScripts from './upgrades';
import initVariables from './variables';

class ModuleInstance extends InstanceBase<Config> {
  config: Config;
  ws: WebSocket | undefined;
  wsReconnectionTimeout: NodeJS.Timeout | undefined;

  /**
   * The usual JS class constructor.
   * @param internal ??? Unsure but needs to be passed into "super"
   */
  constructor(internal: unknown) {
    super(internal);
    this.config = {};
    this.ws = undefined;
    this.wsReconnectionTimeout = undefined;
  }

  /**
   * Function to (re)connect to the WebSocket server in the NodeCG bundle.
   */
  connect() {
    this.updateStatus(InstanceStatus.Connecting);
    if (this.ws) {
      this.ws.close(); // Close current connection if one is active.
      this.ws.removeAllListeners();
    }
    clearTimeout(this.wsReconnectionTimeout);
    this.wsReconnectionTimeout = undefined;

    const address = this.config.address || 'localhost:9092'; // Default
    const key = this.config.key || 'DEFAULT_KEY'; // Default
    this.ws = new WebSocket(`ws://${address}/?key=${key}`);
    this.log('debug', 'Connecting');

    this.ws.on('open', () => {
      this.updateStatus(InstanceStatus.Ok);
      this.log('debug', 'Open');
    });
    this.ws.on('error', (err) => {
      this.updateStatus(InstanceStatus.ConnectionFailure);
      this.log('error', err.toString());
    });
    this.ws.on('close', (code, reason) => {
      this.updateStatus(InstanceStatus.Disconnected);
      this.log('debug', `Closed (${code} - ${reason})`);
      if (!this.wsReconnectionTimeout) {
        this.wsReconnectionTimeout = setTimeout(this.connect, 5000);
      }
    });
    this.ws.on('message', (data, isBinary) => {
      // do things with messages
    });
  }

  /**
   * Called when the module instance is OK to start setting up.
   * @param config The initial configuration object
   * @param isFirstInit ??? Unsure when this changes
   */
  async init(config: Config, isFirstInit: boolean) {
    this.log('debug', 'Init');
    this.config = config;
    this.updateStatus(InstanceStatus.Connecting);
    initVariables(this);
    initFeedbacks(this);
    initActions(this);
    this.connect();
  }

  /**
   * Called when this module instance is going to be destroyed, to do clean up.
   */
  async destroy() {
    this.log('debug', 'Destroy');
    if (this.ws) {
      this.ws.close(); // Close current connection if one is active.
      this.ws.removeAllListeners();
    }
    clearTimeout(this.wsReconnectionTimeout);
    this.wsReconnectionTimeout = undefined;
  }

  /**
   * Called when the user updates the configuration of this module instance in Companion.
   * @param config The updated configuration object
   */
  async configUpdated(config: Config) {
    this.log('debug', 'Config updated');
    this.config = config;
    this.connect();
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

export default ModuleInstance;
