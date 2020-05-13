<template>
  <div
    v-if="runData"
    class="UpcomingRun FlexColumn"
    :style="{
      width: '100%',
      height: '199px',
      'font-size': '41px',
    }"
  >
    <div
      class="Header Flex"
      :style="{
        width: '100%',
        height: '60px',
        'font-weight': 500,
        'text-transform': 'uppercase',
      }"
    >
      {{ etaUntil }}
    </div>
    <div
      class="Content FlexColumn"
      :style="{
        width: '100%',
        flex: 1,
      }"
    >
      <div>
        {{ runData.game }}
      </div>
      <div
        class="RunInfoExtra"
        :style="{ 'font-size': '30px' }"
      >
        <span v-if="runData.category">
          {{ runData.category }}
        </span>
        <span v-if="runData.system">
          {{ runData.system }}
        </span>
        <span v-if="getRunTotalPlayers(runData) > 0">
          {{ formPlayerNamesStr(runData) }}
        </span>
        <span v-if="runData.estimate">
          {{ runData.estimate }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { UpcomingRunID } from 'schemas';
import { RunData, RunDataArray } from 'speedcontrol-util/types';
import SpeedcontrolUtil from 'speedcontrol-util/browser';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
const sc = new SpeedcontrolUtil(nodecg);

@Component
export default class extends Vue {
  @State runDataArray!: RunDataArray;
  @State upcomingRunID!: UpcomingRunID;
  @Prop({ default: 0 }) slotNo!: number;
  getRunTotalPlayers = SpeedcontrolUtil.getRunTotalPlayers;
  formPlayerNamesStr = SpeedcontrolUtil.formPlayerNamesStr;

  get nextRuns(): RunData[] {
    const runIndex = sc.findRunIndex(this.upcomingRunID);
    if (runIndex >= 0) {
      return this.runDataArray.slice(runIndex, runIndex + this.slotNo + 1);
    }
    return [];
  }

  get runData(): RunData | undefined {
    return this.nextRuns[this.slotNo];
  }

  get etaUntil(): string {
    if (this.slotNo === 0) {
      return 'Coming Up Next';
    }
    const prevTime = this.nextRuns
      .slice(0, -1)
      .reduce((prev, run) => prev + (run.estimateS || 0) + (run.setupTimeS || 0), 0);
    return `Coming Up In About ${dayjs().second(0).to(dayjs().second(prevTime), true)}`;
  }
}
</script>

<style scoped>
  .RunInfoExtra > span:not(:last-child)::after {
    content: ' /';
  }
</style>
