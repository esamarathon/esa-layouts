<template>
  <div :style="{ 'background-color': 'black' }">
    <video
      v-show="show"
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
import { Vue, Component, Ref } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { VideoPlayer } from '@esa-layouts/types/schemas';

@Component
export default class extends Vue {
  @State videoPlayer!: VideoPlayer;
  @Ref('VideoPlayer') player!: HTMLVideoElement;
  @Ref('VideoPlayerSrc') playerSrc!: HTMLSourceElement;
  show = false;

  async playVideo(url: string, ext: string): Promise<void> {
    this.show = true;
    this.playerSrc.src = url;
    this.playerSrc.type = `video/${ext.toLowerCase().replace('.', '')}`;
    this.player.load();
    this.player.play();
  }

  stopVideo(): void {
    window.setTimeout(() => {
      this.show = false;
      this.player.pause();
      this.playerSrc.removeAttribute('src');
      this.playerSrc.removeAttribute('type');
      this.player.load();
    }, 2000);
  }

  mounted(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const obs = (window as any).obsstudio;
    if (obs) {
      obs.onActiveChange = (active: boolean): void => {
        if (active && !this.videoPlayer.playing) {
          // If we change to this scene manually, start playing videos.
          nodecg.sendMessage('startVideoPlayer');
        }
        if (!active) {
          this.stopVideo();
        }
      };
    }
    nodecg.listenFor('playVideo', ({ url, ext }: { url: string, ext: string }) => {
      this.playVideo(url, ext);
    });
    nodecg.listenFor('endVideo', () => {
      // End any video currently in progress, emergency use.
      // May not be needed as it's done if not active anyway?
      this.stopVideo();
    });
    this.player.addEventListener('ended', () => {
      nodecg.sendMessage('videoEnded');
    });
  }
}
</script>
