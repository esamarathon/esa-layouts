<template>
  <div
    class="Capture GameCapture Flex"
    :style="{
      'justify-content': finishTimePos.includes('left') ? 'flex-start' : 'flex-end',
      'align-items': finishTimePos.includes('top') ? 'flex-start' : 'flex-end',
      'font-size': '30px',
      'font-weight': 500,
    }"
  >
    <transition name="fade">
      <div
        v-if="typeof slotNo === 'number' && teamFinishTime"
        class="TeamFinishTime"
        :style="{
          padding: '5px 10px',
        }"
      >
        <template v-if="teamFinishTime.state === 'forfeit'">
          🏳️ Forfeit
        </template>
        <template v-else>
          🏁 {{ teamFinishTime.time }}
        </template>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'; // eslint-disable-line object-curly-newline, max-len
import { State } from 'vuex-class';
import { RunDataActiveRun, Timer, TeamFinishTime } from 'speedcontrol-util/types';
import clone from 'clone';
import { CurrentRunDelay } from 'schemas';

@Component
export default class extends Vue {
  @State('runDataActiveRun') runDataNoDelay!: RunDataActiveRun | undefined;
  @State('timer') timerNoDelay!: Timer;
  @State currentRunDelay!: CurrentRunDelay;
  @Prop(Number) slotNo!: number;
  @Prop({
    default: 'bottomleft',
    validator: (v) => ['topleft', 'topright', 'bottomleft', 'bottomright'].includes(v),
  }) finishTimePos!: 'topleft' | 'topright' | 'bottomleft' | 'bottomright';
  runData: RunDataActiveRun | null = null;
  timer: Timer | null = null;
  timerDelayTO: number[] = [];
  runDataDelayTO: number[] = [];

  @Watch('currentRunDelay', { immediate: true })
  onCurrentRunDelayChange(): void {
    // Wait 100ms then clear all the timeouts currently active.
    window.setTimeout(() => {
      while (this.timerDelayTO.length) {
        window.clearTimeout(this.timerDelayTO.shift());
      }
      while (this.runDataDelayTO.length) {
        window.clearTimeout(this.runDataDelayTO.shift());
      }
    }, 100);
  }

  @Watch('timerNoDelay', { immediate: true })
  onTimerNoDelayChange(val: Timer): void {
    const timerFreeze = clone(val);
    if (!this.timer || this.currentRunDelay === 0) {
      Vue.set(this, 'timer', timerFreeze);
    } else {
      this.timerDelayTO.push(window.setTimeout(() => {
        Vue.set(this, 'timer', timerFreeze);
      }, this.currentRunDelay));
    }
  }

  @Watch('runDataNoDelay', { immediate: true })
  onRunDataNoDelayChange(val: RunDataActiveRun): void {
    const runDataFreeze = clone(val);
    if (!this.runData || this.currentRunDelay === 0) {
      Vue.set(this, 'runData', runDataFreeze);
    } else {
      this.runDataDelayTO.push(window.setTimeout(() => {
        Vue.set(this, 'runData', runDataFreeze);
      }, this.currentRunDelay));
    }
  }

  get teamFinishTime(): TeamFinishTime | undefined {
    if ((this.runData?.teams.length || 0) < 2) {
      return undefined;
    }
    const teamID = this.runData?.teams[this.slotNo]?.id;
    return teamID ? this.timer.teamFinishTimes[teamID] : undefined;
  }

  beforeDestroy(): void {
    while (this.timerDelayTO.length) {
      window.clearTimeout(this.timerDelayTO.shift());
    }
    while (this.runDataDelayTO.length) {
      window.clearTimeout(this.runDataDelayTO.shift());
    }
  }
}
</script>

<style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
