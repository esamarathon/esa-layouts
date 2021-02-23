<template>
  <img
    v-show="url"
    :src="url"
    :style="{
      'object-fit': 'contain',
      padding: '30px',
      'box-sizing': 'border-box',
    }"
  >
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { MediaBox } from '@/types/schemas';
import { Asset } from '@/types';

@Component
export default class extends Vue {
  @State mediaBoxImages!: Asset[];
  @State mediaBox!: MediaBox;

  get url(): string | undefined {
    const asset = this.mediaBoxImages.find((s) => s.sum === this.mediaBox.current?.mediaUUID);
    return asset?.url;
  }
}
</script>
