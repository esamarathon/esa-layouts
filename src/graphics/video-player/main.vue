<template>
  <div
    :style="{
      position: 'relative',
      width: '100%',
      height: '100vh',
    }"
  >
    <transition
      name="fade"
      mode="in-out"
    >
      <video
        v-if="video"
        :key="video.sum"
        :ref="`VideoPlayer_${video.sum}`"
        :style="{
          display: 'block',
          position: 'absolute',
          width: '100%',
          height: '100%',
        }"
      >
        <source
          :src="video.url"
          :type="`video/${video.ext.toLowerCase().replace('.', '')}`"
        >
      </video>
    </transition>
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
  playlist: string[] = [];
  video: Asset | null = null;
  index = 0;

  get player(): HTMLVideoElement | undefined {
    return this.$refs[`VideoPlayer_${this.video?.sum || '?'}`] as HTMLVideoElement | undefined;
  }

  async playNextVideo(): Promise<void> {
    const video = this.videos.find((v) => v.sum === this.playlist[this.index]);
    if (video) {
      this.video = video;
      await Vue.nextTick();
      if (this.player) {
        this.player.load();
        this.player.play();
        this.player.addEventListener('ended', this.videoEnded);
      }
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
    if (this.player) {
      this.player.removeEventListener('ended', this.videoEnded);
      this.player.pause();
    }
    this.video = null;
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

<style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
