export namespace Foobar2000 {
  interface UpdateMsg {
    player?: {
      activeItem: {
        columns: string[];
        duration: number;
        position: number;
      };
      playbackState: 'paused' | 'playing' | 'stopped';
    }
  }
}
