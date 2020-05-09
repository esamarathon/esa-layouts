<template>
  <div
    class="Capture Flex"
    :style="{
      'justify-content': 'flex-start',
      'align-items': 'flex-end',
    }"
  >
    <transition name="fade">
      <div
        v-if="typeof slotNo === 'number' && teamID && timer.teamFinishTimes[teamID]"
        :style="{
          'background-color': 'var(--border-colour)',
          padding: '5px 10px',
          'font-size': '30px',
        }"
      >
        🏁 {{ timer.teamFinishTimes[teamID].time }}
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'; // eslint-disable-line object-curly-newline, max-len
import { State } from 'vuex-class';
import { RunDataActiveRun, Timer } from 'speedcontrol-util/types';

@Component
export default class extends Vue {
  @State('runDataActiveRun') runData!: RunDataActiveRun;
  @State timer!: Timer;
  @Prop(Number) slotNo!: number;

  get teamID(): string | undefined {
    return this.runData?.teams[this.slotNo]?.id;
  }
}
</script>

<style scoped>
  /* Copied from old code, needs checking! */
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
