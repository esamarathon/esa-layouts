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
        <prize
          v-else-if="currentSlide === 2"
          :key="2"
          class="Slide"
          @end="showNextSlide()"
        />
        <media
          v-else-if="currentSlide === 3"
          :key="3"
          class="Slide"
          @end="showNextSlide()"
        />
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import UpcomingRuns from './Rotation/UpcomingRuns.vue';
import Bid from './Rotation/Bid.vue';
import Prize from './Rotation/Prize.vue';
import Media from './Rotation/Media.vue';
import { setCurrentBid } from './Rotation/Bid';
import { setCurrentPrize } from './Rotation/Prize';
import { setCurrentMedia } from './Rotation/Media';

@Component({
  components: {
    UpcomingRuns,
    Bid,
    Prize,
    Media,
  },
})
export default class extends Vue {
  currentSlide = 0;
  next = 0;

  showNextSlide(): void {
    this.next = this.next < 3 ? this.next + 1 : 0;

    // Upcoming Runs (always has something to display)
    if (this.next === 0) {
      this.currentSlide = 0;
      return;
    }
    // Bid
    if (this.next === 1 && setCurrentBid()) {
      this.currentSlide = 1;
      return;
    }
    // Prize
    if (this.next === 2 && setCurrentPrize()) {
      this.currentSlide = 2;
      return;
    }
    // Media
    if (this.next === 3 && setCurrentMedia()) {
      this.currentSlide = 3;
      return;
    }

    this.showNextSlide();
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
