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
import { Vue, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { Tracker } from '@shared/types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import updateLocale from 'dayjs/plugin/updateLocale';
import Container from '../Container.vue';
import { formatUSD } from '../../../_misc/helpers';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(updateLocale);
// These locales may be updated for the whole page and that annoys me.
dayjs.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: 'a few seconds',
    m: 'a minute',
    mm: '%d minutes',
    h: 'an hour',
    hh: '%d hours',
    d: 'a day',
    dd: '%d days',
    M: 'a month',
    MM: '%d months',
    y: 'a year',
    yy: '%d years',
  },
});

@Component({
  components: {
    Container,
  },
})
export default class extends Vue {
  @State('currentPrize') prize!: Tracker.FormattedPrize | undefined;
  formatUSD = formatUSD;

  get etaUntil(): string | undefined {
    return this.prize?.endTime ? dayjs.unix(this.prize.endTime / 1000).fromNow(true) : undefined;
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
