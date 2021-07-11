<template>
  <div :style="{ 'background-color': 'black' }">
    <video
      v-show="video"
      ref="VideoPlayer"
      :style="{
        display: 'block',
        width: '100%',
        height: '100%',
      }"
    >
      <source ref="VideoPlayerSrc">
    </video>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Ref, Watch } from 'vue-property-decorator';
import { State, Mutation } from 'vuex-class';
import clone from 'clone';
import { Configschema, VideoPlayer } from '@esa-layouts/types/schemas';
import { Asset } from '@esamarathon/esa-layouts-shared/types';
import { UpdatePlayCount, ClearPlaylist, UpdateCurrent, UpdatePlayingState } from '../store';

@Component
export default class extends Vue {
  @State videos!: Asset[];
  @State videoPlayer!: VideoPlayer;
  @Mutation updatePlayingState!: UpdatePlayingState;
  @Mutation updatePlayCount!: UpdatePlayCount;
  @Mutation updateCurrent!: UpdateCurrent;
  @Mutation clearPlaylist!: ClearPlaylist;
  @Ref('VideoPlayer') player!: HTMLVideoElement;
  @Ref('VideoPlayerSrc') playerSrc!: HTMLSourceElement;
  playlist: VideoPlayer['playlist'] = [];
  video: Asset | null = null;
  index = 0;
  playing = false;
  cfg = nodecg.bundleConfig as Configschema;
  commercialWaitTimeout!: number;

  @Watch('playing', { immediate: true })
  async onPlayingChange(val: boolean): Promise<void> {
    await new Promise((res) => window.setTimeout(res, 2000));
    this.updatePlayingState(val);
  }

  async playNextVideo(): Promise<void> {
    const commercialLength = this.playlist[this.index].commercial;
    if (commercialLength > 0) {
      nodecg.sendMessage('videoPlayerStartCommercial', commercialLength);
    }
    const video = this.videos.find((v) => v.sum === this.playlist[this.index].sum);
    if (video) {
      nodecg.sendMessage('obsChangeScene', {
        scene: this.cfg.obs.names.scenes.videoPlayer,
        force: true,
      });
      this.video = video;
      this.playerSrc.src = video.url;
      this.playerSrc.type = `video/${video.ext.toLowerCase().replace('.', '')}`;
      this.player.load();
      this.player.play();
      this.updateCurrent(video.sum);
    } else {
      // This also happens if the playlist item is a non-video.
      this.stopVideo();
      nodecg.sendMessage('obsChangeScene', {
        scene: this.cfg.obs.names.scenes.intermission,
        force: true,
      });
      // Wait until the commercials should be finished.
      this.commercialWaitTimeout = window.setTimeout(() => {
        this.videoEnded();
      }, Math.max(this.playlist[this.index].commercial * 1000, 2000));
    }
  }

  async videoEnded(): Promise<void> {
    if (this.video) {
      this.updatePlayCount(this.video.sum);
    }
    if (this.playlist.length - 1 > this.index) {
      this.index += 1;
      this.playNextVideo();
    } else {
      // End of playlist.
      this.stopVideo();
      this.stopPlaylist();
      this.clearPlaylist();
      this.playing = false;
      nodecg.sendMessage('videoPlayerFinished');
    }
  }

  stopVideo(): void {
    this.updateCurrent();
    window.setTimeout(() => {
      this.video = null;
      this.player.pause();
      this.playerSrc.removeAttribute('src');
      this.playerSrc.removeAttribute('type');
      this.player.load();
    }, 2000);
  }

  async startPlaylist(): Promise<void> {
    this.playing = true;
    nodecg.sendMessage('videoPlayerStarted');
    // If no videos, just trigger a switch back after a short delay.
    if (!this.videoPlayer.playlist.length) {
      await new Promise((res) => window.setTimeout(res, 2 * 1000));
      this.playing = false;
      nodecg.sendMessage('videoPlayerFinished');
    } else {
      this.index = 0;
      this.playlist = clone(this.videoPlayer.playlist);
      this.playNextVideo();
    }
  }

  stopPlaylist(): void {
    this.index = 0;
    this.playlist.length = 0;
  }

  mounted(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const obs = (window as any).obsstudio;
    if (obs) {
      this.updatePlayingState(false);
      obs.onActiveChange = (active: boolean): void => {
        if (active && !this.playing) {
          this.startPlaylist();
        }
      };
    }
    nodecg.listenFor('startVideoPlayer', this.startPlaylist);
    nodecg.listenFor('endVideoPlayer', () => {
      if (this.playing) {
        window.clearTimeout(this.commercialWaitTimeout);
        this.stopVideo();
        this.stopPlaylist();
        this.playing = false;
      }
    });
    this.player.addEventListener('ended', this.videoEnded);
  }
}
</script>
