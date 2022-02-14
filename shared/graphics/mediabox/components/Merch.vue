<template>
  <!-- todo: locally store class CSS properties for safety -->
  <div
    v-show="merch"
    :class="vertical ? 'FlexColumn' : 'Flex'"
    :style="{
      'font-size': '0.8em', // move to prop?
      padding: '10px',
      'box-sizing': 'border-box',
      'text-align': 'center',
    }"
  >
    <div :style="{ 'margin-right': vertical ? 0 : '20px' }">
      <div
        :style="{
          'font-size': '1em',
          color: 'white', // move to theme!
        }"
      >
        {{ merch.user }}
      </div>
      <div
        :style="{
          'font-size': '0.85em',
        }"
      >
        bought a {{ merch.productName }}
      </div>
    </div>
    <img
      :src="merch.imgURL"
      :style="{
        height: vertical ? '50%' : '65%',
        'max-height': '350px',
        'margin-right': vertical ? 0 : '20px',
        'margin-top': vertical ? '10px' : 0,
      }"
    >
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { MediaBox } from '../../../types/schemas';
import { replicantNS } from '../../../browser_shared/replicant_store';
import { MediaBox as MediaBoxType } from '../../../types';

@Component
export default class extends Vue {
  @replicantNS.State((s) => s.reps.mediaBox) readonly mediaBox!: MediaBox;
  @Prop(Boolean) vertical!: boolean;

  get merch(): MediaBoxType.AlertElem['data'] | undefined {
    return this.mediaBox.alertQueue.find((a) => a.id === this.mediaBox.current?.mediaUUID)?.data;
  }
}
</script>
