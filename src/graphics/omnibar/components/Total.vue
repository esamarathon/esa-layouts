<template>
  <div
    class="Flex"
    :style="{
      'margin-right': '20px',
       overflow: 'hidden',
    }"
  >
    <!-- Alert sound effect. -->
    <audio ref="SFX">
      <source src="./sfx/mario_coin.mp3" type="audio/mpeg">
    </audio>
    <div class="Grid Flex" :style="{ 'min-width': '110px' }">
      <!-- Charity logo. -->
      <div class="Flex" :style="{ 'z-index': 0 }">
        <img
          id="CharityLogo"
          :style="{
            opacity: showAlert ? 0.3 : 1,
            transition: 'opacity 0.5s',
          }"
        >
      </div>
      <!-- Alerts. -->
      <div
        class="Flex"
        :style="{
            'z-index': 1,
            opacity: showAlert ? 1 : 0,
            transition: 'opacity 0.5s',
        }"

      >
        <img
          src="./img/RetroCoin.png"
          :style="{
            height: '30px',
            'image-rendering': 'pixelated',
            'margin-right': '2px',
          }"
        >
        <span
          :style="{
            'font-size': '20px',
            color: '#7FFF00', // Basic green, no need to use theme
            'font-weight': 600,
            'background-color': 'rgba(0,0,0,0.6)',
            padding: '4px 8px',
            'border-radius': '10px',
          }"
        >
          +{{ alertText }}
        </span>
      </div>
    </div>
    <!-- Actual total. -->
    <div
      id="Total"
      class="Flex"
      :style="{
        'font-size': '40px',
        'font-weight': 500,
        'min-width': '80px',
      }"
    >
      <span
        v-for="(char, i) in totalStr"
        :key="i"
        :class="(char === ',' ? 'Comma' : undefined)"
      >
        {{ char }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { replicantModule } from '@esa-layouts/browser_shared/replicant_store';
import { formatUSD } from '@esa-layouts/graphics/_misc/helpers';
import { Vue, Component, Watch, Ref } from 'vue-property-decorator';
import gsap from 'gsap';

@Component
export default class extends Vue {
  @Ref('SFX') sfx!: HTMLAudioElement;
  total = 0;
  playingAlerts = false;
  showAlert = false;
  alertText = '$0';
  alertList: { total: number, amount: string }[] = [];

  get rawTotal(): number {
    return replicantModule.repsTyped.donationTotal;
  }

  get totalStr(): string {
    return `$${Math.floor(this.total).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  }

  async playNextAlert(start = false): Promise<void> {
    this.playingAlerts = true;
    if (!start) await new Promise((res) => { setTimeout(res, 500); });
    await this.sfx.play();
    await new Promise((res) => { setTimeout(res, 500); });
    this.showAlert = true;
    this.alertText = this.alertList[0].amount;
    gsap.to(this, {
      total: this.alertList[0].total,
      duration: 5,
    });
    await new Promise((res) => { setTimeout(res, 6000); });
    this.alertList.shift();
    this.showAlert = false;
    if (this.alertList.length) this.playNextAlert();
    else this.playingAlerts = false;
  }

  @Watch('rawTotal')
  onRawTotalChanged(newVal: number, oldVal: number): void {
    this.alertList.push({
      total: newVal,
      amount: formatUSD(newVal - oldVal),
    });
    if (!this.playingAlerts) this.playNextAlert(true);
  }

  async created(): Promise<void> {
    this.total = this.rawTotal;
  }
}
</script>

<style scoped>
  /* Each character in the total is in a span; setting width so the numbers appear monospaced. */
  #Total > span {
    display: inline-block;
    width: 0.45em;
    text-align: center;
  }
  #Total > .Comma {
    width: 0.22em;
  }
</style>
