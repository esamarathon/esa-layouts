import { getVideoDurationInSeconds } from 'get-video-duration';
import { join } from 'path';
import { cwd } from 'process';
import { TypedEmitter } from 'tiny-typed-emitter';
import { Asset, OBS as OBSTypes, VideoPlaylist } from '../../../types';
import OBS from '../../obs';

interface VideoPlayerEvents {
  'playCommercial': (playlistItem: VideoPlaylist.PlaylistItem) => void;
  'videoStarted': (playlistItem: VideoPlaylist.PlaylistItem) => void;
  'videoEnded': (playlistItem: VideoPlaylist.PlaylistItem) => void;
  'playlistEnded': (early: boolean) => void;
}

class VideoPlayer extends TypedEmitter<VideoPlayerEvents> {
  private obsConfig: OBSTypes.Config;
  private obs: OBS;
  playlist: VideoPlaylist.PlaylistItem[] = [];
  playing = false;
  index = -1;

  constructor(obsConfig: OBSTypes.Config, obs: OBS) {
    super();
    this.obsConfig = obsConfig;
    this.obs = obs;

    // Listens for when videos finish playing in OBS.
    obs.conn.on('MediaEnded', (data) => {
      if (data.sourceName === this.obsConfig.names.sources.videoPlayer
      && this.playing && this.index >= 0) {
        this.emit('videoEnded', this.playlist[this.index]);
      }
    });
  }

  /**
   * Validate and load in a supplied playlist.
   */
  loadPlaylist(playlist: VideoPlaylist.PlaylistItem[]): void {
    if (!this.obs.connected || !this.obsConfig.enabled) {
      throw new Error('no OBS connection available');
    }
    if (this.playing) throw new Error('another playlist currently playing');
    if (!playlist.length) throw new Error('playlist must have at least 1 video');
    const invalidItems = playlist.filter((i) => !i.commercial && !i.video);
    if (invalidItems.length) {
      throw new Error('all playlist items must have either video or commercial');
    }
    this.playlist = playlist;
  }

  /**
   * Attempt to play the next playlist item.
   * If at the end, triggers the end of the playlist.
   */
  async playNext(): Promise<void> {
    if (!this.obs.connected || !this.obsConfig.enabled) {
      throw new Error('no OBS connection available');
    }
    if (this.playlist.length - 1 > this.index) {
      this.playing = true;
      this.index += 1;
      const item = this.playlist[this.index];
      this.emit('videoStarted', item); // Emitted even if no video is added.
      if (item.commercial) this.emit('playCommercial', item);
      if (item.video) await this.playVideo(item.video);
      else {
        await new Promise((res) => { setTimeout(res, 5000); });
        this.emit('videoEnded', item); // "Pretend" video ended in this case.
      }
    } else {
      this.playing = false;
      this.index = -1;
      this.playlist.length = 0;
      this.emit('playlistEnded', false);
    }
  }

  /**
   * Used to end the playlist early; will stop the video if any, reset settings,
   * and emit "playlistEnded".
   */
  async endPlaylistEarly(): Promise<void> {
    if (this.playing && this.index >= 0) {
      this.playing = false;
      this.index = -1;
      this.playlist.length = 0;
      try {
        await this.obs.conn.send(
          'StopMedia',
          { sourceName: this.obsConfig.names.sources.videoPlayer },
        );
      } catch (err) { /* do nothing */ }
      this.emit('playlistEnded', true);
    }
  }

  /**
   * Play the supplied asset via the OBS source.
   * @param video NodeCG asset of the video.
   */
  async playVideo(video: Asset): Promise<void> {
    if (!this.obs.connected || !this.obsConfig.enabled) {
      throw new Error('no OBS connection available');
    }
    const source = await this.obs.conn.send('GetSourceSettings', {
      sourceName: this.obsConfig.names.sources.videoPlayer,
    });
    const location = join(cwd(), `assets/${video.namespace}/${video.category}/${video.base}`);
    if (source.sourceType === 'ffmpeg_source') {
      await this.obs.conn.send('SetSourceSettings', {
        sourceName: this.obsConfig.names.sources.videoPlayer,
        sourceSettings: {
          is_local_file: true,
          local_file: location,
          looping: false,
          restart_on_activate: false,
        },
      });
    } else if (source.sourceType === 'vlc_source') {
      await this.obs.conn.send('SetSourceSettings', {
        sourceName: this.obsConfig.names.sources.videoPlayer,
        sourceSettings: {
          loop: false,
          shuffle: false,
          playback_behavior: 'always_play',
          playlist: [
            {
              hidden: false,
              selected: false,
              value: location,
            },
          ],
        },
      });
    } else {
      throw new Error('No video player source found in OBS to trigger');
    }
  }

  /**
   * Calculates how long the playlist will last (estimated).
   * @returns Length in seconds.
   */
  async calculatePlaylistLength(): Promise<number> {
    let totalLength = 0;
    for (const item of this.playlist) {
      if (item.video) {
        let length = 0;
        try {
          length = await getVideoDurationInSeconds(join(
            cwd(),
            `assets/${item.video.namespace}/${item.video.category}/${item.video.base}`,
          ));
        } catch (err) { /* err */ }

        // If item has a commercial longer than the video, use that instead.
        if (item.commercial && item.commercial > length) totalLength += item.commercial;
        else totalLength += length;
      } else if (item.commercial) {
        totalLength += item.commercial;
      }
    }
    return totalLength;
  }
}

export = VideoPlayer;
