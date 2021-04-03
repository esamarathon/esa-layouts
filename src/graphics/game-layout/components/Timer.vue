<template>
  <div>
    <div
      :class="`Flex Timer${timerState}`"
      :style="{
        'font-weight': 500,
        'font-size': fontSize,
        'margin-top': topMargin,
        transition: '1s',
        height: '100%',
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
          'margin-top': ([2, 5].includes(i)) ? '-0.1em' : 'unset',
        }"
      >
        {{ char }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator'; // eslint-disable-line object-curly-newline, max-len
import { State } from 'vuex-class';
import { Timer } from 'speedcontrol-util/types';
import { CurrentRunDelay, DelayedTimer } from '@esa-layouts/types/schemas';
import { msToTimeStr } from '../../_misc/helpers';

@Component
export default class extends Vue {
  @Prop({ type: String, default: '-0.07em' }) topMargin!: string;
  @Prop({ type: String, default: '100px' }) fontSize!: string;
  @State('delayedTimer') timer!: DelayedTimer;
  @State currentRunDelay!: CurrentRunDelay;
  timeStr = '00:00:00';
  backupTimerTO: number | undefined;

  /**
   * Backup timer that takes over if the connection to the server is lost.
   * Based on the last timestamp that was received.
   * When the connection is restored, the server timer will recover and take over again.
   */
  backupTimer(): void {
    this.backupTimerTO = window.setTimeout(() => this.backupTimer(), 200);
    if (!this.timer) {
      return;
    }
    if (this.timer.state === 'running') {
      const missedTime = Date.now() - this.timer.timestamp;
      const timeOffset = this.timer.milliseconds + missedTime;
      this.timeStr = msToTimeStr(timeOffset);
    }
  }

  @Watch('timer', { immediate: true })
  onTimerChange(val: Timer): void {
    this.timeStr = val.time;

    // Backup timer (see above).
    clearTimeout(this.backupTimerTO);
    this.backupTimerTO = window.setTimeout(() => this.backupTimer(), 1000);
  }

  get timerState(): string {
    if (!this.timer) {
      return 'Stopped';
    }
    return this.timer.state.charAt(0).toUpperCase() + this.timer.state.slice(1);
  }
}
</script>
