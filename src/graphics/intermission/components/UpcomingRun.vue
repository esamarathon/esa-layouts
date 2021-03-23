<template>
  <container
    v-if="runData"
    :style="{ width: '100%', height: '199px' }"
  >
    <template v-slot:header>
      {{ etaUntil }}
    </template>
    <template v-slot:content>
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
    </template>
  </container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { RunData } from 'speedcontrol-util/types';
import { SpeedcontrolUtilBrowser } from 'speedcontrol-util';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import Container from './Container.vue';

dayjs.extend(relativeTime);
dayjs.extend(utc);

@Component({
  components: {
    Container,
  },
})
export default class extends Vue {
  @State nextRuns!: RunData[];
  @Prop({ default: undefined }) runData!: RunData | undefined;
  @Prop({ default: 0 }) slotNo!: number;
  getRunTotalPlayers = SpeedcontrolUtilBrowser.getRunTotalPlayers;
  formPlayerNamesStr = SpeedcontrolUtilBrowser.formPlayerNamesStr;

  get etaUntil(): string {
    if (this.slotNo === 0) {
      return 'Coming Up Next';
    }
    const prevTime = this.nextRuns
      .slice(0, this.slotNo) // This gets all runs before this one.
      .reduce((prev, run) => prev + (run.estimateS || 0) + (run.setupTimeS || 0), 0);
    return `Coming Up In About ${dayjs().to(dayjs.unix((Date.now() / 1000) + prevTime), true)}`;
  }
}
</script>

<style scoped>
  .RunInfoExtra > span:not(:last-child)::after {
    content: ' /';
  }
</style>
