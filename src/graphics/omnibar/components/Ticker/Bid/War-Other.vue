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
      Upcoming<br>Bid War
    </div>
    <div
      :style="{
        'flex-grow': 1,
        display: 'flex',
        margin: '10px',
        height: '60px',
        'background-color': 'rgba(0, 0, 0, 0.3)',
        overflow: 'hidden',
      }"
    >
      <div
        :style="{
          display: 'flex',
          'justify-content': 'center',
          'flex-direction': 'column',
          'font-size': '23px',
          'text-align': 'center',
          padding: '0 10px',
          'white-space': 'nowrap',
          'line-height': '100%',
        }"
      >
        {{ bid.game }}
        <br>{{ bid.name }}
      </div>
      <div
        :style="{
          width: '3px',
          'background-color': 'white',
        }"
      />
      <div
        ref="OptionsBar"
        :style="{
          position: 'relative',
          'flex-grow': 1,
          'white-space': 'nowrap',
          'font-size': '30px',
          overflow: 'hidden',
          display: 'flex',
          'align-items': 'center',
          'font-size': '23px',
        }"
      >
        <div
          v-for="(option, i) in options" :key="option.id"
          class="Option"
          :style="{
            // 'background-color': option.winning ? '#877520' : '#502f59', // ESA
            'background-color': option.winning ? '#68b4ea' : '#4d83aa', // UKSG
          }"
          :ref="`Option${i + 1}`"
        >
          <span :style="{ 'font-weight': 600 }">
            {{ option.name }}
            </span>: {{ formatUSD(option.total) }}
        </div>
        <div v-if="bid.allowUserOptions" class="Option" :ref="`Option${options.length + 1}`">
          <template v-if="!options.length">No options submitted yet, be the first!</template>
          <template v-else>...or submit your own!</template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { formatUSD } from '@esa-layouts/graphics/_misc/helpers';
import { Bids } from '@esa-layouts/types/schemas';
import { Vue, Component, Prop, Ref } from 'vue-property-decorator';
import gsap from 'gsap';
import { orderBy } from 'lodash';
import clone from 'clone';

/** This component does not implement the "pin" feature correctly yet! */

@Component
export default class extends Vue {
  @Prop({ type: Object, required: true }) readonly bidOriginal!: Bids[0];
  @Ref('OptionsBar') optionsBar!: HTMLElement;
  formatUSD = formatUSD;
  fallback = 0;
  bid!: Bids[0];

  get options(): { id: number, name: string, total: number, winning: boolean }[] {
    const ordered = orderBy(this.bid.options, ['total'], ['desc']);
    return ordered.map(({ id, name, total }, i) => (
      { id, name, total, winning: (i === 0 || total >= ordered[0].total) && total > 0 }));
  }

  getRef(name: string): HTMLElement {
    const rep: HTMLElement | HTMLElement[] = (this.$refs[name] as HTMLElement[]);
    return Array.isArray(rep) ? rep[0] : rep;
  }

  created(): void {
    this.bid = clone(this.bidOriginal);
  }

  async mounted(): Promise<void> {
    console.log('Bid: [War-Other] scrollWidth: %s', this.optionsBar.scrollWidth);
    console.log('Bid: [War-Other] clientWidth: %s', this.optionsBar.clientWidth);
    // If no need to scroll, just wait a flat 25 seconds before ending.
    if (this.optionsBar.scrollWidth <= this.optionsBar.clientWidth) {
      await new Promise((res) => window.setTimeout(res, 25 * 1000));
      this.$emit('end');
    } else {
      this.fallback = window.setTimeout(() => { this.$emit('end'); }, 30 * 1000);
      const timeline = gsap.timeline({
        paused: true,
        onComplete: () => {
          window.setTimeout(() => {
            window.clearTimeout(this.fallback);
            this.$emit('end');
          }, 4000);
        },
      });
      await new Promise((res) => window.setTimeout(res, 4000));
      const loopLength = this.bid.allowUserOptions ? this.options.length + 1 : this.options.length;

      // Check how many times we need to scroll along to fit everything in.
      let scrollCount = 0;
      for (let i = 1; i < loopLength; i += 1) {
        const rep = this.getRef(`Option${i + 1}`);
        const endPos = this.optionsBar.scrollWidth - this.optionsBar.clientWidth;
        if (endPos > rep.offsetLeft) scrollCount += 1;
      }

      // Add animations to timeline to scroll correctly.
      for (let i = 1; i < loopLength; i += 1) {
        const rep = this.getRef(`Option${i + 1}`);
        const endPos = this.optionsBar.scrollWidth - this.optionsBar.clientWidth;
        timeline.to(this.optionsBar, {
          scrollLeft: Math.min(rep.offsetLeft, endPos),
          duration: 2,
        }, i > 1 ? `+=${Math.max(17 / scrollCount, 2)}` : undefined);
        if (endPos <= rep.offsetLeft) break;
      }
      timeline.resume();
    }
  }
}
</script>

<style scoped>
  .Option {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 12px;
    font-size: 25px;
  }
</style>
