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
        <bid
          v-else-if="currentSlide === 1"
          :key="1"
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
import Bid from './rotation/Bid.vue';
import { setCurrentBid } from './rotation/Bid';

const componentKey = {
  UpcomingRuns: 0,
  Bid: 1,
  // Prize: 2,
  // MediaSlide: 3,
};

@Component({
  components: {
    UpcomingRuns,
    Bid,
  },
})
export default class extends Vue {
  currentSlide = 0;

  showNextSlide(): void {
    const next = this.currentSlide + 1;
    if (next === 1 && setCurrentBid()) {
      this.currentSlide = next;
    } else {
      this.currentSlide = 0;
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
