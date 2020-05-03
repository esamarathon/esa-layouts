<template>
  <div
    class="Flex"
    :style="{
      'font-weight': '500',
      'font-size': '100px',
      transition: '1s',
      color: textColour(),
    }"
  >
    <span
      v-for="(char, i) in timeStr"
      :key="i"
      :style="{
        display: 'inline-block',
        width: ([2, 5].includes(i)) ? '0.22em' : '0.45em',
        'text-align': 'center',
        // Make the colon appear more towards the centre.
        'margin-top': ([2, 5].includes(i)) ? '-0.15em' : 'unset',
      }"
    >
      {{ char }}
    </span>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { Timer } from 'speedcontrol-util/types';
import { msToTimeStr } from '../../_misc/helpers';

@Component
export default class extends Vue {
  @State timer!: Timer;
  timeStr = '00:00:00';
  backupTimerTO: number | undefined;

  @Watch('timer', { immediate: true })
  onTimerChange(val: Timer): void {
    this.timeStr = val.time;

    // Backup timer (see below).
    clearTimeout(this.backupTimerTO);
    this.backupTimerTO = window.setTimeout(() => this.backupTimer(), 1000);
  }

  /**
   * Currently these colours are being pulled from defaults.css, which should be changed.
   */
  textColour(): string {
    switch (this.timer.state) {
      default:
      case 'running':
        return getComputedStyle(document.documentElement).getPropertyValue('--timer-colour');
      case 'paused':
      case 'stopped':
        return getComputedStyle(document.documentElement).getPropertyValue('--timer-paused-colour');
      case 'finished':
        return getComputedStyle(document.documentElement).getPropertyValue('--timer-finish-colour');
    }
  }

  /**
   * Backup timer that takes over if the connection to the server is lost.
   * Based on the last timestamp that was received.
   * When the connection is restored, the server timer will recover and take over again.
   */
  backupTimer(): void {
    this.backupTimerTO = window.setTimeout(() => this.backupTimer(), 200);
    if (this.timer.state === 'running') {
      const missedTime = Date.now() - this.timer.timestamp;
      const timeOffset = this.timer.milliseconds + missedTime;
      this.timeStr = msToTimeStr(timeOffset);
    }
  }
}
</script>
