<template>
  <div
    class="Flex"
    :style="{
      height: '100%',
      padding: '0 15px',
      'margin-right': '3px',
      'background-color': backgroundColor,
      color: fontColor,
      'font-weight': fontWeight,
      'font-size': `${fontSizeEm}em`,
    }"
  >
    ${{ Number.isInteger(donation.amount)
      ? donation.amount : donation.amount.toFixed(2)
    }} [{{ donation.donor_visiblename }}]
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { NotableDonations } from 'schemas';

@Component
export default class extends Vue {
  @Prop(Object) donation!: NotableDonations[0];
  backgroundColor = '#301b4c';
  fontColor = '#f1d13f';
  fontWeight = 500;
  fontSizeEm = 1;

  chooseRandShade(shades: string[]): string {
    const rand = Math.floor(Math.random() * shades.length);
    return shades[rand];
  }

  // TODO: move the font colours to external styling file!
  created(): void {
    if (this.donation.amount < 50) { // Under $50
      this.backgroundColor = this.chooseRandShade(['#301b4c', '#281643', '#502f59']);
    } else if (this.donation.amount >= 50 && this.donation.amount < 100) { // $50 - $100
      this.backgroundColor = this.chooseRandShade(['#f1d13f', '#fbd93f', '#e1c43c']);
      this.fontColor = '#604054';
      this.fontWeight = 600;
    } else if (this.donation.amount >= 100) { // $100+
      this.backgroundColor = '#efbe00';
      this.fontColor = '#604054';
      this.fontWeight = 700;
      this.fontSizeEm = 1.1;
    }
  }
}
</script>
