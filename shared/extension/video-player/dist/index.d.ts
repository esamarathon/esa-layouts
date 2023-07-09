import NodeCGTypes from '@nodecg/types';
import { TypedEmitter } from 'tiny-typed-emitter';
import { OBS as OBSTypes, VideoPlaylist } from '../../../types';
import OBS from '../../obs';
interface VideoPlayerEvents {
    'playCommercial': (playlistItem: VideoPlaylist.PlaylistItem) => void;
    'videoStarted': (playlistItem: VideoPlaylist.PlaylistItem) => void;
    'videoEnded': (playlistItem: VideoPlaylist.PlaylistItem) => void;
    'playlistEnded': (early: boolean) => void;
}
declare class VideoPlayer extends TypedEmitter<VideoPlayerEvents> {
    private nodecg;
    private obsConfig;
    private obs;
    private delayAC;
    playlist: VideoPlaylist.PlaylistItem[];
    playing: boolean;
    index: number;
    constructor(nodecg: NodeCGTypes.ServerAPI, obsConfig: OBSTypes.Config, obs: OBS);
    /**
     * Validate and load in a supplied playlist.
     */
    loadPlaylist(playlist: VideoPlaylist.PlaylistItem[]): void;
    /**
     * Attempt to play the next playlist item.
     * If at the end, triggers the end of the playlist.
     */
    playNext(): Promise<void>;
    /**
     * Used to end the playlist early; will stop the video if any, reset settings,
     * and emit "playlistEnded".
     */
    endPlaylistEarly(): Promise<void>;
    /**
     * Play the supplied asset via the OBS source.
     * @param video NodeCG asset of the video.
     */
    playVideo(video: NodeCGTypes.AssetFile): Promise<void>;
    /**
     * Calculates how long the playlist will last (estimated).
     * @returns Length in seconds.
     */
    calculatePlaylistLength(): Promise<number>;
}
export = VideoPlayer;
//# sourceMappingURL=index.d.ts.map