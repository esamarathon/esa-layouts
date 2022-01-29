<template>
  <div
    class="WarOther"
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
          :class="{
            'Option': true,
            'OptionWinning': option.winning,
            'OptionOther': !option.winning,
          }"
          :style="{ 'margin-left': i > 0 ? '5px' : '0' }"
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
import { formatUSD, wait } from '@esa-layouts/graphics/_misc/helpers';
import { Bids } from '@esa-layouts/types/schemas';
import { Vue, Component, Prop, Ref } from 'vue-property-decorator';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { orderBy } from 'lodash';
import clone from 'clone';

gsap.registerPlugin(ScrollToPlugin);

@Component
export default class extends Vue {
  @Prop({ type: Number, required: true }) readonly seconds!: number;
  @Prop({ type: Object, required: true }) readonly bidOriginal!: Bids[0];
  @Ref('OptionsBar') optionsBar!: HTMLElement;
  formatUSD = formatUSD;
  bid!: Bids[0];
  timeline: gsap.core.Timeline | undefined;

  get options(): { id: number, name: string, total: number, winning: boolean }[] {
    const ordered = orderBy(this.bid.options, ['total'], ['desc']);
    return ordered.map(({ id, name, total }, i) => (
      { id, name, total, winning: (i === 0 || total >= ordered[0].total) && total > 0 }));
  }

  getRef(name: string): HTMLElement {
    const rep: HTMLElement | HTMLElement[] = (this.$refs[name] as HTMLElement[]);
    return Array.isArray(rep) ? rep[0] : rep;
  }

  async created(): Promise<void> {
    // Copied in case the prop changes and ruins the animations.
    // In the current setup, this doesn't happen though (or shouldn't!).
    this.bid = clone(this.bidOriginal);
  }

  async mounted(): Promise<void> {
    // If no need to scroll, just wait a flat X seconds before ending.
    if (this.optionsBar.scrollWidth <= this.optionsBar.clientWidth) {
      if (this.seconds >= 0) {
        await wait(this.seconds * 1000);
        this.$emit('end');
      }
    } else {
      this.timeline = gsap.timeline({
        paused: true,
        onComplete: () => {
          window.setTimeout(() => {
            if (this.seconds >= 0) {
              this.$emit('end');
            } else {
              // If pinned, restart the timeline on end.
              this.timeline?.restart();
            }
          }, 4000);
        },
      });
      await wait(4000);
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
        this.timeline.to(this.optionsBar, {
          scrollLeft: Math.min(rep.offsetLeft, endPos),
          duration: 2,
        }, i > 1 ? `+=${Math.max((this.seconds - 8) / (scrollCount + 1), 2)}` : undefined);
        if (endPos <= rep.offsetLeft) break;
      }

      // If pinned, scroll back to the start on finish.
      if (this.seconds < 1) {
        this.timeline.to(this.optionsBar, {
          scrollTo: { x: 0 },
          duration: 2,
        }, '+=4');
      }

      this.timeline.resume();
    }
  }

  beforeDestroy(): void {
    this.timeline?.kill();
    delete this.timeline;
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
