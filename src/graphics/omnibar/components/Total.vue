<template>
  <div
    id="Total"
    class="FlexContainer"
  >
    <img src="../alzheimerfonden.png">
    <span>
      ${{ animatedTotal }}
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
      total: 0,
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
      TweenLite.to(this.$data, 1, { tweenedTotal: val });
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
    height: 100%;
    padding: 0 10px;
    font-size: 40px;
    font-weight: 500;
  }

  #Total > span {
    padding-left: 10px;
    min-width: 70px;
    text-align: center;
  }
</style>
