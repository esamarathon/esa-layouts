<template>
  <v-app>
    <div v-if="!activeRun || !activeRunInArr">
      There is currently no active run available.
    </div>
    <div v-else>
      <div v-if="!activeRun.teams.length">
        <div>
          <span class="font-weight-bold">Players left to scan:</span>
          <span v-if="!leftToScan.length">All scanned</span>
          <span v-else>{{ leftToScan.map((p) => p.name).join(', ') }}</span>
        </div>
        <div>
          <span class="font-weight-bold">Players currently scanned:</span>
          <span v-if="!allScannedPlayers.length">None</span>
          <span v-else>{{ allScannedPlayers.map((p) => p.user.displayName).join(', ') }}</span>
        </div>
      </div>
      <div v-else>
        All players scanned!
      </div>
      <div class="mt-2">
        <span class="text-h6">Button to Player Mappings</span>
        <template v-if="mapArr.length">
          <div v-for="[key, value] in mapArr" :key="key">
            <template v-if="value.length">
              <span class="font-weight-bold">Button {{ key }}:</span>
              <span>{{ value.map((p) => p.user.displayName).join(', ') }}</span>
            </template>
          </div>
        </template>
        <div v-else>No button to player mapping to show.</div>
      </div>
      <v-btn class="mt-2" @click="reset" block :disabled="disableChanges">
        Reset All Player Tag Scanning
      </v-btn>
    </div>
  </v-app>
</template>

<script lang="ts">
import { replicantNS } from '@esa-layouts/browser_shared/replicant_store';
import { BigbuttonPlayerMap } from '@esa-layouts/types/schemas';
import { Vue, Component } from 'vue-property-decorator';
import { RunDataActiveRun, RunDataArray, RunData, RunDataPlayer, Timer } from 'speedcontrol-util/types';
import { differenceWith } from 'lodash';

@Component
export default class extends Vue {
  @replicantNS.State((s) => s.reps.timer) readonly timer!: Timer;
  @replicantNS.State((s) => s.reps.runDataArray) readonly runArray!: RunDataArray;
  @replicantNS.State((s) => s.reps.runDataActiveRun) readonly activeRun!: RunDataActiveRun;
  @replicantNS.State((s) => s.reps.bigbuttonPlayerMap) readonly bbpMap!: BigbuttonPlayerMap;

  get mapArr(): [string, BigbuttonPlayerMap[0]][] {
    return Object.entries(this.bbpMap);
  }

  get activeRunInArr(): RunData | undefined {
    return this.runArray.find((r) => r.id === this.activeRun?.id);
  }

  get allPlayersRun(): RunDataPlayer[] {
    return this.activeRunInArr?.teams
      .reduce<RunDataPlayer[]>((prev, team) => prev.concat(...team.players), []) || [];
  }

  get allScannedPlayers(): BigbuttonPlayerMap[0] {
    const arr = Object.values(this.bbpMap)
      .reduce<BigbuttonPlayerMap[0]>((prev, button) => prev.concat(...button), []);
    return arr;
  }

  get leftToScan(): RunDataPlayer[] {
    return differenceWith(this.allPlayersRun, this.allScannedPlayers, (x, y) => x.name
      .toLowerCase() === y.user.displayName.toLowerCase());
  }

  get disableChanges(): boolean {
    return this.timer.state !== 'stopped';
  }

  reset(): void {
    nodecg.sendMessage('bigbuttonResetPlayers');
  }
}
</script>
