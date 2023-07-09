<template>
  <!-- todo: locally store class CSS properties for safety -->
  <div
    v-show="msg"
    :class="vertical ? 'FlexColumn' : 'Flex'"
    :style="{
      'font-size': '0.75em',
      'text-align': 'center',
      padding: '25px',
      'box-sizing': 'border-box',
    }"
  >
    <img
      src="./therungg.png"
      :style="{
        'margin-bottom': vertical ? '10px' : 0,
        'margin-right': !vertical ? '10px' : 0,
        height: '70%',
        // width: '50%',
        'object-fit': 'contain',
      }"
    >
    <div :style="{ color: 'white' }">
      {{ msg }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { replicantNS } from '../../../browser_shared/replicant_store';
import { MediaBox as MediaBoxRep } from '../../../types/schemas';

@Component
export default class extends Vue {
  @replicantNS.State((s) => s.reps.mediaBox) readonly mediaBox!: MediaBoxRep;
  @Prop(Boolean) vertical!: boolean;

  get msg(): string | undefined {
    return (this.mediaBox.alertQueue
      .find((a) => a.id === this.mediaBox.current?.mediaUUID)?.data as any).msg;
  }
}
</script>
