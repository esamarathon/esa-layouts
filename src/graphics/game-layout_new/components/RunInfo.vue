<template>
  <div
    v-if="runData"
    class="FlexColumn"
    :style="{
      'font-size': '40px',
    }"
  >
    <div
      v-if="runData.game"
      :style="{
        'font-weight': '500',
      }"
    >
      {{ runData.game }}
    </div>
    <div
      class="RunInfoExtra"
      :style="{
        'font-size': '0.75em',
        color: 'var(--font-colour-secondary)', // should be changed
      }"
    >
      <span v-if="runData.category">{{ runData.category }}</span>
      <span v-if="runData.system">{{ runData.system }}</span>
      <span v-if="runData.estimate">{{ runData.estimate }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { RunDataActiveRun } from 'speedcontrol-util/types';

@Component
export default class extends Vue {
  @State('runDataActiveRun') runData!: RunDataActiveRun;
}
</script>

<style scoped>
  .RunInfoExtra > span:not(:last-child)::after {
    content: ' /';
  }
</style>
