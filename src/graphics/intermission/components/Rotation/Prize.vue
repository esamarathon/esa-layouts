<template>
  <container v-if="prize">
    <template v-slot:header>
      Prize Available
    </template>
    <template v-slot:content>
      <img
        v-if="prize.image"
        :src="prize.image"
        :style="{
          height: '400px',
          'object-fit': 'contain',
        }"
      >
      <div :style="{ 'font-size': '40px' }">
        {{ prize.name }}
        <template v-if="prize.provided">
          provided by {{ prize.provided }}
        </template>
      </div>
      <div :style="{ 'font-size': '30px' }">
        Minimum donation amount: {{ formatUSD(prize.minimumBid) }}
      </div>
      <div
        v-if="etaUntil"
        :style="{ 'font-size': '30px' }"
      >
        Donate in the next {{ etaUntil }}
      </div>
    </template>
  </container>
</template>

<script lang="ts">
import { IntermissionSlides, Prizes } from '@esa-layouts/types/schemas';
import { Tracker } from '@shared/types';
import dayjs from 'dayjs';
import en from 'dayjs/locale/en-gb';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { formatUSD } from '../../../_misc/helpers';
import Container from '../Container.vue';

dayjs.extend(relativeTime);
dayjs.extend(utc);

// Sets up custom locale (used later) to tweak some relativeTime strings.
dayjs.locale({
  ...en,
  name: 'en-prizes',
  relativeTime: {
    ...en.relativeTime,
    s: 'few seconds',
    m: 'minute',
    h: 'hour',
    d: 'day',
    M: 'month',
    y: 'year',
  },
}, {}, true);

@Component({
  components: {
    Container,
  },
})
export default class extends Vue {
  @State prizes!: Prizes;
  @Prop({ type: Object, required: true }) readonly current!: IntermissionSlides['current'];
  formatUSD = formatUSD;

  get prize(): Tracker.FormattedPrize | undefined {
    return this.prizes.find((p) => p.id === this.current?.prizeId);
  }

  get etaUntil(): string | undefined {
    return this.prize?.endTime
      ? dayjs.unix(this.prize.endTime / 1000).utc().locale('en-prizes').fromNow(true)
      : undefined;
  }

  mounted(): void {
    // We should always have a prize, this is just a backup in case.
    if (!this.prize) {
      this.$emit('end');
    } else {
      window.setTimeout(() => this.$emit('end'), 20 * 1000);
    }
  }
}
</script>
