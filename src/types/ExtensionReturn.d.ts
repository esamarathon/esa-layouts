import type OBS from '@esamarathon/esa-layouts-shared/obs/extension';
import { Configschema } from './schemas';

export interface ExtensionReturn {
  obs: OBS;
  mixer: {
    setFaderName: (fader: string, name: string) => void;
    toggleLiveMics: (scene: string) => void;
  };
  config: Configschema;
}
