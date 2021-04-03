<template>
  <div
    :class="`Flex ${tierClass}`"
    :style="{
      height: '100%',
      padding: `0 ${padding}px`,
      'margin-right': '3px',
      'white-space': 'nowrap',
    }"
  >
    ${{ Number.isInteger(donation.amount)
      ? donation.amount : donation.amount.toFixed(2)
    }} [{{ donation.donor_visiblename }}]
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { NotableDonations } from '@esa-layouts/types/schemas';

@Component
export default class extends Vue {
  @Prop(Object) donation!: NotableDonations[0];
  @Prop({ default: 15 }) padding!: number;

  get tierClass(): string {
    const rand = 1 + Math.floor(Math.random() * 3);
    if (this.donation.amount < 50) { // Under $50
      return `DonationBoxTier1-${rand}`;
    }
    if (this.donation.amount >= 50 && this.donation.amount < 100) { // $50 - $100
      return `DonationBoxTier2-${rand}`;
    }
    if (this.donation.amount >= 100) { // $100+
      return 'DonationBoxTier3';
    }
    return 'DonationBox';
  }
}
</script>
