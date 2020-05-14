<template>
  <div class="Fixed">
    <div
      :style="{
        position: 'relative',
        width: '100%',
        height: '100%',
      }"
    >
      <transition name="fade">
        <upcoming-runs
          v-if="currentSlide === 0"
          :key="0"
          class="Slide"
          @end="showNextSlide()"
        />
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import UpcomingRuns from './rotation/UpcomingRuns.vue';

const componentKey = {
  UpcomingRuns: 0,
};

@Component({
  components: {
    UpcomingRuns,
  },
})
export default class extends Vue {
  currentSlide = 0;
  slideCount = Object.keys(componentKey).length;

  showNextSlide(): void {
    // If we have only 1 component for some reason, no need to do anything.
    if (this.slideCount === 1) {
      return;
    }
    if (this.currentSlide >= this.slideCount - 1) {
      this.currentSlide = 0;
    } else {
      this.currentSlide += 1;
    }
  }
}
</script>

<style scoped>
  .Slide {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity 1s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
