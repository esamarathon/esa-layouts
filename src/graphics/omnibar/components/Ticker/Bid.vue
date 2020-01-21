<template>
  <div
    v-if="bid"
    id="Bid"
    class="FlexContainer"
  >
    <div class="Line1">
      <span v-if="!bid.war">
        Upcoming Goal:
      </span>
      <span v-else>
        Upcoming Bid War:
      </span>
      {{ bid.game }} - {{ bid.category }}
    </div>
    <div
      ref="Line2"
      class="Line2"
      :style="{
        width: (width > 0) ? `${width}px` : 'inherit'
      }"
    >
      {{ bid.name }} ({{ bid.description }}):
      <span v-if="!bid.war">
        {{ formatUSD(bid.total) }}/{{ formatUSD(bid.goal) }}
      </span>
      <span v-else>
        <span
          v-if="bid.options.length"
          id="Options"
        >
          <span
            v-for="option in bid.options"
            :key="`${option.name}${option.total}`"
          >
            {{ option.name }} ({{ formatUSD(option.total) }})
          </span>
          <span v-if="bid.allow_user_options">
            ...or you could submit your own idea!
          </span>
        </span>
        <span v-else-if="bid.allow_user_options">
          No options submitted yet, be the first!
        </span>
      </span>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import clone from 'clone';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

const bids = nodecg.Replicant('bids');
let bid;

export default {
  name: 'Bid',
  props: {
    data: {
      type: Object,
      default() {
        return null;
      },
    },
  },
  data() {
    return {
      bid: undefined,
      lastBidID: null,
      width: 0,
    };
  },
  created() {
    const chosenBid = this.getRandomBid();

    if (!chosenBid) {
      this.$emit('end');
    } else {
      bid = clone(chosenBid);
    }
  },
  mounted() {
    const fallback = setTimeout(() => this.$emit('end'), 5000);
    const originalWidth = this.$parent.$el.clientWidth - 34;
    this.bid = bid;
    Vue.nextTick().then(() => {
      this.width = originalWidth;
      setTimeout(() => {
        clearTimeout(fallback);
        const amountToScroll = this.$refs.Line2.scrollWidth - originalWidth;
        const timeToScroll = (amountToScroll * 13) / 1000;
        const timeToShow = (timeToScroll > 25) ? timeToScroll : 21;
        gsap.to(this.$refs.Line2, timeToShow, {
          scrollTo: { x: 'max' },
          ease: 'none',
          onComplete: () => {
            setTimeout(() => this.$emit('end'), 2 * 1000);
          },
        });
      }, 2 * 1000);
    });
  },
  methods: {
    formatUSD(amount) {
      return `$${amount.toFixed(2)}`;
    },
    getRandomBid() {
      const bidChoices = [];
      let totalWeight = 0;
      const bidsCopy = clone(bids.value);
      bidsCopy.forEach((_bid) => {
        // anything within the next 10 minutes has a relative weight of 1,
        // beyond that theres a quadratic falloff
        let weight = Math.max(Math.min(10 * 60 * 1000 / (_bid.end_time - Date.now()), 1), 0) ** 2;
        if (_bid.id === this.lastBidID) weight = 0;
        bidChoices.push({ bid: _bid, weight });
        totalWeight += weight;
      });
      let randomValue = Math.random();
      const bidToReturn = bidChoices.find((option) => {
        // the actual chance is the relative weight divided by the total weight
        const chance = option.weight / totalWeight;
        if (chance >= randomValue) {
          this.lastBidID = option.bid.id;
          return true;
        }
        randomValue -= chance;
        return false;
      });
      if (bidToReturn) return bidToReturn.bid;
      return null;
    },
  },
};
</script>

<style scoped>
  @import url('../../../_misc/components/FlexContainer.css');

  #Bid {
    padding: 0 17px;
    height: 100%;
    font-weight: 500;
    flex-direction: column;
    align-items: flex-start;
  }

  .Line1 {
    font-size: 25px;
  }
  .Line2 {
    font-size: 23px;
    white-space: nowrap;
    overflow: hidden;
  }

  #Options > span:not(:last-of-type)::after {
    content: '/'
  }
</style>
