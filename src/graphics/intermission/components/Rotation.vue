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
import SpeedcontrolUtil from 'speedcontrol-util';
import UpcomingRuns from './Rotation/UpcomingRuns.vue';
import Bid from './Rotation/Bid.vue';
import Prize from './Rotation/Prize.vue';
import ImageSlide from './Rotation/ImageSlide.vue';
import VideoSlide from './Rotation/VideoSlide.vue';
import Twitch from './Rotation/Twitch.vue';

const sc = new SpeedcontrolUtil(nodecg);

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
        Twitch,
        Prize,
        ImageSlide,
        Bid,
        Prize,
        UpcomingRuns,
        Bid,
        Twitch,
        Prize,
        Bid,
        Prize,
        ImageSlide,
        Bid,
        Twitch,
        Prize,
        UpcomingRuns,
        Bid,
        Prize,
        Bid,
        Twitch,
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
    NodeCG.waitForReplicants(sc.runDataActiveRun).then(() => {
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
      this.nextRuns = sc.getNextRuns().slice(0, 4);
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
