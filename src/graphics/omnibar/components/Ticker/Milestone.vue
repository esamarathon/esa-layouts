<template>
  <div
    v-if="milestone"
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
          width: `${progressTweened}%`,
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
        <div :style="{ width: '20%' }">
          <span class="BarText" :style="{ 'font-size': '25px' }">{{ total }}</span>
        </div>
        <div class="BarText" :style="{ 'font-size': '30px' }">
          <span>{{ name }}</span>
          <span v-if="isMet" :style="{ 'color': '#42ff38', 'font-weight': 700 }">- MET!</span>
        </div>
        <div :style="{ width: '20%', 'text-align': 'right' }">
          <span class="BarText" :style="{ 'font-size': '25px' }">{{ amount }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { DonationTotal, DonationTotalMilestones, OmnibarPin } from '@esa-layouts/types/schemas';
import { Vue, Component } from 'vue-property-decorator';
import { sortBy } from 'lodash';
import { formatUSD } from '@esa-layouts/graphics/_misc/helpers';
import clone from 'clone';
import gsap from 'gsap';

const total = nodecg.Replicant<DonationTotal>('donationTotal');
const milestones = nodecg.Replicant<DonationTotalMilestones>('donationTotalMilestones');
const pin = nodecg.Replicant<OmnibarPin>('omnibarPin');

@Component
export default class extends Vue {
  milestone: DonationTotalMilestones[0] | null = null;
  progressTweened = 0;
  totalTweened = 0;

  get name(): string {
    return this.milestone?.name || '?';
  }

  get amount(): string {
    return formatUSD(this.milestone?.amount || 0);
  }

  get total(): string {
    return formatUSD(this.totalTweened);
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
    console.log('Milestone: created');
    await NodeCG.waitForReplicants(total, milestones);
    if (milestones.value) {
      const availableMilestones = milestones.value.filter((m) => m.enabled && m.amount);
      const topMilestone = sortBy(availableMilestones, ['amount'])[0];
      if (topMilestone) {
        this.milestone = clone(topMilestone);
        gsap.to(this, {
          progressTweened: this.progress,
          totalTweened: total.value || 0,
          duration: 2.5,
        });
        if (pin.value?.type === 'milestone' && pin.value.id === this.milestone.id) {
          console.log('Milestone: is pinned, will not auto-remove');
          const func = (newVal: OmnibarPin, oldVal?: OmnibarPin) => {
            if (newVal?.type !== 'milestone' || newVal.id !== this.milestone?.id) {
              pin.removeListener('change', func);
              this.$emit('end');
              console.log('Milestone: ended due to unpinning');
            }
          };
          pin.on('change', func);
        } else {
          window.setTimeout(() => {
            this.$emit('end');
            console.log('Milestone: ended');
          }, 25 * 1000);
        }
      } else {
        console.log('Milestone: skipping');
        this.$emit('end');
      }
    }
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
