export namespace OBS {
  interface Config {
    enabled: boolean;
    address: string;
    password: string;
    names: {
      sources: {
        videoPlayer: string;
      };
    };
  }
}
