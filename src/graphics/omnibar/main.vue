<template>
  <div
    id="Omnibar"
    class="Flex"
  >
    <img
      src="./uksg_spring_logo.png"
      :style="{ padding: '0 10px' }"
    >
    <divider/>
    <total/>
    <divider/>
    <!--<sub-goal-met></sub-goal-met>
    <divider></divider>-->
    <ticker/>
    <divider/>
    <clock/>
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
