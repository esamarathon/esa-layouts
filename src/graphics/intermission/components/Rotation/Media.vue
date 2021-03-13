<template>
  <div
    v-if="media"
    class="Flex"
  >
    <!-- Image -->
    <template v-if="!['.mp4', '.webm'].includes(media.ext.toLowerCase())">
      <img
        :src="media.url"
        :style="{
          width: '100%',
          height: '100%',
          'object-fit': 'contain',
        }"
      >
    </template>

    <!-- Video -->
    <template v-else>
      <video
        ref="Video"
        muted
        :style="{
          width: '100%',
          height: '100%',
        }"
      >
        <source
          :src="media.url"
          :type="`video/${media.ext.toLowerCase().replace('.', '')}`"
        >
      </video>
    </template>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { Asset } from '@esamarathon/esa-layouts-shared/types';

@Component
export default class extends Vue {
  @State('currentMedia') media!: Asset | undefined;

  mounted(): void {
    // We should always have media, this is just a backup in case.
    if (!this.media) {
      this.$emit('end');
    } else if (!['.mp4', '.webm'].includes(this.media.ext.toLowerCase())) {
      window.setTimeout(() => this.$emit('end'), 20 * 1000);
    } else {
      const video = this.$refs.Video as HTMLVideoElement;
      video.load();
      video.play();
      video.addEventListener('ended', () => this.$emit('end'), { once: true });
    }
  }
}
</script>
