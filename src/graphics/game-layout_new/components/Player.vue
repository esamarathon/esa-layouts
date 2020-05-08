<template>
  <div
    ref="Player"
    class="Flex"
    :style="{
      'background-color': 'var(--border-colour)',
      color: 'var(--font-colour-inverted)',
      'font-weight': '500',
      'font-size': '25px',
      width: '100%',
      height: '50px',
      padding: '7px',
      'box-sizing': 'border-box',
    }"
  >
    <img
      ref="PlayerIcon"
      src="../../_misc/PlayerIconSolo.png"
      :style="{
        filter: 'var(--icon-colour-inversion)',
        height: '100%',
      }"
    >
    <div
      ref="PlayerName"
      :style="{
        flex: '1',
        overflow: 'hidden',
        padding: '0 10px',
        'box-sizing': 'border-box',
      }"
    >
      <div
        class="Flex"
        :style="{
          width: '100%',
          'justify-content': 'flex-start',
        }"
      >
        <div class="PlayerName">
          zoton2
        </div>
      </div>
    </div>
    <div
      class="Flex"
      :style="{
        'font-size': '0.72em',
        'line-height': '75%',
        'text-align': 'center',
        'margin-right': '7px',
        padding: '0 5px',
        'background-color': 'white',
        color: 'black',
        height: '100%',
      }"
    >
      <!-- Examples for testing -->
      He/Him
      <!--She/Her-->
      <!--They/Them-->
    </div>
    <img
      ref="Flag"
      :src="`/bundles/esa-layouts/static/flags/gb/eng.png`"
      :style="{
        height: 'calc(100% - 4px)',
        border: '2px solid var(--font-colour-inverted)',
      }"
    >
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'; // eslint-disable-line object-curly-newline, max-len
import { State } from 'vuex-class';
import { NameCycle } from 'schemas';
import { RunDataActiveRun } from 'speedcontrol-util/types';
import { RunDataTeam, RunDataPlayer } from 'nodecg-speedcontrol/types'; // should expose in sc-util
import fitty from 'fitty';
import { waitForImages } from '../../_misc/helpers';

@Component
export default class extends Vue {
  @State('runDataActiveRun') runData!: RunDataActiveRun;
  @State nameCycle!: NameCycle;
  @Prop(Number) slotNo!: number;
  team: RunDataTeam | null = null;
  player: RunDataPlayer | null = null;
  playerIndex = 0;

  updateTeam(): void {
    this.team = this.runData?.teams[this.slotNo || 0] || null;
  }

  updatePlayer(): void {
    this.player = (this.team ? this.team.players[this.playerIndex] : null) || null;
  }

  created(): void {
    this.updateTeam();
    this.updatePlayer();
  }

  async mounted(): Promise<void> {
    const elem = this.$refs.Player as HTMLElement;
    const nameElem = this.$refs.PlayerName as HTMLElement;
    await waitForImages(this.$refs.PlayerIcon, this.$refs.Flag);
    nameElem.style.width = `${nameElem.clientWidth}px`;
    fitty('.PlayerName', { minSize: 1, maxSize: parseInt(elem.style.fontSize, 0) });
  }

  @Watch('runData')
  onRunDataChange(newVal: RunDataActiveRun, oldVal?: RunDataActiveRun): void {
    // Only reset the player if run is changed or player length is different.
    const newPlayers = newVal?.teams[this.slotNo || 0]?.players;
    const oldPlayers = oldVal?.teams[this.slotNo || 0]?.players;
    if (newVal?.id !== oldVal?.id && newPlayers?.length !== oldPlayers?.length) {
      this.playerIndex = 0;
    }
    this.updateTeam();
    this.updatePlayer();
  }

  @Watch('nameCycle')
  onNameCycleChange(newVal: NameCycle, oldVal: NameCycle): void {
    // If the name cycle resets, we need to move to the next player if applicable.
    if (newVal < oldVal) {
      if (this.team && this.team.players.length - 1 > this.playerIndex) {
        this.playerIndex += 1;
      } else {
        this.playerIndex = 0;
      }
      this.updatePlayer();
    }
  }
}
</script>
