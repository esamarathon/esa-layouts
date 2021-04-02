import type OBS from '@esamarathon/esa-layouts-shared/obs/extension';
import { Configschema } from './schemas';

export interface ExtensionReturn {
  obs: OBS;
  setFaderName: (fader: string, name: string) => void;
  config: Configschema;
}
