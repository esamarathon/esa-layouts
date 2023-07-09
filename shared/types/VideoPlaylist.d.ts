import NodeCGTypes from '@nodecg/types';

export namespace VideoPlaylist {
  interface PlaylistItem {
    id: string;
    video?: NodeCGTypes.AssetFile;
    length?: number;
    commercial?: boolean;
  }
}
