import { EventEmitter } from 'events';
import type { NodeCG, Replicant } from 'nodecg/types/server';
import path from 'path';
import { v4 as uuid } from 'uuid';
import WebSocket from 'ws';
import { Restream as RestreamTypes } from '../../../types';
import { RestreamData } from '../../../types/schemas';

/**
 * Calculates the absolute file path to one of our local replicant schemas.
 * @param schemaName the replicant/schema filename.
 */
function buildSchemaPath(schemaName: string) {
  return path.resolve(__dirname, '../../../schemas', `${encodeURIComponent(schemaName)}.json`);
}

interface RestreamInstance {
  on(event: 'connected', listener: () => void): this;
  on(event: 'disconnected', listener: () => void): this;
  on(event: 'update', listener: (data: RestreamTypes.UpdateMsg) => void): this;
  on(event: 'channelChange', listener: (channel?: string) => void): this;
}

class RestreamInstance extends EventEmitter {
  private ws: WebSocket | undefined;
  private nodecg: NodeCG;
  private address: string;
  private key: string;
  channel: string | undefined;

  constructor(nodecg: NodeCG, address: string, key: string) {
    super();
    this.nodecg = nodecg;
    this.address = address;
    this.key = key;
    this.nodecg.log.debug(`[Restream, ${this.address}] Creating instance`);
    this.connect();
  }

  async sendMsg(msg: RestreamTypes.AllSentMsg): Promise<RestreamTypes.ResponseMsg> {
    return new Promise((res) => {
      this.nodecg.log.debug(`[Restream, ${this.address}] Sending mesage:`, msg);
      if (!this.ws || this.ws.readyState !== 1) {
        // throw new Error('WebSocket not connected');
        this.nodecg.log.warn(`[Restream, ${this.address}] `
          + 'Cannot send mesage: WebSocket not connected');
        return;
      }
      const msgID = uuid();
      this.ws.send(JSON.stringify({ ...msg, ...{ msgID } }));
      const msgEvt = (data: WebSocket.Data): void => {
        const resp: RestreamTypes.IncomingMsg = JSON.parse(data.toString());
        if (this.ws && resp.type === 'Response' && resp.msgID === msgID) {
          this.nodecg.log.debug(`[Restream, ${this.address}] `
            + 'Received successful confirmation message');
          this.ws.removeListener('message', msgEvt);
          res(resp);
        }
      };
      if (this.ws) {
        this.ws.on('message', msgEvt);
      }
    });
  }

  connect(): void {
    this.nodecg.log.info(`[Restream, ${this.address}] Connecting`);
    this.ws = new WebSocket(`ws://${this.address}/ws?key=${this.key}`);

    this.ws.once('open', () => {
      this.emit('connected');
      this.nodecg.log.info(`[Restream, ${this.address}] Connected`);
    });

    this.ws.on('error', (err) => {
      this.nodecg.log.warn(`[Restream, ${this.address}] Connection error`);
      this.nodecg.log.debug(`[Restream, ${this.address}] Connection error:`, err);
    });

    this.ws.once('close', () => {
      if (this.ws) {
        this.ws.removeAllListeners();
      }
      this.emit('disconnected');
      setTimeout(() => this.connect(), 5 * 1000);
      this.nodecg.log.warn(`[Restream, ${this.address}] Connection lost, retrying in 5 seconds`);
    });

    this.ws.on('message', (data) => {
      const msg: RestreamTypes.IncomingMsg = JSON.parse(data.toString());
      this.nodecg.log.debug(`[Restream, ${this.address}] Received mesage:`, msg);
      this.channel = msg.channel;
      this.emit('channelChange', msg.channel);
      if (msg.type === 'Update') {
        this.emit('update', msg);
      }
    });
  }

  async startStream(channel: string): Promise<RestreamTypes.ResponseMsg> {
    const msg: RestreamTypes.Start = {
      type: 'Start',
      channel,
    };
    return this.sendMsg(msg);
  }

  async stopStream(): Promise<RestreamTypes.ResponseMsg> {
    const msg: RestreamTypes.Stop = {
      type: 'Stop',
    };
    return this.sendMsg(msg);
  }

  async restartStream(): Promise<RestreamTypes.ResponseMsg> {
    const msg: RestreamTypes.Restart = {
      type: 'Restart',
    };
    return this.sendMsg(msg);
  }
}

class Restream {
  private nodecg: NodeCG;
  instances: RestreamInstance[] = [];
  restreamData: Replicant<RestreamData>;

  constructor(nodecg: NodeCG, sc: boolean, config: RestreamTypes.Config) {
    this.nodecg = nodecg;
    this.restreamData = nodecg.Replicant('restreamData', {
      schemaPath: buildSchemaPath('restreamData'),
    });
    for (let i = 0; i < this.restreamData.value.length; i += 1) {
      this.restreamData.value[i].connected = false;
    }

    if (config.enable) {
      this.nodecg.log.info('[Restream] Setting up');
      const cfgArr = (Array.isArray(config.instances)) ? config.instances : [config.instances];

      // Add defaults to the replicant if needed.
      if (this.restreamData.value.length < cfgArr.length) {
        const count = cfgArr.length - this.restreamData.value.length;
        const defaultData: RestreamData[0] = {
          connected: false,
          overridden: false,
        };
        this.restreamData.value.push(...Array(count).fill(defaultData));
      }

      this.instances = cfgArr.map((cfg, i) => {
        const restream = new RestreamInstance(nodecg, cfg.address, cfg.key);
        restream.on('connected', () => { this.restreamData.value[i].connected = true; });
        restream.on('disconnected', () => { this.restreamData.value[i].connected = false; });
        restream.on('update', ({ channel, uuid: uuid_ }) => {
          this.updateData(i, { channel, uuid: uuid_ });
        });
        return restream;
      });

      this.nodecg.listenFor('restreamOverride', async (data: {
        index?: number;
        channel?: string;
      } = {}, cb) => {
        const instance = this.instances[data.index || 0];
        const channel = data.channel || this.restreamData.value[data.index || 0]?.channel;
        if (instance && channel) {
          const { channel: channel_, uuid: uuid_ } = await instance.startStream(
            channel,
          );
          this.updateData(data.index || 0, {
            overridden: true,
            channel: channel_,
            uuid: uuid_,
          });
          // Currently not checking for error msg here, so will always seem successful!
          this.nodecg.log.info('[Restream] Successfully overridden stream '
            + `${(data.index || 0) + 1}`);
        }
        if (cb && !cb.handled) {
          cb();
        }
      });

      this.nodecg.listenFor('restreamRestart', async (data: { index?: number } = {}, cb) => {
        const instance = this.instances[data.index || 0];
        if (instance) {
          const { channel, uuid: uuid_ } = await instance.restartStream();
          this.updateData(data.index || 0, { channel, uuid: uuid_ });
          // Currently not checking for error msg here, so will always seem successful!
          this.nodecg.log.info(`[Restream] Successfully restarted stream ${(data.index || 0) + 1}`);
        }
        if (cb && !cb.handled) {
          cb();
        }
      });

      this.nodecg.listenFor('restreamStop', async (data: { index?: number } = {}, cb) => {
        const instance = this.instances[data.index || 0];
        if (instance) {
          const { channel, uuid: uuid_ } = await instance.stopStream();
          this.updateData(data.index || 0, { channel, uuid: uuid_ });
          // Currently not checking for error msg here, so will always seem successful!
          this.nodecg.log.info(`[Restream] Successfully stopped stream ${(data.index || 0) + 1}`);
        }
        if (cb && !cb.handled) {
          cb();
        }
      });
    }
  }

  /**
   * Takes a list of channels and will set them on that instance index if different,
   * or stop if needed.
   * @param channels List of channels.
   */
  updateMultipleInstances(channels: (string | null | undefined)[]): void {
    this.instances.forEach(async (instance, i) => {
      const newChan = channels[i];
      if (!newChan) {
        const { channel, uuid: uuid_ } = await instance.stopStream();
        this.updateData(i, { channel, uuid: uuid_ });
        // Currently not checking for error msg here, so will always seem successful!
        this.nodecg.log.info(`[Restream] Successfully stopped stream ${i + 1}`);
      } else if (newChan && newChan !== instance.channel) {
        const { channel, uuid: uuid_ } = await instance.startStream(
          newChan,
        );
        this.updateData(i, {
          overridden: false,
          channel,
          uuid: uuid_,
        });
        // Currently not checking for error msg here, so will always seem successful!
        this.nodecg.log.info(`[Restream] Successfully started stream ${i + 1}`);
      }
    });
  }

  private updateData(i: number, opts: {
    channel?: string,
    uuid?: string,
    overridden?: boolean,
  }): void {
    this.nodecg.log.debug(`[Restream] Updating restreamData[${i}]:`, opts);
    this.restreamData.value[i] = {
      connected: this.restreamData.value[i].connected,
      overridden: opts.overridden ?? this.restreamData.value[i].overridden,
      channel: opts.channel,
      uuid: opts.uuid || this.restreamData.value[i].uuid,
    };
  }
}

export default Restream;
