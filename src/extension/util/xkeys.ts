import { EventEmitter } from 'events';
import XKeysLib from 'xkeys';
import { get as nodecg } from './nodecg';

interface XKeys {
  on(event: 'down', listener: (keyIndex: string) => void): this;
  on(event: 'up', listener: (keyIndex: string) => void): this;
  on(event: 'jog', listener: (position: number) => void): this;
  on(event: 'shuttle', listener: (position: number) => void): this;
}

class XKeys extends EventEmitter {
  panel!: XKeysLib;

  constructor() {
    super();
    this.connect();
  }

  connect(): void {
    try {
      this.panel = new XKeysLib();
      nodecg().log.info('[XKeys] XKeys panel successfully found');
      this.panel.on('error', (err) => {
        nodecg().log.debug('[XKeys] Panel error:', err);
      });

      // Turn off all lights.
      this.panel.setAllBacklights(false, false);
      this.panel.setAllBacklights(false, true);

      // Set intensity to full.
      this.panel.setBacklightIntensity(255);

      // Set flashing frequency.
      this.panel.setFrequency(50);

      this.panel.on('down', (keyIndex) => {
        nodecg().log.debug('[XKeys] Key pressed:', keyIndex);
        this.emit('down', keyIndex);
      });
      this.panel.on('up', (keyIndex) => {
        nodecg().log.debug('[XKeys] Key released:', keyIndex);
        this.emit('up', keyIndex);
      });
      this.panel.on('jog', (position) => {
        nodecg().log.debug('[XKeys] Jog moved:', position);
        this.emit('jog', position);
      });
      this.panel.on('shuttle', (position) => {
        nodecg().log.debug('[XKeys] Shuttle moved:', position);
        this.emit('shuttle', position);
      });
    } catch (err) {
      nodecg().log.debug('[XKeys] Panel error:', err);
      nodecg().log.debug('[XKeys] Panel error, retrying in 5 seconds');
      setTimeout(() => this.connect(), 5000);
    }
  }

  setBacklight(keyIndex: number | string, on?: boolean,
    redLight?: boolean, flashing?: boolean): void {
    if (this.panel) {
      this.panel.setBacklight(keyIndex, on, redLight, flashing);
    } else {
      nodecg().log.warn(`[XKeys] Cannot set backlight on ${keyIndex}, panel not connected`);
    }
  }
}

export default XKeys;
