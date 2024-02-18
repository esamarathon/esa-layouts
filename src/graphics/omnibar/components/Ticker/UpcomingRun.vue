<template>
  <div
    class="Flex"
    :style="{
      padding: '0 17px',
      height: '100%',
      'font-weight': 500,
      'flex-direction': 'column',
      'align-items': 'flex-start',
    }"
  >
    <div :style="{ 'font-size': '25px' }">
      Coming up {{ when }}: {{ run.game }}
    </div>
    <div :style="{ 'font-size': '22px' }">
      <span v-if="run.category">
        {{ run.category }}
      </span>
      <span v-if="run.system">
        ran on {{ run.system }}
      </span>
      <span v-if="getRunTotalPlayers(run) > 0">
        with {{ formPlayerNamesStr(run) }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { wait } from '@esa-layouts/graphics/_misc/helpers';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import { SpeedcontrolUtilBrowser } from 'speedcontrol-util';
import { RunData } from 'speedcontrol-util/types';
import { Component, Prop, Vue } from 'vue-property-decorator';

dayjs.extend(relativeTime);
dayjs.extend(utc);

@Component({
  name: 'UpcomingRun',
})
export default class extends Vue {
  @Prop({ type: Number, default: 25 }) readonly seconds!: number;
  @Prop({ type: Object, required: true }) readonly run!: RunData;
  getRunTotalPlayers = SpeedcontrolUtilBrowser.getRunTotalPlayers;

  get when(): string {
    // Show relative time string if possible and run is actually in the future.
    return this.run.scheduledS && this.run.scheduledS > (Date.now() / 1000)
      ? `in about ${dayjs.utc().to(dayjs.unix(this.run.scheduledS), true)}`
      : 'soon';
  }

  formPlayerNamesStr(runData: RunData): string {
    return runData.teams.map((team) => (
      team.name || team.players.map((player) => player.name).join(', ')
    )).join(' vs. ') || 'N/A';
  }

  async created(): Promise<void> {
    await wait(this.seconds * 1000); // Wait the specified length.
    this.$emit('end');
  }
}
</script>
