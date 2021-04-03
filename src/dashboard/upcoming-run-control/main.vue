<template>
  <v-app>
    <div :style="{ 'font-style': 'italic', 'margin-bottom': '5px' }">
      This should only need to be used if the automatically set one is incorrect.
    </div>
    <div :style="{ overflow: 'hidden', 'white-space': 'nowrap' }">
      <span :style="{ 'font-weight': 'bold' }">
        Currently Set:
      </span>
      <span
        v-if="upcomingRunID"
        :title="getRunStr(upcomingRunID)"
      >
        {{ getRunStr(upcomingRunID) }}
      </span>
      <span v-else>
        none
      </span>
    </div>
    <div
      v-for="(type, i) in ['previous', 'current', 'next']"
      :key="i"
      :style="{ 'margin-top': '5px' }"
    >
      <v-btn
        v-if="runDataActiveRunSurrounding[type]"
        class="ForceUpcomingRunBtn"
        width="100%"
        block
        :title="getRunStr(runDataActiveRunSurrounding[type])"
        @click="forceUpcomingRun(runDataActiveRunSurrounding[type])"
      >
        <div
          class="d-flex justify-center"
          :style="{ width: '100%' }"
        >
          <div :style="{ overflow: 'hidden' }">
            Force to {{ type }} ({{ getRunStr(runDataActiveRunSurrounding[type]) }})
          </div>
        </div>
      </v-btn>
      <v-btn
        v-else
        width="100%"
        block
        disabled
      >
        {{ type }} not available
      </v-btn>
    </div>
    <v-btn
      :style="{ 'margin-top': '5px' }"
      @click="forceUpcomingRun()"
    >
      Force to nothing
    </v-btn>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { RunDataActiveRunSurrounding, RunDataArray } from 'speedcontrol-util/schemas';
import { UpcomingRunID } from '@esa-layouts/types/schemas';

@Component
export default class IntermissionControl extends Vue {
  @State runDataArray!: RunDataArray;
  @State runDataActiveRunSurrounding!: RunDataActiveRunSurrounding;
  @State upcomingRunID!: UpcomingRunID;

  forceUpcomingRun(id?: string): void {
    nodecg.sendMessage('forceUpcomingRun', id);
  }

  getRunStr(id: string): string {
    const run = this.runDataArray.find((r) => r.id === id);
    if (run) {
      const arr = [
        run.game || '?',
        run.category,
      ].filter(Boolean);
      return arr.join(' - ');
    }
    return '?';
  }
}
</script>

<style>
  .ForceUpcomingRunBtn > .v-btn__content {
    width: 100%;
  }
</style>
