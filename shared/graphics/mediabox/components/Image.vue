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
import type NodeCGTypes from '@nodecg/types';
import { Component, Vue } from 'vue-property-decorator';
import { replicantNS } from '../../../browser_shared/replicant_store';
import { MediaBox } from '../../../types/schemas';

@Component
export default class extends Vue {
  @replicantNS.State(
    (s) => s.reps.assetsMediaBoxImages,
  ) readonly mediaBoxImages!: NodeCGTypes.AssetFile[];
  @replicantNS.State((s) => s.reps.mediaBox) readonly mediaBox!: MediaBox;

  get url(): string | undefined {
    const asset = this.mediaBoxImages.find((s) => s.sum === this.mediaBox.current?.mediaUUID);
    return asset?.url;
  }
}
</script>
