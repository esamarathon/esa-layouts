<!-- This component handles displays each player's information within a team. -->
<!-- This is added dynamically to the PlayerContainer component when we need to show this. -->
<!-- It is initialised with the info, it does not listen to nodecg-speedcontrol itself. -->

<template>
  <div
    v-if="show"
    class="PlayerInfoBox RunInfoBox FlexContainer"
  >
    <div class="PlayerIcon">
      <transition name="fade">
        <img
          :key="playerIcon"
          :src="playerIcon"
        >
      </transition>
    </div>
    <div class="PlayerName FlexContainer">
      <transition name="fade">
        <span :key="text">
          {{ text }}
        </span>
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

export default {
  name: 'PlayerInfo',
  props: {
    players: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      text: '',
      show: false,
      showFlag: false,
      playerIcon: playerSoloImg,
      index: 0,
    };
  },
  created() {
    // Listen to the main.js file for animation timing.
    serverBus.$on('playerShowTwitch', (show) => {
      if (!show) {
        this.changePlayer();
      } else if (this.players[this.index].social.twitch) {
        this.playerIcon = twitchIconImg;
        this.text = `/${this.players[this.index].social.twitch}`;
      }
    });
    this.changePlayer(true);
    this.show = true;
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
      this.playerIcon = playerSoloImg;
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

  .PlayerInfoBox > .PlayerIcon {
    height: 100%;
    width: 100px;
    text-align: left;
    position: relative;
  }

  .PlayerInfoBox > .PlayerIcon > img {
    height: 100%;
    position: absolute;
    filter: var(--icon-colour-inversion);
  }

  .PlayerInfoBox > .PlayerName {
    flex: 1;
    position: relative;
  }

  .PlayerInfoBox > .PlayerName > span {
    position: absolute;
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
