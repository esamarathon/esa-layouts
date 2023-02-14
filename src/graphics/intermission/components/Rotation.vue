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
          v-if="current?.type === 'UpcomingRuns'"
          :key="`${current.id}_UpcomingRuns`"
          class="Slide"
          @end="showNextSlide()"
        />
        <media
          v-else-if="current?.type === 'Media'"
          :key="`${current.id}_Media`"
          class="Slide"
          :current="current"
          @end="showNextSlide()"
        />
        <bid
          v-else-if="current?.type === 'RandomBid'"
          :key="`${current.id}_RandomBid`"
          class="Slide"
          :current="current"
          @end="showNextSlide()"
        />
        <prize
          v-else-if="current?.type === 'RandomPrize'"
          :key="`${current.id}_RandomPrize`"
          class="Slide"
          :current="current"
          @end="showNextSlide()"
        />
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { IntermissionSlides } from '@esa-layouts/types/schemas';
import { Component, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';
import Bid from './Rotation/Bid.vue';
import Media from './Rotation/Media.vue';
import Prize from './Rotation/Prize.vue';
import UpcomingRuns from './Rotation/UpcomingRuns.vue';

@Component({
  components: {
    UpcomingRuns,
    Bid,
    Prize,
    Media,
  },
})
export default class extends Vue {
  @State intermissionSlides!: IntermissionSlides;

  get current(): IntermissionSlides['current'] {
    return this.intermissionSlides.current;
  }

  async showNextSlide(): Promise<void> {
    await nodecg.sendMessage('intermissionSlidesShowNext');
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
