<template>
  <div id="Omnibar" class="Flex">
    <img v-if="!isHek" id="Logo">
    <img
      v-else
      src="./hek.png"
      :style="{ width: '389px', height: '65px', padding: '0 10px', 'object-fit': 'contain' }"
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
// import SubGoalMet from './components/SubGoalMet.vue';
import Ticker from './components/Ticker.vue';
import Clock from './components/Clock.vue';
import Divider from './components/Divider.vue';

const runDataActiveRun = nodecg.Replicant('runDataActiveRun', 'nodecg-speedcontrol');

export default {
  name: 'Omnibar',
  components: {
    Total,
    // SubGoalMet,
    Ticker,
    Clock,
    Divider,
  },
  data() {
    return {
      isHek: false,
    };
  },
  created() {
    runDataActiveRun.on('change', (val) => {
      const isHek = runDataActiveRun.value && runDataActiveRun.value.customData.info === 'HEK';
      console.log(isHek);
      this.isHek = isHek;
    });
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
