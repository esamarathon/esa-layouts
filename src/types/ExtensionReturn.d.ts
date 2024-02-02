import { DeepReadonly } from 'ts-essentials';
import type OBS from '../../shared/extension/obs'; // eslint-disable-line import/no-relative-packages
import { Configschema } from './schemas';

export interface ExtensionReturn {
  obs: OBS;
  mixer: {
    setFaderName: (fader: string, name: string) => void;
    toggleLiveMics: (scene: string) => void;
  };
  config: DeepReadonly<Configschema>;
}
