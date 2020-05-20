<template>
  <div class="Fixed">
    <div
      :style="{
        position: 'relative',
        width: '100%',
        height: '100%',
      }"
    >
      <transition name="fade">
        <img
          v-if="currentLoaded"
          :key="currentLoaded.id"
          :src="currentLoaded.url"
          :style="{
            position: 'absolute',
            'object-fit': 'contain',
            width: '100%',
            height: '100%',
            padding: '30px',
            'box-sizing': 'border-box',
          }"
        >
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { MediaBox } from 'schemas';
import { Asset } from 'types';

@Component
export default class extends Vue {
  @State mediaBoxImages!: Asset[];
  @State mediaBox!: MediaBox;
  currentLoaded: { id: string; url: string } | null = null;

  get current(): { id: string; url: string } | undefined {
    if (!this.mediaBoxImages) {
      return undefined;
    }
    const asset = this.mediaBoxImages.find((s) => s.sum === this.mediaBox.current?.mediaUUID);
    return asset && this.mediaBox.current ? {
      id: this.mediaBox.current.id,
      url: asset.url,
    } : undefined;
  }

  // Preloads the image and will only show once loaded.
  @Watch('current', { immediate: true })
  onCurrentChange(val?: { id: string; url: string }): void {
    if (!val) {
      this.currentLoaded = null;
      return;
    }
    const img = new Image();
    const setAsLoaded = (): void => {
      this.currentLoaded = val;
      img.removeEventListener('load', setAsLoaded);
    };
    img.addEventListener('load', setAsLoaded);
    img.src = val.url;
  }
}
</script>

<style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity 1s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
