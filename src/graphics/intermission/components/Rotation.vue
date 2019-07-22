<template>
  <div id="Rotation">
    <transition name="fade">
      <component
        :is="currentComponent"
        @end="showNextMsg"
      >
      </component>
    </transition>
  </div>
</template>

<script>
import UpcomingRuns from './Rotation/UpcomingRuns.vue';
import MediaSlide from './Rotation/MediaSlide.vue';

export default {
  name: 'Rotation',
  data() {
    return {
      currentComponent: undefined,
      componentArray: [
        UpcomingRuns,
        MediaSlide,
      ],
      index: 0,
    };
  },
  mounted() {
    this.showNextMsg();
  },
  methods: {
    showNextMsg() {
      if (this.index >= this.componentArray.length) {
        this.index = 0;
      }

      this.currentComponent = this.componentArray[this.index];
      this.index += 1;
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
