<template>
  <div
    :style="{
      height: '100%',
      display: 'flex',
      'align-items': 'center',
    }"
  >
    <div
      :style="{
        'font-size': '30px',
        'text-align': 'right',
        'margin-left': '15px',
        'line-height': '100%',
      }"
    >
      Upcoming<br>Goal
    </div>
    <div
      :style="{
        position: 'relative',
        'flex-grow': 1,
        margin: '10px',
        height: '60px',
        'background-color': 'rgba(0, 0, 0, 0.3)',
      }"
    >
      <div
        :style="{
          position: 'absolute',
          width: `${tweened.progress}%`,
          height: '100%',
          'background-color': '#e8d53a',
        }"
      />
      <div
        :style="{
          display: 'flex',
          'justify-content': 'space-between',
          'align-items': 'center',
          position: 'absolute',
          width: '100%',
          height: '100%',
          padding: '0 10px',
          'box-sizing': 'border-box',
        }"
      >
        <div :style="{ width: '30%' }">
          <span class="BarText" :style="{ 'font-size': '25px' }">
            <span
              v-if="bid.goal <= bid.total"
              :style="{ 'color': '#42ff38', 'font-weight': 700 }"
            >
              MET!
            </span>
            <span v-else>
              <span :style="{ 'font-weight': 600 }">Remaining:</span>
              {{ amountLeft }}
            </span>
          </span>
        </div>
        <div class="BarTextFull" :style="{ 'font-size': '23px', 'text-align': 'center' }">
          <div>
            {{ bid.game }}
            <br>{{ bid.name }}
          </div>
        </div>
        <div :style="{ width: '30%', 'text-align': 'right' }">
          <span class="BarText" :style="{ 'font-size': '25px' }">
            <span :style="{ 'font-weight': 600 }">Goal:</span>
            {{ formatUSD(bid.goal || 0) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Bids } from '@esa-layouts/types/schemas';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import gsap from 'gsap';
import { formatUSD } from '@esa-layouts/graphics/_misc/helpers';
import { isPinned, waitForPinFinish } from '../Bid.vue';

@Component
export default class extends Vue {
  @Prop({ type: Object, required: true }) readonly bid!: Bids[0];
  formatUSD = formatUSD;
  tweened = { progress: 0, total: 0 };

  get amountLeft(): string {
    return formatUSD(Math.max((this.bid?.goal ?? 0) - this.tweened.total, 0));
  }

  tweenValues(): void {
    gsap.to(this.tweened, {
      progress: (this.bid.total / (this.bid.goal ?? 0)) * 100,
      total: this.bid.total,
      duration: 2.5,
    });
  }

  @Watch('bid')
  onBidChange(): void {
    this.tweenValues();
  }

  async created(): Promise<void> {
    this.tweenValues();
    if (isPinned(this.bid)) {
      await waitForPinFinish(this.bid);
    } else {
      await new Promise((res) => window.setTimeout(res, 25 * 1000));
    }
    this.$emit('end');
  }
}
</script>

<style scoped>
  .BarText {
    background-color: rgba(0, 0, 0, 0.4);
    padding: 7px 10px;
    border-radius: 15px;
  }

  .BarTextFull {
    background-color: rgba(0, 0, 0, 0.4);
    padding: 0 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    line-height: 100%;
    height: 100%
  }
</style>
