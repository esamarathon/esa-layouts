<template>
  <div
    v-if="media"
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
import type NodeCGTypes from '@nodecg/types';
import { IntermissionSlides } from '@esa-layouts/types/schemas';
import { Component, Prop, Ref, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';

@Component
export default class extends Vue {
  @State assetsIntermissionSlides!: NodeCGTypes.AssetFile[];
  @Ref('VideoPlayer') player!: HTMLVideoElement;
  @Ref('VideoPlayerSrc') playerSrc!: HTMLSourceElement;
  @Prop({ type: Object, required: true }) readonly current!: IntermissionSlides['current'];

  get media(): NodeCGTypes.AssetFile | undefined {
    return this.assetsIntermissionSlides.find((a) => a.sum === this.current?.mediaUUID);
  }

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
