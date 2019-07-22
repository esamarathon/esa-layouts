<template>
  <div id="UpcomingRuns">
    <run-upcoming
      v-for="run in nextRuns"
      :key="`${Date.now()}${run.id}`"
      :data="run"
      :when="true"
    ></run-upcoming>
  </div>
</template>

<script>
import SpeedcontrolUtil from 'speedcontrol-util';
import RunUpcoming from '../RunUpcoming.vue';

const sc = new SpeedcontrolUtil(nodecg);

export default {
  name: 'Rotation',
  components: {
    RunUpcoming,
  },
  data() {
    return {
      nextRuns: [],
    };
  },
  created() {
    NodeCG.waitForReplicants(sc.runDataActiveRun).then(() => {
      this.nextRuns = sc.getNextRuns().slice(1, 4);
    });
  },
  mounted() {
    setTimeout(() => this.$emit('end'), 20 * 1000);
  },
};
</script>

<style>
  #UpcomingRuns {
    position: absolute;
    display: flex;
    height: 100%;
    width: 100%;
    flex-direction: column;
    justify-content: space-around;
  }
</style>
