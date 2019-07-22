<template>
  <div id="Rotation">
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
import clone from 'clone';
import RunUpcoming from './RunUpcoming.vue';

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
    NodeCG.waitForReplicants(sc.runDataActiveRun).then(() => this.refreshUpcomingRuns());
    nodecg.listenFor('forceRefreshIntermission', this.refreshUpcomingRuns);
  },
  methods: {
    refreshUpcomingRuns() {
      this.nextRuns = clone(this.sc.getNextRuns().slice(1, 4));
    },
  },
};
</script>

<style>
  #Rotation {
    position: fixed;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
</style>
