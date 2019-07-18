<template>
  <div
    id="Total"
    class="FlexContainer"
  >
    ${{ animatedTotal }}
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
      tweenedTotal: 0,
    };
  },
  computed: {
    animatedTotal() {
      return this.tweenedTotal.toLocaleString('en-US', { maximumFractionDigits: 0 });
    },
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
  },
  mounted() {
    totalRep.on('change', (newVal) => {
      this.total = newVal;
    });
  },
};
</script>

<style scoped>
  @import url('../../_misc/components/FlexContainer.css');

  #Total {
    padding: 0 10px;
    font-size: 40px;
    font-weight: 500;
    min-width: 50px;
    text-align: center;
  }
</style>
