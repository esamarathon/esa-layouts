<template>
  <div
    v-if="bid"
    id="Bid"
  >
    <div class="Header">
      <span v-if="!bid.war">
        Upcoming Goal
      </span>
      <span v-else>
        Upcoming Bid War
      </span>
    </div>
    <div class="Body">
      <div class="RunName">
        {{ bid.game }} - {{ bid.category }}
      </div>
      <div class="BidName">
        {{ bid.name }}
      </div>
      <div
        v-if="!bid.war"
        class="BidAmount"
      >
        {{ formatUSD(bid.total) }}/{{ formatUSD(bid.goal) }}
      </div>
      <div
        v-else
        class="BidAmount"
      >
        <div v-if="bid.options.length">
          <div
            v-for="option in bid.options"
            :key="`${option.name}${option.total}`"
          >
            {{ option.name }} ({{ formatUSD(option.total) }})
          </div>
          <div v-if="bid.allowUserOptions">
            ...or you could submit your own idea!
          </div>
        </div>
        <div v-else-if="bid.allowUserOptions">
          No options submitted yet, be the first!
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import clone from 'clone';

const bids = nodecg.Replicant('bids');

export default {
  name: 'Bid',
  data() {
    return {
      bid: undefined,
      lastBidID: null,
    };
  },
  mounted() {
    const chosenBid = this.getRandomBid();

    if (!chosenBid || !bids.value.length) {
      this.$emit('end');
      return;
    }

    this.bid = clone(chosenBid);
    setTimeout(() => this.$emit('end'), 20 * 1000);
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
        let weight = Math.max(Math.min(10 * 60 * 1000 / (_bid.endTime - Date.now()), 1), 0) ** 2;
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

<style>
  #Bid {
    position: absolute;
    display: flex;
    height: 100%;
    width: 100%;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
  }

  #Bid > .Header {
    width: 100%;
    font-weight: 500;
    height: 60px;
    line-height: 60px;
    background-color: var(--border-colour);
    color: white;
    font-size: 41px;
    text-transform: uppercase;
  }

  #Bid > .Body {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    background-color: rgba(0,0,0,0.3);
  }

  #Bid > .Body > div {
    margin: 10px;
  }

  #Bid > .Body > .RunName {
    font-size: 45px;
  }
  #Bid > .Body > .BidName {
    font-size: 32px;
  }
  #Bid > .Body > .BidAmount {
    font-size: 40px;
  }
</style>
