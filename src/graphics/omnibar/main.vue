<template>
  <div
    id="Omnibar"
    class="Flex"
  >
    <img
      src="./uksg_autumn_logo.png"
      :style="{ padding: '0 10px' }"
    >
    <divider></divider>
    <img
      src="./crisis_logo.png"
      :style="{
        /* width: '150px', */
        padding: '0 10px 0 10px'
      }"
    >
    <total></total>
    <divider></divider>
    <!--<sub-goal-met></sub-goal-met>
    <divider></divider>-->
    <ticker></ticker>
    <divider></divider>
    <clock></clock>
  </div>
</template>

<script>
import Total from './components/Total.vue';
import SubGoalMet from './components/SubGoalMet.vue';
import Ticker from './components/Ticker.vue';
import Clock from './components/Clock.vue';
import Divider from './components/Divider.vue';

export default {
  name: 'Omnibar',
  components: {
    Total,
    SubGoalMet,
    Ticker,
    Clock,
    Divider,
  },
};
</script>

<style>
  #Omnibar {
    position: fixed;
    width: 1920px;
    height: 80px;
    justify-content: flex-start;
  }
</style>
