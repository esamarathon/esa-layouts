<template>
  <video
    v-show="video"
    ref="VideoPlayer"
    :style="{
      display: 'block',
      width: '100vw',
      height: '100vh',
    }"
  >
    <source ref="VideoPlayerSrc">
  </video>
</template>

<script lang="ts">
import { Vue, Component, Ref } from 'vue-property-decorator';
import { State, Mutation } from 'vuex-class';
import clone from 'clone';
import { VideoPlayer } from '@esa-layouts/types/schemas';
import { Asset } from '@esamarathon/esa-layouts-shared/types';
import { UpdatePlayCount, ClearPlaylist, UpdateCurrent } from './store';

@Component
export default class extends Vue {
  @State videos!: Asset[];
  @State videoPlayer!: VideoPlayer;
  @Mutation updatePlayCount!: UpdatePlayCount;
  @Mutation updateCurrent!: UpdateCurrent;
  @Mutation clearPlaylist!: ClearPlaylist;
  @Ref('VideoPlayer') player!: HTMLVideoElement;
  @Ref('VideoPlayerSrc') playerSrc!: HTMLSourceElement;
  playlist: string[] = [];
  video: Asset | null = null;
  index = 0;

  async playNextVideo(): Promise<void> {
    const video = this.videos.find((v) => v.sum === this.playlist[this.index]);
    if (video) {
      this.video = video;
      this.playerSrc.src = video.url;
      this.playerSrc.type = `video/${video.ext.toLowerCase().replace('.', '')}`;
      this.player.load();
      this.player.play();
      this.updateCurrent(video.sum);
    } else {
      this.index += 1;
      this.playNextVideo();
    }
  }

  videoEnded(): void {
    if (this.video) {
      this.updatePlayCount(this.video.sum);
    }
    if (this.playlist.length - 1 > this.index) {
      this.index += 1;
      this.playNextVideo();
    } else {
      // End of playlist.
      this.clearPlaylist();
      nodecg.sendMessage('videoPlayerFinished');
    }
  }

  stopVideo(): void {
    this.updateCurrent();
    this.video = null;
    this.player.pause();
    this.playerSrc.removeAttribute('src');
    this.playerSrc.removeAttribute('type');
    this.player.load();
  }

  async startPlaylist(): Promise<void> {
    // If no videos, just trigger a switch back after a short delay.
    if (!this.videoPlayer.playlist.length) {
      await new Promise((res) => window.setTimeout(res, 2 * 1000));
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
      obs.onActiveChange = (active: boolean): void => {
        if (active) {
          this.startPlaylist();
        } else {
          // These run either on manual or automatic switch.
          this.stopVideo();
          this.stopPlaylist();
        }
      };
    }
    this.player.addEventListener('ended', this.videoEnded);
  }
}
</script>

<style>
  body {
    overflow: hidden;
    margin: 0;
    padding: 0;
    background-color: black;
  }
</style>
