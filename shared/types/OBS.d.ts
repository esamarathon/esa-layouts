export namespace OBS {
  interface Config {
    enabled: boolean;
    address: string;
    password: string;
    names: {
      scenes?: {
        commercials?: string;
        intermission?: string;
      };
      sources: {
        videoPlayer: string;
      };
    };
  }
}
