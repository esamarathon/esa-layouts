<template>
  <div>
    <video
      v-show="videoSrc"
      ref="VideoPlayer"
      :style="{
        display: 'block',
        width: '1920px',
        height: '1080px'
      }"
    >
      <source
        :src="videoSrc"
        :type="videoType"
      >
    </video>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State, Mutation } from 'vuex-class';
import { VideoPlayer } from 'schemas';
import { Asset } from 'types';
import { UpdatePlayCount, UnselectVideo } from './store';

@Component
export default class extends Vue {
  @State videos!: Asset[];
  @State videoPlayer!: VideoPlayer;
  @Mutation updatePlayCount!: UpdatePlayCount;
  @Mutation unselectVideo!: UnselectVideo;
  player!: HTMLVideoElement;
  videoSrc: string | null = null;
  videoType: string | null = null;

  playVideo(): void {
    const video = this.videos.find((v) => v.sum === this.videoPlayer.selected);
    if (this.videoPlayer.selected && video) {
      this.videoSrc = video.url;
      if (video.ext.toLowerCase() === '.webm') {
        this.videoType = 'video/webm';
      } else {
        this.videoType = 'video/mp4';
      }
      this.player.load();
      this.player.play();
      this.player.addEventListener('ended', this.videoEnded);
    }
  }

  stopVideo(): void {
    this.player.removeEventListener('ended', this.videoEnded);
    this.player.pause();
    this.videoSrc = null;
    this.player.load();
  }

  // eslint-disable-next-line class-methods-use-this
  videoEnded(): void {
    this.updatePlayCount();
    this.unselectVideo();
    nodecg.sendMessage('videoPlayerFinished');
  }

  mounted(): void {
    this.player = this.$refs.VideoPlayer as HTMLVideoElement;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const obs = (window as any).obsstudio;
    if (obs) {
      obs.onActiveChange = (active: boolean): void => {
        if (active) {
          this.playVideo();
        } else {
          this.stopVideo();
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
