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
        'line-height': '80%',
      }"
    >
      Next<br>Milestone
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
          width: `${progress}%`,
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
        <div class="BarText" :style="{ 'font-size': '25px' }">{{ total }}</div>
        <div class="BarText" :style="{ 'font-size': '30px' }">
          <span>{{ name }}</span>
          <span v-if="isMet" :style="{ 'color': '#42ff38', 'font-weight': 700 }">- MET!</span>
        </div>
        <div class="BarText" :style="{ 'font-size': '25px' }">{{ amount }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { DonationTotal, DonationTotalMilestones } from '@esa-layouts/types/schemas';
import { Vue, Component } from 'vue-property-decorator';
import { sortBy } from 'lodash';
import { formatUSD } from '@esa-layouts/graphics/_misc/helpers';
import clone from 'clone';

const total = nodecg.Replicant<DonationTotal>('donationTotal');
const milestones = nodecg.Replicant<DonationTotalMilestones>('donationTotalMilestones');

@Component
export default class extends Vue {
  milestone: DonationTotalMilestones[0] | null = null;

  get name(): string {
    return this.milestone?.name || '?';
  }

  get amount(): string {
    return formatUSD(this.milestone?.amount || 0);
  }

  get total(): string {
    return formatUSD(total.value || 0);
  }

  get progress(): number {
    if (!this.milestone?.amount || !total.value) return 0;
    const lower = this.milestone.addition ? this.milestone.amount - this.milestone.addition : 0;
    return Math.min((total.value - lower) / (this.milestone.amount - lower), 1) * 100;
  }

  get isMet(): boolean {
    return !!(this.milestone?.amount && total.value && total.value >= this.milestone.amount);
  }

  async created(): Promise<void> {
    await NodeCG.waitForReplicants(total, milestones);
    if (milestones.value) {
      const availableMilestones = milestones.value.filter((m) => m.enabled && m.amount);
      const topMilestone = sortBy(availableMilestones, ['amount'])[0];
      if (topMilestone) {
        this.milestone = clone(topMilestone);
      } else {
        this.$emit('end');
      }
    }
  }

  mounted(): void {
    window.setTimeout(() => this.$emit('end'), 25 * 1000);
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
