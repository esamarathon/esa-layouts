<template>
  <div
    v-show="donation"
    class="Flex"
    :style="{ 'font-size': '50px' }"
  >
    <img
      v-show="!vertical"
      src="./esaDonate.png"
    >
    <div
      class="FlexColumn"
      :style="{ 'margin-left': '20px' }"
    >
      <div
        :style="{
          'font-size': '1em',
          color: 'white', // move to theme!
        }"
      >
        {{ donation.name }}
      </div>
      <div :style="{ 'font-size': '0.85em' }">
        donated {{ formatUSD(donation.amount) }}
      </div>
      <div
        v-if="donation.comment"
        :style="{
          'font-size': '0.6em',
          color: 'lightgrey', // move to theme!
        }"
      >
        {{ donation.comment }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { MediaBox as MediaBoxRep } from 'schemas';
import { Asset, MediaBox } from 'types';
import { formatUSD } from '../../helpers';

@Component
export default class extends Vue {
  @State mediaBoxImages!: Asset[];
  @State mediaBox!: MediaBoxRep;
  @Prop(Boolean) vertical!: boolean;
  formatUSD = formatUSD;

  get donation(): MediaBox.AlertElem['data'] | undefined {
    return this.mediaBox.alertQueue.find((a) => a.id === this.mediaBox.current?.mediaUUID)?.data;
  }
}
</script>
