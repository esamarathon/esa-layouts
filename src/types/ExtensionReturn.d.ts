import type OBS from '@esamarathon/esa-layouts-shared/obs/extension';

export interface ExtensionReturn {
  obs: OBS;
  setFaderName: (fader: string, name: string) => void;
}
