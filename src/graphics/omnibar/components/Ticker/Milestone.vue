<template>
  <div
    class="Flex"
    :style="{
      height: '100%',
      'align-items': 'center',
      'white-space': 'nowrap',
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
      Upcoming<br>Milestone
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
          width: `${progressTweened}%`,
          height: '100%',
          // 'background-color': '#e8d53a', // TODO: Add to ESA style!
          'background-color': '#4d83aa', // TODO: Add to UKSG style!
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
        <div :style="{ width: '20%' }">
          <span class="BarText" :style="{ 'font-size': '25px' }">
            <span
              v-if="isMet"
              :style="{
                'color': '#42ff38',
                'font-weight': 700,
              }"
            >
                MET!
              </span>
            <span v-else>
              <span :style="{ 'font-weight': 600 }">Remaining:</span>
              {{ amountLeft }}
            </span>
          </span>
        </div>
        <div class="BarText" :style="{ 'font-size': '30px' }">
          <span>{{ name }}</span>
        </div>
        <div
          :style="{
            width: '20%',
            'text-align': 'right',
          }"
        >
          <span
            class="BarText" :style="{ 'font-size': '25px' }">
            <span :style="{ 'font-weight': 600 }">Goal:</span>
            {{ amount }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { replicantNS } from '@esa-layouts/browser_shared/replicant_store';
import { formatUSD, wait } from '@esa-layouts/graphics/_misc/helpers';
import { DonationTotal, DonationTotalMilestones } from '@esa-layouts/types/schemas';
import { Vue, Component, Prop } from 'vue-property-decorator';
import gsap from 'gsap';

@Component({
  name: 'Milestone',
})
export default class extends Vue {
  @Prop({ type: Number, default: 25 }) readonly seconds!: number;
  @Prop({ type: Object, required: true }) readonly milestone!: DonationTotalMilestones[0];
  @replicantNS.State((s) => s.reps.donationTotal) readonly donationTotal!: DonationTotal;
  progressTweened = 0;
  totalTweened = 0;

  get name(): string {
    return this.milestone.name;
  }

  get amount(): string {
    return formatUSD(this.milestone.amount || 0);
  }

  get amountLeft(): string {
    return formatUSD(Math.max((this.milestone.amount || 0) - this.totalTweened, 0));
  }

  getProgress(): number {
    if (!this.milestone.amount || !this.donationTotal) return 0;
    const lower = this.milestone.addition ? this.milestone.amount - this.milestone.addition : 0;
    return Math.min((this.donationTotal - lower) / (this.milestone.amount - lower), 1) * 100;
  }

  get isMet(): boolean {
    return !!(this.milestone.amount
      && this.totalTweened && this.milestone.amount <= this.totalTweened);
  }

  tweenValues(): void {
    gsap.to(this, {
      progressTweened: this.getProgress(),
      totalTweened: this.donationTotal,
      duration: 2.5,
    });
  }

  end(): void {
    // total.removeListener('change', this.tweenValues); // TODO: This would update in real time
    this.$emit('end');
  }

  async created(): Promise<void> {
    // total.on('change', this.tweenValues); // TODO: This would update in real time
    this.tweenValues();
    // TODO: This handled removing pinned milestones!
    /* if (pin.value?.type === 'milestone' && pin.value.id === this.milestone.id) {
      const func = (val: OmnibarPin) => {
        if (val?.type !== 'milestone' || val.id !== this.milestone?.id) {
          pin.removeListener('change', func);
          this.end();
        }
      };
      pin.on('change', func);
    } */
    await wait(this.seconds * 1000); // Wait the specified length.
    this.end();
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
