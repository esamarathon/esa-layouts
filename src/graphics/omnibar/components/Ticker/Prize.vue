<template>
  <div
    v-if="prize"
    id="Prize"
    class="Flex"
  >
    <div class="Line1">
      Prize Available: {{ prize.name }}
    </div>
    <div class="Line2">
      Provided by {{ prize.provided }}, minimum donation amount: ${{ prize.minimumBid.toFixed(2) }}
      (donate in the next {{ getPrizeTimeUntilString(prize) }})
    </div>
  </div>
</template>

<script>
import clone from 'clone';
import moment from 'moment';

const prizes = nodecg.Replicant('prizes');

export default {
  name: 'Prize',
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
      prize: undefined,
    };
  },
  created() {
    const fallback = setTimeout(() => this.$emit('end'), 5000);
    if (!prizes.value.length) {
      this.$emit('end');
    } else {
      // We only want to show prizes that are actually applicable right now!
      const activePrizes = prizes.value.filter((prize) => (
        !!prize.startTime && !!prize.endTime
        && Date.now() > prize.startTime && Date.now() < prize.endTime
      ));
      const randNum = Math.floor(Math.random() * activePrizes.length);
      this.prize = clone(activePrizes[randNum]);
      clearTimeout(fallback);
      setTimeout(() => this.$emit('end'), 25 * 1000);
    }
  },
  methods: {
    getPrizeTimeUntilString(prize) {
      let timeUntil = moment.unix(prize.endTime / 1000).fromNow(true);
      timeUntil = timeUntil.replace('an ', ''); // Dirty fix for "Donate in the next an hour".
      timeUntil = timeUntil.replace('a ', ''); // Dirty fix for "Donate in the next a day".
      return timeUntil;
    },
  },
};
</script>

<style scoped>
  #Prize {
    padding: 0 17px;
    height: 100%;
    font-weight: 500;
    flex-direction: column;
    align-items: flex-start;
  }

  .Line1 {
    font-size: 26px;
  }
  .Line2 {
    font-size: 20px;
  }
</style>
