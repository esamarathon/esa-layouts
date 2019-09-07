<!-- This component handles displays each player's information within a team. -->
<!-- This is added dynamically to the PlayerContainer component when we need to show this. -->
<!-- It is initialised with most info, it only listens to nodecg-speedcontrol for finish times. -->

<template>
  <div
    v-if="show"
    class="PlayerInfoBox RunInfoBox FlexContainer"
  >
    <div class="currentIcon">
      <transition name="fade">
        <img
          :key="currentIcon"
          :src="currentIcon"
        >
      </transition>
    </div>
    <div class="PlayerName FlexContainer">
      <transition name="fade">
        <div :key="text">
          <transition name="fade">
            <span
              :key="finishTime"
              class="FinishTime"
            >
              {{ finishTime }}
            </span>
          </transition>
          <span>{{ text }}</span>
        </div>
      </transition>
    </div>
    <div class="Flag FlexContainer">
      <transition name="fade">
        <img
          :key="players[index].country"
          :style="{ 'visibility' : showFlag ? 'visbile' : 'hidden' }"
          :src="`/bundles/esa-layouts/static/flags/${players[index].country}.png`"
        >
      </transition>
    </div>
  </div>
</template>

<script>
import { serverBus } from '../main';

const playerSoloImg = require('../../_misc/player-solo.png');
const twitchIconImg = require('../../_misc/twitch-icon.png');
const playerImg1 = require('../../_misc/player-1.png');
const playerImg2 = require('../../_misc/player-2.png');
const playerImg3 = require('../../_misc/player-3.png');
const playerImg4 = require('../../_misc/player-4.png');

const playerImgNumbered = [
  playerImg1,
  playerImg2,
  playerImg3,
  playerImg4,
];

const runData = nodecg.Replicant('runDataActiveRun', 'nodecg-speedcontrol');
const timerRep = nodecg.Replicant('timer', 'nodecg-speedcontrol');

export default {
  name: 'PlayerInfo',
  props: {
    players: {
      type: Array,
      default() {
        return [];
      },
    },
    playerSlot: {
      type: Number,
      default: -1,
    },
    teamIndex: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      text: '',
      show: false,
      showFlag: false,
      currentIcon: playerSoloImg,
      playerIcon: playerSoloImg,
      index: 0,
      finishTime: '',
    };
  },
  created() {
    // Listen to the main.js file for animation timing.
    serverBus.$on('playerShowTwitch', (show) => {
      if (!show) {
        this.changePlayer();
      } else if (this.players[this.index].social.twitch) {
        this.currentIcon = twitchIconImg;
        this.text = `/${this.players[this.index].social.twitch}`;
      }
    });
    if (this.playerSlot >= 0) {
      this.playerIcon = playerImgNumbered[this.playerSlot];
    }
    this.currentIcon = this.playerIcon;
    this.changePlayer(true);
    this.show = true;
  },
  mounted() {
    NodeCG.waitForReplicants(
      timerRep,
      runData,
    ).then(() => timerRep.on('change', this.updateFinishTimer));
  },
  destroyed() {
    timerRep.removeListener('change', this.updateFinishTimer);
  },
  methods: {
    changePlayer(init) {
      if (!init) {
        this.index += 1;
        if (this.index >= this.players.length) {
          this.index = 0;
        }
      }

      this.text = this.players[this.index].name;
      if (this.players[this.index].country) {
        this.showFlag = true;
      } else {
        this.showFlag = false;
      }
      this.currentIcon = this.playerIcon;
    },
    updateFinishTimer(timer) {
      const teamId = (runData && this.playerSlot >= 0) ? runData.value.teams[this.playerSlot].id : undefined;
      if (teamId >= 0 && timer.teamFinishTimes[teamId]) {
        this.finishTime = `[${timer.teamFinishTimes[teamId].time}]`;
      } else {
        this.finishTime = '';
      }
    },
  },
};
</script>

<style scoped>
  @import url('./RunInfoBox.css');
  @import url('../../_misc/components/FlexContainer.css');

  .PlayerInfoBox {
    background-color: var(--border-colour);
    color: var(--font-colour-inverted);
    padding: 7px;
    font-weight: 500;
    font-size: 30px;
    height: 55px;
  }

  .PlayerInfoBox > .currentIcon {
    height: 100%;
    width: 100px;
    text-align: left;
    position: relative;
  }

  .PlayerInfoBox > .currentIcon > img {
    height: 100%;
    position: absolute;
    filter: var(--icon-colour-inversion);
  }

  .PlayerInfoBox > .PlayerName {
    flex: 1;
    position: relative;
  }

  .PlayerInfoBox > .PlayerName > div {
    position: absolute;
  }

  .PlayerInfoBox > .PlayerName > div > .FinishTime {
    color: var(--font-colour);
  }

  .PlayerInfoBox > .Flag {
    height: 100%;
    width: 100px;
    justify-content: flex-end;
    position: relative;
  }

  .PlayerInfoBox > .Flag > img {
    visibility: visible;
    position: absolute;
    border: 2px solid var(--font-colour-inverted);
    height: calc(100% - 4px);
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity 1s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
