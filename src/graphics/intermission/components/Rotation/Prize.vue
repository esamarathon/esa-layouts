<template>
  <div
    v-if="prize"
    id="Prize"
  >
    <div class="Header">
      Prize Available
    </div>
    <div class="Body">
      <img
        v-if="prize.image"
        class="Image"
        :src="prize.image"
      >
      <div class="Title">
        {{ prize.name }} provided by {{ prize.provided }}
      </div>
      <div class="MinAmount">
        Minimum donation amount: {{ formatUSD(prize.minimum_bid) }}
      </div>
      <div class="Deadline">
        Donate in the next {{ getPrizeTimeUntilString(prize) }}
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import clone from 'clone';

const prizes = nodecg.Replicant('prizes');

export default {
  name: 'Prize',
  data() {
    return {
      prize: undefined,
    };
  },
  mounted() {
    if (!prizes.value.length) {
      this.$emit('end');
      return;
    }
    const randNum = Math.floor(Math.random() * prizes.value.length);
    this.prize = clone(prizes.value[randNum]);
    setTimeout(() => this.$emit('end'), 20 * 1000);
  },
  methods: {
    formatUSD(amount) {
      return `$${amount.toFixed(2)}`;
    },
    getPrizeTimeUntilString(prize) {
      let timeUntil = moment(prize.end_timestamp).fromNow(true);
      timeUntil = timeUntil.replace('an ', ''); // Dirty fix for "Donate in the next an hour".
      timeUntil = timeUntil.replace('a ', ''); // Dirty fix for "Donate in the next a day".
      return timeUntil;
    },
  },
};
</script>

<style>
  #Prize {
    position: absolute;
    display: flex;
    height: 100%;
    width: 100%;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
  }

  #Prize > .Header {
    width: 100%;
    font-weight: 500;
    height: 60px;
    line-height: 60px;
    background-color: var(--border-colour);
    color: white;
    font-size: 41px;
    text-transform: uppercase;
  }

  #Prize > .Body {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    font-size: 41px;
    background-color: rgba(0,0,0,0.3);
  }

  #Prize > .Body > .Image {
    height: 400px;
    object-fit: contain;
  }

  #Prize > .Body > .Title {
    font-size: 40px;
  }

  #Prize > .Body > .MinAmount {
    font-size: 30px;
  }

  #Prize > .Body > .Deadline {
    font-size: 30px;
  }
</style>
