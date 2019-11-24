<template>
  <div id="Rotation">
    <transition name="fade">
      <component
        :is="currentComponent"
        :next-runs="nextRuns"
        @end="showNextMsg"
      >
      </component>
    </transition>
  </div>
</template>

<script>
import UpcomingRuns from './Rotation/UpcomingRuns.vue';
import Bid from './Rotation/Bid.vue';
import Prize from './Rotation/Prize.vue';
import ImageSlide from './Rotation/ImageSlide.vue';
import VideoSlide from './Rotation/VideoSlide.vue';
// import Twitch from './Rotation/Twitch.vue';

const runDataActiveRun = nodecg.Replicant('runDataActiveRun', 'nodecg-speedcontrol');
const runDataArray = nodecg.Replicant('runDataArray', 'nodecg-speedcontrol');

export default {
  name: 'Rotation',
  data() {
    return {
      currentComponent: undefined,
      componentArray: [
        UpcomingRuns,
        Bid,
        Prize,
        Bid,
        Prize,
        ImageSlide,
        Bid,
        Prize,
        UpcomingRuns,
        Bid,
        Prize,
        Bid,
        Prize,
        ImageSlide,
        Bid,
        Prize,
        UpcomingRuns,
        Bid,
        Prize,
        Bid,
        Prize,
        VideoSlide,
        Bid,
        Prize,
      ],
      index: 0,
      nextRuns: [],
    };
  },
  mounted() {
    NodeCG.waitForReplicants(runDataActiveRun, runDataArray).then(() => {
      this.updateNextRuns();
      this.showNextMsg();
    });
    nodecg.listenFor('forceRefreshIntermission', () => this.updateNextRuns());
  },
  methods: {
    showNextMsg() {
      if (this.index >= this.componentArray.length) {
        this.index = 0;
      }

      this.currentComponent = this.componentArray[this.index];
      this.index += 1;
    },
    updateNextRuns() {
      this.nextRuns = this.getNextRuns();
    },
    getNextRuns() {
      const runIndex = this.findRunIndex();
      return runDataArray.value.slice(runIndex + 1).slice(0, 4);
    },
    findRunIndex() {
      if (!runDataActiveRun.value) {
        return -1;
      }
      return runDataArray.value.findIndex(run => run.id === runDataActiveRun.value.id);
    },
  },
};
</script>

<style>
  #Rotation {
    position: fixed;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity 1s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
