export namespace TextToSpeech {
// The object from the voices API.
  interface Voices {
    [k: string]: {
      languageCode: string;
      languageName: string;
      name: string;
      id: string;
      gender: string;
      provider: string;
    }
  }
}
