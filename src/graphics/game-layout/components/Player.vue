<template>
  <div
    v-if="player"
    ref="Player"
    class="Flex Player"
    :style="{
      'justify-content': 'space-between',
      'font-weight': 500,
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
        <template v-else-if="!coop && typeof slotNo === 'number'">
          <img
            v-if="slotNo === 0"
            key="name"
            class="Icon"
            src="../../_misc/PlayerIcon1.png"
          >
          <img
            v-else-if="slotNo === 1"
            key="name"
            class="Icon"
            src="../../_misc/PlayerIcon2.png"
          >
          <img
            v-else-if="slotNo === 2"
            key="name"
            class="Icon"
            src="../../_misc/PlayerIcon3.png"
          >
          <img
            v-else-if="slotNo === 3"
            key="name"
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
            <!-- Custom Title code repeated twice, needs cleaning up! -->
            <span
              v-if="formattedPronouns"
              class="Pronouns"
              :style="{
                padding: '3px 5px',
                'margin-left': '5px',
              }"
            >
              {{ formattedPronouns }}
            </span>
          </div>
        </div>
        <div
          v-else
          key="name"
          class="Flex TextWrapper"
        >
          <div class="PlayerText">
            {{ player.name }}
            <!-- Custom Title code repeated twice, needs cleaning up! -->
            <span
              v-if="formattedPronouns"
              class="Pronouns"
              :style="{
                padding: '3px 5px',
                'margin-left': '5px',
              }"
            >
              {{ formattedPronouns }}
            </span>
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
          class="Flag"
          :src="player.country ? `/bundles/esa-layouts/flags/${player.country}.png` : ''"
          :style="{
            position: 'absolute',
            right: '0',
            height: 'calc(100% - 4px)',
            'border-size': '2px',
            'border-style': 'solid',
            opacity: player.country ? 1 : 0,
          }"
        >
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'; // eslint-disable-line object-curly-newline, max-len
import { State } from 'vuex-class';
import fitty, { FittyInstance } from 'fitty';
import { NameCycle } from '@esa-layouts/types/schemas';
import { RunDataActiveRun, RunDataTeam, RunDataPlayer } from 'speedcontrol-util/types';
import { formatPronouns } from '../../_misc/helpers';

@Component
export default class extends Vue {
  @State('runDataActiveRun') runData!: RunDataActiveRun;
  @State('nameCycle') nameCycleServer!: NameCycle;
  @State coop!: boolean;
  @Prop(Number) slotNo!: number;
  team: RunDataTeam | null = null;
  player: RunDataPlayer | null = null;
  playerIndex = 0;
  nameCycle = 0; // "Local" name cycle used so we can let flags load.
  fittyPlayer: FittyInstance | undefined;

  get formattedPronouns(): string | undefined {
    return formatPronouns(this.player?.pronouns);
  }

  updateTeam(): void {
    if (this.coop && typeof this.slotNo === 'number') {
      // Makes a fake team with just 1 player in it.
      const player = this.runData?.teams[0]?.players[this.slotNo];
      this.team = player ? { id: player.id, players: [player] } : null;
    } else {
      this.team = this.runData?.teams[this.slotNo || 0] || null;
    }
  }

  async preloadFlag(player: RunDataPlayer | null): Promise<void> {
    if (!player || !player.country) {
      return;
    }
    await new Promise<void>((res) => {
      const img = new Image();
      const setAsLoaded = (): void => {
        img.removeEventListener('load', setAsLoaded);
        img.removeEventListener('error', setAsLoaded);
        res();
      };
      img.addEventListener('load', setAsLoaded);
      img.addEventListener('error', setAsLoaded);
      img.src = `/bundles/esa-layouts/flags/${player.country}.png`;
    });
  }

  async updatePlayer(): Promise<void> {
    const player = (this.team ? this.team.players[this.playerIndex] : null) || null;
    await this.preloadFlag(player);
    this.nameCycle = this.nameCycleServer;
    this.player = player;
  }

  fit(): void {
    const elem = this.$refs.Player as HTMLElement;
    if (elem) {
      [this.fittyPlayer] = fitty('.PlayerText', {
        minSize: 1,
        maxSize: parseInt(elem.style.fontSize, 10),
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

  destroyed(): void {
    if (this.fittyPlayer) {
      this.fittyPlayer.unsubscribe();
    }
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

  @Watch('nameCycleServer')
  async onNameCycleChange(newVal: NameCycle, oldVal: NameCycle): Promise<void> {
    // If the name cycle resets, we need to move to the next player if applicable.
    if (newVal < oldVal) {
      if (this.team && this.team.players.length - 1 > this.playerIndex) {
        this.playerIndex += 1;
      } else {
        this.playerIndex = 0;
      }
      this.updatePlayer();
    } else if (oldVal < newVal) {
      this.nameCycle = newVal; // Set "local" name cycle if cycle has only progressed.
    }
    await Vue.nextTick();
    this.fit();
  }
}
</script>

<style scoped>
  .Icon {
    height: 100%;
    position: absolute;
  }

  .TextWrapper {
    width: 100%;
    height: 100%;
    position: absolute;
    white-space: nowrap;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity 1s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
