<template>
  <!-- todo: locally store class CSS properties for safety -->
  <div
    v-show="prize"
    :class="vertical ? 'FlexColumn' : 'Flex'"
    :style="{
      'font-size': '0.8em', // move to prop?
      padding: '10px',
      'box-sizing': 'border-box',
      'text-align': 'center',
    }"
  >
    <img
      :src="prize.image"
      :style="{
        height: vertical ? '50%' : '65%',
        'max-height': '350px',
        'margin-left': vertical ? 0 : '20px',
        'margin-bottom': vertical ? '10px' : 0,
      }"
    >
    <div :style="{ 'margin-left': vertical ? 0 : '20px' }">
      <div
        :style="{
          'font-size': '0.7em',
          color: 'white', // move to theme!
        }"
      >
        Want a chance to win prizes like...
      </div>
      <div :style="{ 'font-size': '1em' }">
        {{ prize.name }}?
      </div>
      <div
        :style="{
          'font-size': '1em',
          color: 'lightgrey', // move to theme!
        }"
      >
        See all prizes available<br>@ prizes.esamarathon.com
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { MediaBox, Prizes } from '../../../types/schemas';
import { Tracker } from '../../../types';
import { formatUSD } from '../../../browser_shared/helpers';
import { replicantNS } from '../../../browser_shared/replicant_store';

@Component
export default class extends Vue {
  @replicantNS.State((s) => s.reps.prizes) readonly prizes!: Prizes;
  @replicantNS.State((s) => s.reps.mediaBox) readonly mediaBox!: MediaBox;
  @Prop(Boolean) vertical!: boolean;
  formatUSD = formatUSD;

  get prize(): Tracker.FormattedPrize | undefined {
    return this.prizes.find((s) => s.id.toString() === this.mediaBox.current?.mediaUUID);
  }
}
</script>
