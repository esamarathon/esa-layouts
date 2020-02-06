import { EventEmitter } from 'events';

interface xkeys {
  on(event: 'error', listener: (err: Error) => void): this;
  on(event: 'downKey', listener: (keyIndex: string) => void): this;
  on(event: 'down', listener: (keyIndex: string) => void): this;
  on(event: 'upKey', listener: (keyIndex: string) => void): this;
  on(event: 'up', listener: (keyIndex: string) => void): this;
  on(event: 'jog', listener: (position: number) => void): this;
  on(event: 'shuttle', listener: (position: number) => void): this;
}

declare class xkeys extends EventEmitter {
  setBacklight(keyIndex: number | string, on?: boolean, redLight?: boolean, flashing?: boolean): void;
  setAllBacklights(on: boolean, redLight?: boolean): void;
  setBacklightIntensity(intensity: number): void;
  setFrequency(frequency: number): void;
}

export = xkeys;
