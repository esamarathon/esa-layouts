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
    NodeCG.waitForReplicants(sc.runDataActiveRun, sc.runDataArray).then(() => this.refreshUpcomingRuns());
    nodecg.listenFor('forceRefreshIntermission', this.refreshUpcomingRuns);
  },
  methods: {
    refreshUpcomingRuns() {
      this.nextRuns = JSON.parse(JSON.stringify(this.getNextRuns()));
      console.log(this.nextRuns);
    },
    getNextRuns() {
      const nextRuns = [];
      const indexOfCurrentRun = this.findIndexInRunDataArray(sc.runDataActiveRun.value);
      for (let i = 2; i <= 4; i += 1) {
        if (!sc.runDataArray.value[indexOfCurrentRun + i]) {
          break;
        }
        nextRuns.push(JSON.parse(JSON.stringify(sc.runDataArray.value[indexOfCurrentRun + i])));
      }
      return nextRuns;
    },
    findIndexInRunDataArray(run) {
      let indexOfRun = -1;

      // Completely skips this if the run variable isn't defined.
      if (run) {
        for (let i = 0; i < sc.runDataArray.value.length; i += 1) {
          if (run.id === sc.runDataArray.value[i].id) {
            indexOfRun = i;
            break;
          }
        }
      }

      return indexOfRun;
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
