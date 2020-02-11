<template>
  <div
    id="Total"
    class="Flex"
  >
    <span
      v-for="char in totalSplitString"
      :key="char"
      :class="(char === ',' ? 'Comma' : undefined)"
    >
      {{ char }}
    </span>
  </div>
</template>

<script>
import { TweenLite } from 'gsap';

const totalRep = nodecg.Replicant('donationTotal');

export default {
  name: 'Total',
  data() {
    return {
      init: false,
      total: -1,
      tweenedTotal: -1,
      totalSplitString: [],
    };
  },
  watch: {
    total(val) {
      if (this.init) {
        TweenLite.to(this.$data, 5, { tweenedTotal: val });
      } else {
        this.tweenedTotal = this.total;
        this.init = true;
      }
    },
    tweenedTotal(val) {
      const string = `$${val.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
      this.totalSplitString = string.split('');
    },
  },
  mounted() {
    totalRep.on('change', (newVal) => {
      this.total = newVal;
    });
  },
};
</script>

<style scoped>
  #Total {
    padding: 0 10px;
    font-size: 40px;
    font-weight: 500;
    min-width: 50px;
    text-align: center;
  }

  /* Each character in the total is in a span; setting width so the numbers appear monospaced. */
  #Total > span {
    display: inline-block;
    width: 0.45em;
    text-align: center;
  }
  #Total > .Comma {
    display: inline-block;
    width: 0.22em;
    text-align: center;
  }
</style>
