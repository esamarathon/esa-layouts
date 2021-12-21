import { EventEmitter } from 'events';
import type { NodeCG } from 'nodecg/types/server';
import { XKeys } from 'xkeys';
import { XKeys as XKeysTypes } from '../../../types';

interface XKeysClass {
  on(event: 'down', listener: (keyIndex: string) => void): this;
  on(event: 'up', listener: (keyIndex: string) => void): this;
  on(event: 'jog', listener: (position: number) => void): this;
  on(event: 'shuttle', listener: (position: number) => void): this;
}

class XKeysClass extends EventEmitter {
  private nodecg: NodeCG;
  private config: XKeysTypes.Config;
  panel: XKeys | undefined;

  constructor(nodecg: NodeCG, config: XKeysTypes.Config) {
    super();
    this.nodecg = nodecg;
    this.config = config;

    if (config.enable) {
      this.connect();
    }
  }

  connect(): void {
    try {
      this.nodecg.log.info('[XKeys] Setting up panel');
      this.panel = new XKeys();
      this.nodecg.log.info('[XKeys] Panel successfully found');
      this.panel.on('error', (err) => {
        this.nodecg.log.debug('[XKeys] Panel error:', err);
      });

      // Turn off all lights.
      this.panel.setAllBacklights(false, false);
      this.panel.setAllBacklights(false, true);

      // Set intensity to full.
      this.panel.setBacklightIntensity(255);

      // Set flashing frequency.
      this.panel.setFrequency(50);

      this.panel.on('down', (keyIndex) => {
        this.nodecg.log.debug('[XKeys] Key pressed:', keyIndex);
        this.emit('down', keyIndex);
      });
      this.panel.on('up', (keyIndex) => {
        this.nodecg.log.debug('[XKeys] Key released:', keyIndex);
        this.emit('up', keyIndex);
      });
      this.panel.on('jog', (position) => {
        this.nodecg.log.debug('[XKeys] Jog moved:', position);
        this.emit('jog', position);
      });
      this.panel.on('shuttle', (position) => {
        this.nodecg.log.debug('[XKeys] Shuttle moved:', position);
        this.emit('shuttle', position);
      });
    } catch (err) {
      this.nodecg.log.debug('[XKeys] Panel error:', err);
      this.nodecg.log.debug('[XKeys] Panel error, retrying in 5 seconds');
      setTimeout(() => this.connect(), 5 * 1000);
    }
  }

  setBacklight(keyIndex: number | string, on = true, redLight?: boolean, flashing?: boolean): void {
    if (!this.config.enable) {
      // XKeys not enabled, don't even try to set.
      return;
    }
    if (!this.panel) {
      this.nodecg.log.warn(`[XKeys] Cannot set backlight on ${keyIndex}, panel not connected`);
      return;
    }
    this.panel.setBacklight(keyIndex, on, redLight, flashing);
  }
}

export default XKeysClass;
