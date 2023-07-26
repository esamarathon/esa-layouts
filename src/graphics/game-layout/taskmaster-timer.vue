<template>
  <div
    class="Flex"
    :style="{
      'font-weight': 500,
      'font-size': '150px',
      color: color,
    }"
  >
    <div
      :style="{
        'background-color': 'rgba(0,0,0,0.3)',
        'padding-left': '40px',
        'padding-right': '40px',
        'padding-bottom': '20px',
      }"
    >
      <span
        v-for="(char, i) in timerStr"
        :key="i"
        :style="{
          display: 'inline-block',
          width: ([2].includes(i)) ? '0.22em' : '0.45em',
          'text-align': 'center',
        }"
      >
        {{ char }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { TaskmasterTimestamps } from '@esa-layouts/types/schemas';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { State } from 'vuex-class';

@Component
export default class extends Vue {
  @State taskmasterTimestamps!: TaskmasterTimestamps;
  timerTO = 0;
  timer = 0;

  get timerStr(): string {
    if (!this.taskmasterTimestamps.end && this.taskmasterTimestamps.start) return '??.???';
    return (this.timer / 1000).toFixed(3).padStart(6, '0');
  }

  get color(): string {
    if (this.taskmasterTimestamps.end) {
      return 'white'; // STOPPED TIME
    }
    if (this.taskmasterTimestamps.start) {
      return '#fff073'; // TIMER GOING, NOT SHOWN MUCH?
    }
    return '#b7b7b7'; // SAT AT START
  }

  updateTimer(): void {
    if (this.taskmasterTimestamps.start) {
      const end = this.taskmasterTimestamps.end ?? Date.now();
      const length = end - this.taskmasterTimestamps.start;
      this.timer = length;
    } else {
      this.timer = 0;
    }
  }

  @Watch('taskmasterTimestamps')
  onTmtsChange(newVal?: TaskmasterTimestamps, oldVal?: TaskmasterTimestamps): void {
    if (newVal?.start && !oldVal?.start) {
      this.timerTO = window.setInterval(this.updateTimer, 1);
      console.log('starting cycle');
    } else if (newVal?.end && !oldVal?.end) {
      window.clearInterval(this.timerTO);
      console.log('ending cycle');
      this.updateTimer();
    } else if (!newVal?.start && !newVal?.end) {
      this.timer = 0;
    }
  }

  mounted(): void {
    this.updateTimer();
    if (this.taskmasterTimestamps.start && !this.taskmasterTimestamps.end) {
      this.timerTO = window.setInterval(this.updateTimer, 1);
      console.log('starting cycle');
    }
  }
}
</script>
