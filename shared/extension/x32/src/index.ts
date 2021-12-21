import type { NodeCG } from 'nodecg/types/server';
import osc from 'osc';
import { X32 as X32Types } from '../../../types';

class X32 {
  private nodecg: NodeCG;
  private config: X32Types.Config;
  conn: osc.UDPPort | undefined;
  faders: { [k: string]: number } = {};
  fadersExpected: { [k: string]: {
    value: number, increase: boolean, seenOnce: boolean,
  } } = {};
  private fadersInterval: { [k: string]: NodeJS.Timeout } = {};

  constructor(nodecg: NodeCG, config: X32Types.Config) {
    this.nodecg = nodecg;
    this.config = config;

    if (config.enable) {
      nodecg.log.info('[X32] Setting up connection');

      this.conn = new osc.UDPPort({
        localAddress: '0.0.0.0',
        localPort: config.localPort,
        remoteAddress: config.ip,
        remotePort: 10023,
        metadata: true,
      });

      this.conn.on('error', (err) => {
        nodecg.log.warn('[X32] Error on connection');
        nodecg.log.debug('[X32] Error on connection:', err);
      });

      this.conn.on('message', (message) => {
        // I don't trust myself with all posibilities, so wrapping this up.
        try {
          if (message.address.endsWith('/fader')) {
            const args = (message.args as { type: 'f', value: number }[])[0];
            this.faders[message.address] = args.value;

            // Check if we're done fading and clear intervals if needed.
            if (this.fadersExpected[message.address]) {
              const exp = this.fadersExpected[message.address];

              // Sometimes we receive a delayed message, so we wait until
              // we've at least seen 1 value in the correct range.
              if ((exp.increase && exp.value > args.value)
              || (!exp.increase && exp.value < args.value)) {
                exp.seenOnce = true;
              }
              if (exp.seenOnce && ((exp.increase && exp.value <= args.value)
              || (!exp.increase && exp.value >= args.value))) {
                if (this.conn) {
                  this.conn.send({
                    address: message.address,
                    args: [{ type: 'f', value: exp.value }],
                  });
                }
                clearInterval(this.fadersInterval[message.address]);
                delete this.fadersExpected[message.address];
              }
            }
          }
        } catch (err) {
          nodecg.log.warn('[X32] Error parsing message');
          nodecg.log.debug('[X32] Error parsing message:', err);
        }
      });

      this.conn.on('close', () => {
        nodecg.log.info('[X32] Connection closed');
      });

      this.conn.on('open', () => {
        nodecg.log.info('[X32] Connection opened');
      });

      this.conn.on('ready', () => {
        nodecg.log.info('[X32] Connection ready');

        // Subscribe/renew to updates (must be done every <10 seconds).
        if (this.conn) {
          this.conn.send({ address: '/xremote', args: [] });
        }
        setInterval(() => {
          if (this.conn) {
            this.conn.send({ address: '/xremote', args: [] });
          }
        }, 8 * 1000);
      });

      this.conn.open();
    }
  }

  /**
   * Just set a specific fader to the supplied value.
   * @param name Full name of fader (example: /dca/1/fader).
   * @param startValue Value to set (0.0 - 1.0).
   */
  setFader(name: string, value: number): void {
    if (!this.config.enable || !this.conn) {
      throw new Error('No connection available');
    }

    this.nodecg.log.debug(`[X32] Attempting to set fader on ${name} to ${value}`);
    this.conn.send({
      address: '/subscribe',
      args: [{ type: 's', value: name }, { type: 'i', value: 0 }],
    });
    this.conn.send({ address: name, args: [{ type: 'f', value }] });
  }

  /**
   * Fades up/down the supplied fader using the specified settings.
   * @param name Full name of fader (example: /dca/1/fader).
   * @param startValue Value to start at (0.0 - 1.0).
   * @param endValue Value to end at (0.0 - 1.0).
   * @param length Milliseconds to spend doing fade.
   */
  fade(name: string, startValue: number, endValue: number, length: number): void {
    if (!this.config.enable || !this.conn) {
      throw new Error('No connection available');
    }

    // Will stop doing a fade if we receive another one while the old one is running, for safety.
    if (this.fadersExpected[name]) {
      clearInterval(this.fadersInterval[name]);
      delete this.fadersExpected[name];
    }

    this.nodecg.log.debug(`[X32] Attempting to fade ${name} `
      + `(${startValue} => ${endValue}) for ${length}ms`);
    let currentValue = startValue;
    const increase = startValue < endValue;
    const stepCount = length / 100;
    const stepSize = (endValue - startValue) / stepCount;
    this.fadersExpected[name] = { value: endValue, increase, seenOnce: false };
    this.conn.send({
      address: '/subscribe',
      args: [{ type: 's', value: name }, { type: 'i', value: 0 }],
    });
    this.fadersInterval[name] = setInterval(() => {
      if ((increase && currentValue >= endValue) || (!increase && currentValue <= endValue)) {
        clearInterval(this.fadersInterval[name]);
        delete this.fadersExpected[name];
      }
      if (this.conn) {
        this.conn.send({ address: name, args: [{ type: 'f', value: currentValue }] });
      }
      currentValue += stepSize;
      if ((increase && currentValue > endValue) || (!increase && currentValue < endValue)) {
        currentValue = endValue;
      }
    }, 100);
  }
}

export = X32;
