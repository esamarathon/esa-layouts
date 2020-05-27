<template>
  <div
    v-show="prize"
    :class="vertical ? 'FlexColumn' : 'Flex'"
    :style="{
      'font-size': '40px', // move to prop?
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
        'margin-left': '20px',
      }"
    >
    <div :style="{ 'margin-left': '20px' }">
      <div
        :style="{
          'font-size': '35px',
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
        See all prizes available @ prizes.esamarathon.com
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
