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
  mounted() {
    if (!this.nextRuns.length) {
      this.$emit('end');
      return;
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
