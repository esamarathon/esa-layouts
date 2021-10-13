<template>
  <div
    v-show="media"
    class="Flex"
  >
    <!-- Image -->
    <img
      v-show="!['.mp4', '.webm'].includes(media.ext.toLowerCase())"
      :src="media.url"
      :style="{
        display: 'block',
        width: '100%',
        height: '100%',
        'object-fit': 'contain',
        position: 'absolute',
      }"
    >

    <!-- Video -->
    <video
      v-show="['.mp4', '.webm'].includes(media.ext.toLowerCase())"
      ref="VideoPlayer"
      muted
      :style="{
        display: 'block',
        width: '100%',
        height: '100%',
        position: 'absolute',
      }"
    >
      <source ref="VideoPlayerSrc">
    </video>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Ref } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { Asset } from '@shared/types';

@Component
export default class extends Vue {
  @Ref('VideoPlayer') player!: HTMLVideoElement;
  @Ref('VideoPlayerSrc') playerSrc!: HTMLSourceElement;
  @State('currentMedia') media!: Asset | undefined;

  mounted(): void {
    // We should always have media, this is just a backup in case.
    if (!this.media) {
      this.$emit('end');
    } else if (!['.mp4', '.webm'].includes(this.media.ext.toLowerCase())) {
      window.setTimeout(() => this.$emit('end'), 20 * 1000);
    } else {
      this.playerSrc.src = this.media.url;
      this.playerSrc.type = `video/${this.media.ext.toLowerCase().replace('.', '')}`;
      this.player.load();
      this.player.play();
      this.player.addEventListener('ended', async () => {
        this.$emit('end');
        this.player.pause();
        this.playerSrc.removeAttribute('src');
        this.playerSrc.removeAttribute('type');
        this.player.load();
      }, { once: true });
    }
  }
}
</script>
