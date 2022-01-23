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

@Component({
  name: 'Prize',
})
export default class extends Vue {
  @Prop({ type: Number, default: 25 }) readonly seconds!: number;
  @Prop({ type: Object, required: true }) readonly prize!: Prizes[0];

  // TODO: Implement day.js!
  get timeUntilString(): string {
    return this.prize.endTime?.toString() || '';
    /* let timeUntil = moment.unix(prize.endTime / 1000).fromNow(true);
    timeUntil = timeUntil.replace('an ', ''); // Dirty fix for "Donate in the next an hour".
    timeUntil = timeUntil.replace('a ', ''); // Dirty fix for "Donate in the next a day".
    return timeUntil; */
  }

  async created(): Promise<void> {
    await wait(this.seconds * 1000); // Wait the specified length.
    // TODO: Scroll if needed!
    this.$emit('end');
  }
}
</script>
