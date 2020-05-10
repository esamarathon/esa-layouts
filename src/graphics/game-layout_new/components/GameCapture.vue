<template>
  <div
    class="Capture Flex"
    :style="{
      'justify-content': 'flex-start',
      'align-items': 'flex-end',
      'font-size': '30px',
      'font-weight': '500',
      color: 'white',
    }"
  >
    <transition name="fade">
      <div
        v-if="typeof slotNo === 'number' && teamFinishTime"
        :style="{
          'background-color': 'var(--border-colour)',
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
import { Vue, Component, Prop } from 'vue-property-decorator'; // eslint-disable-line object-curly-newline, max-len
import { State } from 'vuex-class';
import { RunDataActiveRun, Timer } from 'speedcontrol-util/types';
import { TeamFinishTime } from 'nodecg-speedcontrol/types'; // should expose in sc-util

@Component
export default class extends Vue {
  @State('runDataActiveRun') runData!: RunDataActiveRun;
  @State timer!: Timer;
  @Prop(Number) slotNo!: number;

  get teamFinishTime(): TeamFinishTime | undefined {
    const teamID = this.runData?.teams[this.slotNo]?.id;
    return teamID ? this.timer.teamFinishTimes[teamID] : undefined;
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
