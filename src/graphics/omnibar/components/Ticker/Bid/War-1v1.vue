<template>
  <div
    class="War1v1"
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
      Upcoming<br>Bid War
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
      <!-- Coloured Bars -->
      <div
        :style="{
          display: 'flex',
          'justify-content': 'space-between',
          position: 'absolute',
          width: '100%',
          height: '100%',
        }"
      >
        <div class="Bar1" :style="{ width: `${tweened.progress1}%` }" />
        <div class="Bar2" :style="{ width: `${tweened.progress2}%` }" />
      </div>
      <!-- Both Options -->
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
          'z-index': 1,
        }"
      >
        <div>
          <span class="BarText" :style="{ 'font-size': '25px' }">
            {{ bid.options[0].name }} - {{ formatUSD(tweened.total1) }}
          </span>
        </div>
        <div :style="{ 'text-align': 'right' }">
          <span class="BarText" :style="{ 'font-size': '25px' }">
             {{ formatUSD(tweened.total2) }} - {{ bid.options[1].name }}
          </span>
        </div>
      </div>
      <!-- Name -->
      <div
        :style="{
          position: 'absolute',
          width: '100%',
          height: '100%',
          'z-index': 2,
          'display': 'flex',
          'justify-content': 'center',
        }"
      >
        <div
          :style="{
            'font-size': '23px',
            'text-align': 'center',
            'background-color': 'rgba(0, 0, 0, 0.4)',
            'padding': '0 10px',
            'display': 'flex',
            'flex-direction': 'column',
            'justify-content': 'center',
            'line-height': '100%',
            'height': '100%',
          }"
        >
          {{ bid.game }}
          <br>{{ bid.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { formatUSD, wait } from '@esa-layouts/graphics/_misc/helpers';
import { Bids } from '@esa-layouts/types/schemas';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import gsap from 'gsap';

@Component
export default class extends Vue {
  @Prop({ type: Number, required: true }) readonly seconds!: number;
  @Prop({ type: Object, required: true }) readonly bid!: Bids[0];
  formatUSD = formatUSD;
  tweened = { progress1: 0, progress2: 0, total1: 0, total2: 0 };

  tweenValues(): void {
    gsap.to(this.tweened, {
      progress1: (this.bid.options[0].total / this.bid.total) * 100,
      progress2: (this.bid.options[1].total / this.bid.total) * 100,
      total1: this.bid.options[0].total,
      total2: this.bid.options[1].total,
      duration: 2.5,
    });
  }

  @Watch('bid')
  onBidChange(): void {
    this.tweenValues();
  }

  async created(): Promise<void> {
    this.tweenValues();
    /* if (isPinned(this.bid)) {
      await waitForPinFinish(this.bid);
    } else { */
    await wait(this.seconds * 1000);
    // }
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
</style>
