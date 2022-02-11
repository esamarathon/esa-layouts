<template>
  <v-app v-if="config.event.online">
    <span class="font-italic">
      Not used for online only events.
    </span>
  </v-app>
  <v-app v-else>
    <!-- Big button tag scanning alerts. -->
    <v-alert v-if="['success_player', 'success_comm'].includes(tagScanned)" type="success">
      <template v-if="tagScanned === 'success_player'">
        {{ scannedData.user.displayName }} scanned in as player on button
        {{ scannedData.flagcarrier.id }}
      </template>
      <template v-else-if="tagScanned === 'success_comm'">
        {{ scannedData.user.displayName }} scanned in as commentator on button
        {{ scannedData.flagcarrier.id }}
      </template>
    </v-alert>
    <v-alert v-else-if="tagScanned === 'fail_player'" type="error">
      {{ scannedData.user.displayName }} scanned in on button
      {{ scannedData.flagcarrier.id }} but already used by another team!
    </v-alert>
    <v-alert v-else-if="tagScanned">
      {{ scannedData.user.displayName }} scanned in on button
      {{ scannedData.flagcarrier.id }} but no action is needed.
    </v-alert>
    <v-alert v-else class="font-italic">
      Scan notifications will appear here.
    </v-alert>
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
      <v-btn
        class="mt-2"
        color="red"
        @click="force"
        block
        :disabled="disableChanges || !leftToScan.length"
      >
        <v-icon class="mr-2">mdi-alert</v-icon> Fill open slots
      </v-btn>
      <v-btn class="mt-2" @click="reset" block :disabled="disableChanges">
        Reset all player tag scanning
      </v-btn>
    </div>
  </v-app>
</template>

<script lang="ts">
import { replicantNS } from '@esa-layouts/browser_shared/replicant_store';
import { BigbuttonPlayerMap, Configschema } from '@esa-layouts/types/schemas';
import { Vue, Component } from 'vue-property-decorator';
import { RunDataActiveRun, RunDataArray, RunData, RunDataPlayer, Timer } from 'speedcontrol-util/types';
import { differenceWith } from 'lodash';
import { FlagCarrier } from '@esamarathon/mq-events/types';

@Component
export default class extends Vue {
  @replicantNS.State((s) => s.reps.timer) readonly timer!: Timer;
  @replicantNS.State((s) => s.reps.runDataArray) readonly runArray!: RunDataArray;
  @replicantNS.State((s) => s.reps.runDataActiveRun) readonly activeRun!: RunDataActiveRun;
  @replicantNS.State((s) => s.reps.bigbuttonPlayerMap) readonly bbpMap!: BigbuttonPlayerMap;
  config = nodecg.bundleConfig as Configschema;
  tagScanned: 'success_comm' | 'success_player' | 'fail_player' | boolean = false;
  scannedData: FlagCarrier.TagScanned | null = null;
  tagScanTimeout!: number;

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

  force(): void {
    nodecg.sendMessage('bigbuttonForceFillPlayers');
  }

  reset(): void {
    nodecg.sendMessage('bigbuttonResetPlayers');
  }

  created(): void {
    nodecg.listenFor(
      'bigbuttonTagScanned',
      ({ state, data }: {
        state?: 'success_comm' | 'success_player' | 'fail_player',
        data: FlagCarrier.TagScanned,
      }) => {
        window.clearTimeout(this.tagScanTimeout);
        this.tagScanned = state || true;
        this.scannedData = data;
        this.tagScanTimeout = window.setTimeout(() => {
          this.tagScanned = false;
          this.scannedData = null;
        }, 7000);
      },
    );
  }
}
</script>
