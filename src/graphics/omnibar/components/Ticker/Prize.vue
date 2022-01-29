<template>
  <div
    class="Flex"
    :style="{
      padding: '0 17px',
      height: '100%',
      'font-weight': 500,
      'flex-direction': 'column',
      'align-items': 'flex-start',
    }"
  >
    <div :style="{ 'font-size': '26px' }">
      Prize Available: {{ prize.name }}
    </div>
    <div :style="{ 'font-size': '20px' }">
      Provided by {{ prize.provided }}, minimum donation amount: ${{ prize.minimumBid.toFixed(2) }}
      (donate in the next {{ timeUntilString }})
    </div>
  </div>
</template>

<script lang="ts">
import { wait } from '@esa-layouts/graphics/_misc/helpers';
import { Prizes } from '@esa-layouts/types/schemas';
import { Vue, Component, Prop } from 'vue-property-decorator';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import en from 'dayjs/locale/en-gb';

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
  name: 'Prize',
})
export default class extends Vue {
  @Prop({ type: Number, default: 25 }) readonly seconds!: number;
  @Prop({ type: Object, required: true }) readonly prize!: Prizes[0];

  get timeUntilString(): string {
    return this.prize.endTime
      ? dayjs.unix(this.prize.endTime / 1000).utc().locale('en-prizes').fromNow(true)
      : '';
  }

  async created(): Promise<void> {
    await wait(this.seconds * 1000); // Wait the specified length.
    this.$emit('end');
  }
}
</script>
