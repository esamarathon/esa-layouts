<template>
  <div id="UpcomingRuns">
    <run-upcoming
      v-for="run in runs"
      :key="`${Date.now()}${run.id}`"
      :data="run"
    ></run-upcoming>
  </div>
</template>

<script>
import clone from 'clone';
import RunUpcoming from '../RunUpcoming.vue';

export default {
  name: 'UpcomingRuns',
  components: {
    RunUpcoming,
  },
  props: {
    nextRuns: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      runs: [],
      whenTotal: 0,
    };
  },
  mounted() {
    if (!this.nextRuns.length) {
      this.$emit('end');
      return;
    }

    for (let i = 0; i < this.nextRuns.length; i += 1) {
      const cloned = clone(this.nextRuns[i]);
      cloned.when = this.whenTotal;
      this.whenTotal += this.nextRuns[i].estimateS;
      this.whenTotal += this.nextRuns[i].setupTimeS;

      if (i !== 0) {
        this.runs.push(cloned);
      }
    }

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
