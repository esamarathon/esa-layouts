<template>
  <div class="Fixed">
    <transition name="fade">
      <component
        :is="currentComponent"
        @end="showNextSlide"
      />
    </transition>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import UpcomingRuns from './rotation/UpcomingRuns.vue';

@Component
export default class extends Vue {
  currentComponent: any | null = null;
  componentArray = [
    UpcomingRuns,
  ]
  index = 0;

  showNextSlide(): void {
    if (this.index >= this.componentArray.length - 1) {
      this.index = 0;
    } else {
      this.index += 1;
    }
    this.currentComponent = this.componentArray[this.index];
  }

  mounted(): void {
    this.showNextSlide();
  }
}
</script>

<style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity 1s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
