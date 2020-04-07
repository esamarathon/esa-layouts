<template>
  <div
    v-if="show"
    id="SubCount"
    class="Flex"
  >
    <div :style="{ 'font-size': '20px' }">
      Sub Points
    </div>
    <div :style="{ 'font-size': '25px', 'font-weight': '500' }">
      {{ flooredSubPoints }}/800
    </div>
    <div v-if="flooredSubPoints >= 800">
      GOAL MET!
    </div>
  </div>
</template>

<script>
import { TweenLite } from 'gsap';

const twitchSubscribers = nodecg.Replicant('twitchSubscribers');

export default {
  name: 'SubCount',
  data() {
    return {
      init: false,
      subPoints: -1,
      tweenedSubPoints: -1,
      show: false,
    };
  },
  watch: {
    subPoints(val) {
      if (this.init) {
        TweenLite.to(this.$data, 3, { tweenedSubPoints: val });
      } else {
        this.tweenedSubPoints = this.subPoints;
        this.init = true;
      }
    },
  },
  computed: {
    flooredSubPoints() {
      return Math.floor(this.tweenedSubPoints);
    },
  },
  mounted() {
    twitchSubscribers.on('change', (newVal) => {
      this.show = true;
      let correctedCount = newVal.totalPoints - 370; // Corrected manually!
      if (correctedCount < 0) {
        correctedCount = 0;
      }
      if (correctedCount !== this.total) {
        this.subPoints = correctedCount;
      }
    });
  },
};
</script>

<style scoped>
  #SubCount {
    font-weight: 400;
    width: 90px;
    text-align: center;
    flex-direction: column;
    line-height: 150%;
  }
</style>
