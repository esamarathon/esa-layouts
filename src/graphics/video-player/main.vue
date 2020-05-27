<template>
  <div>
    <video
      ref="VideoPlayer"
      :style="{
        display: 'block',
        width: '100%',
        height: '100vh',
      }"
    >
      <source
        v-if="video"
        :src="video.url"
        :type="`video/${video.ext.toLowerCase().replace('.', '')}`"
      >
    </video>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State, Mutation } from 'vuex-class';
import clone from 'clone';
import { VideoPlayer } from 'schemas';
import { Asset } from 'types';
import { UpdatePlayCount, ClearPlaylist, UpdateCurrent } from './store';

@Component
export default class extends Vue {
  @State videos!: Asset[];
  @State videoPlayer!: VideoPlayer;
  @Mutation updatePlayCount!: UpdatePlayCount;
  @Mutation updateCurrent!: UpdateCurrent;
  @Mutation clearPlaylist!: ClearPlaylist;
  player!: HTMLVideoElement;
  playlist: string[] = [];
  video: Asset | null = null;
  index = 0;

  playNextVideo(): void {
    const video = this.videos.find((v) => v.sum === this.playlist[this.index]);
    if (video) {
      this.video = video;
      this.player.load();
      this.player.play();
      this.updateCurrent(video.sum);
      this.player.addEventListener('ended', this.videoEnded);
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
    this.player.removeEventListener('ended', this.videoEnded);
    this.player.pause();
    this.video = null;
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
    this.player = this.$refs.VideoPlayer as HTMLVideoElement;
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
