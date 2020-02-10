// The object from the voices API.
export interface Voices {
  [k: string]: {
    languageCode: string;
    languageName: string;
    name: string;
    id: string;
    gender: string;
    provider: string;
  }
}
