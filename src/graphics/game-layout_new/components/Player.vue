<template>
  <div
    v-if="player"
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
    <!-- Player Icon/Name -->
    <div
      :style="{
        position: 'relative',
        height: '100%',
        'min-width': '0px',
        flex: '1',
      }"
    >
      <transition name="fade">
        <player-name
          v-if="nameCycle === 1 && player.social.twitch"
          :key="`twitch${playerIndex}`"
          type="twitch"
          :text="player.social.twitch"
        />
        <player-name
          v-else
          :key="`name${playerIndex}`"
          :text="player.name"
        />
      </transition>
    </div>

    <!-- Pronouns -->
    <!-- Placeholder code, needs changing when properly implemented! -->
    <div
      v-if="false"
      class="Flex"
      :style="{
        'font-size': '0.72em',
        'line-height': '75%',
        'text-align': 'center',
        'margin-right': player.country ? '7px' : 'unset',
        padding: '0 5px',
        'background-color': 'white',
        color: 'black',
        height: '100%',
      }"
    >
      He/Him
    </div>

    <!-- Country Flag -->
    <img
      v-if="player.country"
      :src="`/bundles/esa-layouts/static/flags/${player.country}.png`"
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
import PlayerName from './PlayerName.vue';

@Component({
  components: {
    PlayerName,
  },
})
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

  @Watch('runData')
  onRunDataChange(newVal: RunDataActiveRun, oldVal?: RunDataActiveRun): void {
    // Only reset the player if run is changed or player length is different.
    const newPlayers = newVal?.teams[this.slotNo || 0]?.players;
    const oldPlayers = oldVal?.teams[this.slotNo || 0]?.players;
    if (newVal?.id !== oldVal?.id || newPlayers?.length !== oldPlayers?.length) {
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

<style scoped>
  /* Copied from old code, needs checking! */
  .fade-enter-active, .fade-leave-active {
    transition: opacity 1s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
