<template>
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
        height: vertical ? '50%' : '90%',
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
        Prize Available
      </div>
      <div :style="{ 'font-size': '1em' }">
        {{ prize.name }}
      </div>
      <div
        v-if="prize.provided"
        :style="{ 'font-size': '0.875em' }"
      >
        provided by {{ prize.provided }}
      </div>
      <div
        :style="{
          'font-size': '0.75em',
          color: 'lightgrey', // move to theme!
        }"
      >
        Minimum donation amount: {{ formatUSD(prize.minimumBid) }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { MediaBox, Prizes } from 'schemas';
import { Tracker } from 'types';
import { formatUSD } from '../../helpers';

@Component
export default class extends Vue {
  @State prizes!: Prizes
  @State mediaBox!: MediaBox;
  @Prop(Boolean) vertical!: boolean;
  formatUSD = formatUSD;

  get prize(): Tracker.FormattedPrize | undefined {
    return this.prizes.find((s) => s.id.toString() === this.mediaBox.current?.mediaUUID);
  }
}
</script>
