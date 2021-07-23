<template>
  <div v-if="bid" :style="{ height: '100%' }">
    <!-- Goal -->
    <goal v-if="bid && !bid.war" :bid="bid" @end="$emit('end')" />
    <!-- Wars -->
    <template v-else-if="bid">
      <!-- If we have exactly 2 options, it's a 1v1 bid war. -->
      <war1v1
        v-if="bid.options.length === 2 && !bid.allowUserOptions"
        :bid="bid"
        @end="$emit('end')"
      />
      <war-other v-else :bid="bid" @end="$emit('end')" />
    </template>
  </div>
</template>

<script lang="ts">
import { Bids } from '@esa-layouts/types/schemas';
import clone from 'clone';
import { Vue, Component } from 'vue-property-decorator';
import Goal from './Bid/Goal.vue';
import War1v1 from './Bid/War-1v1.vue';
import WarOther from './Bid/War-Other.vue';

const bids = nodecg.Replicant<Bids>('bids');
let lastBidId: number | null = null;

@Component({
  components: {
    Goal,
    War1v1,
    WarOther,
  },
})
export default class extends Vue {
  bid: Bids[0] | null = null;

  getRandomBid(): Bids[0] | null {
    const bidChoices: { bid: Bids[0], weight: number }[] = [];
    let totalWeight = 0;
    const bidsCopy = clone(bids.value);
    bidsCopy?.forEach((bid, i, arr) => {
      // anything within the next 10 minutes has a relative weight of 1,
      // beyond that theres a quadratic falloff
      let weight = Math
        .max(Math.min((10 * 60 * 1000) / ((bid.endTime ?? 0) - Date.now()), 1), 0) ** 2;
      if (bid.id === lastBidId && arr.length > 1) weight = 0;
      bidChoices.push({ bid, weight });
      totalWeight += weight;
    });
    let randomValue = Math.random();
    const bidToReturn = bidChoices.find((option) => {
      // the actual chance is the relative weight divided by the total weight
      const chance = option.weight / totalWeight;
      if (chance >= randomValue) {
        lastBidId = option.bid.id;
        return true;
      }
      randomValue -= chance;
      return false;
    });
    if (bidToReturn) return bidToReturn.bid;
    return null;
  }

  async created(): Promise<void> {
    console.log('Bid: created');
    await NodeCG.waitForReplicants(bids);
    const chosenBid = this.getRandomBid();
    if (chosenBid) {
      console.log('Bid: showing');
      this.bid = clone(chosenBid);
    } else {
      console.log('Bid: ended');
      this.$emit('end');
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
