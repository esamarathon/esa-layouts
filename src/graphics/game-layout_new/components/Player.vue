<template>
  <div
    v-if="player"
    ref="Player"
    class="Flex"
    :style="{
      'justify-content': 'space-between',
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
    <!-- Player/Twitch Icon -->
    <div
      :style="{
        position: 'relative',
        height: '100%',
      }"
    >
      <transition name="fade">
        <img
          v-if="nameCycle === 1 && player.social.twitch"
          key="twitch"
          class="Icon"
          src="../../_misc/TwitchIcon.png"
        >
        <template v-else-if="typeof slotNo === 'number'">
          <img
            v-if="slotNo === 0"
            key="`name"
            class="Icon"
            src="../../_misc/PlayerIcon1.png"
          >
          <img
            v-else-if="slotNo === 1"
            key="`name"
            class="Icon"
            src="../../_misc/PlayerIcon2.png"
          >
          <img
            v-else-if="slotNo === 2"
            key="`name"
            class="Icon"
            src="../../_misc/PlayerIcon3.png"
          >
          <img
            v-else-if="slotNo === 3"
            key="`name"
            class="Icon"
            src="../../_misc/PlayerIcon4.png"
          >
        </template>
        <img
          v-else
          key="name"
          class="Icon"
          src="../../_misc/PlayerIconSolo.png"
        >
      </transition>
    </div>

    <!-- Player Name/Twitch -->
    <div
      class="Flex"
      :style="{
        position: 'relative',
        width: 'calc(100% - 130px)',
        height: '100%',
        overflow: 'hidden',
      }"
    >
      <transition name="fade">
        <div
          v-if="nameCycle === 1 && player.social.twitch"
          key="twitch"
          class="Flex TextWrapper"
        >
          <div class="PlayerText">
            /{{ player.social.twitch }}
          </div>
        </div>
        <div
          v-else
          key="name"
          class="Flex TextWrapper"
        >
          <div class="PlayerText">
            {{ player.name }}
          </div>
        </div>
      </transition>
    </div>

    <!-- Country Flag -->
    <div
      :style="{
        position: 'relative',
        height: '100%',
      }"
    >
      <transition name="fade">
        <img
          v-if="player.country"
          :key="player.country"
          :src="`/bundles/esa-layouts/static/flags/${player.country}.png`"
          :style="{
            position: 'absolute',
            right: '0',
            height: 'calc(100% - 4px)',
            border: '2px solid var(--font-colour-inverted)',
          }"
        >
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'; // eslint-disable-line object-curly-newline, max-len
import { State } from 'vuex-class';
import fitty from 'fitty';
import { NameCycle } from 'schemas';
import { RunDataActiveRun } from 'speedcontrol-util/types';
import { RunDataTeam, RunDataPlayer } from 'nodecg-speedcontrol/types'; // should expose in sc-util

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

  fit(): void {
    const elem = this.$refs.Player as HTMLElement;
    if (elem) {
      fitty('.PlayerText', {
        minSize: 1,
        maxSize: parseInt(elem.style.fontSize, 0),
      });
    }
  }

  created(): void {
    this.updateTeam();
    this.updatePlayer();
  }

  mounted(): void {
    this.fit();
  }

  @Watch('runData')
  async onRunDataChange(newVal: RunDataActiveRun, oldVal?: RunDataActiveRun): Promise<void> {
    // Only reset the player if run is changed or player length is different.
    const newPlayers = newVal?.teams[this.slotNo || 0]?.players;
    const oldPlayers = oldVal?.teams[this.slotNo || 0]?.players;
    if (newVal?.id !== oldVal?.id || newPlayers?.length !== oldPlayers?.length) {
      this.playerIndex = 0;
    }
    this.updateTeam();
    this.updatePlayer();
    await Vue.nextTick();
    this.fit();
  }

  @Watch('nameCycle')
  async onNameCycleChange(newVal: NameCycle, oldVal: NameCycle): Promise<void> {
    // If the name cycle resets, we need to move to the next player if applicable.
    if (newVal < oldVal) {
      if (this.team && this.team.players.length - 1 > this.playerIndex) {
        this.playerIndex += 1;
      } else {
        this.playerIndex = 0;
      }
      this.updatePlayer();
    }
    await Vue.nextTick();
    this.fit();
  }
}
</script>

<style scoped>
  .Icon {
    filter: var(--icon-colour-inversion);
    height: 100%;
    position: absolute;
  }

  .TextWrapper {
    width: 100%;
    height: 100%;
    position: absolute;
  }

  /* Copied from old code, needs checking! */
  .fade-enter-active, .fade-leave-active {
    transition: opacity 1s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
