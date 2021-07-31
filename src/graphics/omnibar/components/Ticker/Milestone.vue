<template>
  <div
    v-if="milestone"
    :style="{
      height: '100%',
      display: 'flex',
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
          <span class="BarText" :style="{ 'font-size': '25px' }">
            <span v-if="isMet" :style="{ 'color': '#42ff38', 'font-weight': 700 }">MET!</span>
            <span v-else>
              <span :style="{ 'font-weight': 600 }">Remaining:</span>
              {{ amountLeft }}
            </span>
          </span>
        </div>
        <div class="BarText" :style="{ 'font-size': '30px' }">
          <span>{{ name }}</span>
        </div>
        <div :style="{ width: '20%', 'text-align': 'right' }">
          <span class="BarText" :style="{ 'font-size': '25px' }">
            <span :style="{ 'font-weight': 600 }">Goal:</span>
            {{ amount }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { DonationTotal, DonationTotalMilestones, OmnibarPin } from '@esa-layouts/types/schemas';
import { Vue, Component } from 'vue-property-decorator';
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

  get amountLeft(): string {
    return formatUSD(Math.max((this.milestone?.amount ?? 0) - this.totalTweened, 0));
  }

  getProgress(): number {
    if (!this.milestone?.amount || !total.value) return 0;
    const lower = this.milestone.addition ? this.milestone.amount - this.milestone.addition : 0;
    return Math.min((total.value - lower) / (this.milestone.amount - lower), 1) * 100;
  }

  get isMet(): boolean {
    return !!(this.milestone?.amount
      && this.totalTweened && this.milestone.amount <= this.totalTweened);
  }

  tweenValues(): void {
    gsap.to(this, {
      progressTweened: this.getProgress(),
      totalTweened: total.value || 0,
      duration: 2.5,
    });
  }

  end(): void {
    total.removeListener('change', this.tweenValues);
    this.$emit('end');
  }

  async created(): Promise<void> {
    console.log('Milestone: created');
    await NodeCG.waitForReplicants(total, milestones);
    if (milestones.value) {
      let chosenMilestone: DonationTotalMilestones[0] | undefined;
      if (pin.value?.type === 'milestone') {
        chosenMilestone = milestones.value.find(({ id }) => pin.value?.id === id);
      } else {
        const availableMilestones = milestones.value.filter((m) => m.enabled && m.amount);
        const rand = Math.floor(Math.random() * availableMilestones.length);
        chosenMilestone = availableMilestones[rand];
      }
      if (chosenMilestone) {
        this.milestone = clone(chosenMilestone);
        total.on('change', this.tweenValues);
        this.tweenValues();
        if (pin.value?.type === 'milestone' && pin.value.id === this.milestone.id) {
          console.log('Milestone: is pinned, will not auto-remove');
          const func = (val: OmnibarPin) => {
            if (val?.type !== 'milestone' || val.id !== this.milestone?.id) {
              pin.removeListener('change', func);
              this.end();
              console.log('Milestone: ended due to unpinning');
            }
          };
          pin.on('change', func);
        } else {
          window.setTimeout(() => {
            this.end();
            console.log('Milestone: ended');
          }, 25 * 1000);
        }
      } else {
        console.log('Milestone: skipping');
        this.end();
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
