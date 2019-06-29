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
    <div
      :style="{ 'opacity' : showFlag ? 1 : 0 }"
      class="Flag FlexContainer"
    >
      <transition name="fade">
        <img
          :key="country"
          :src="`/bundles/esa-layouts/static/flags/${country}.png`"
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
    name: {
      type: String,
      default: '',
    },
    twitch: {
      type: String,
      default: '',
    },
    country: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      text: '',
      show: false,
      showFlag: false,
      showTwitch: false,
      playerIcon: playerSoloImg,
    };
  },
  watch: {
    showTwitch(show) {
      if (show) {
        this.playerIcon = twitchIconImg;
        this.text = `/${this.twitch}`;
      } else {
        this.playerIcon = playerSoloImg;
        this.text = this.name;
      }
    },
  },
  created() {
    // Listen to the main.js file for animation timing.
    serverBus.$on('playerShowTwitch', (showTwitch) => {
      // This doesn't need toggling if no Twitch username exist.
      if (this.twitch) {
        this.showTwitch = showTwitch;
      }
    });
    this.text = this.name;
    if (this.country) {
      this.showFlag = true;
    }
    this.show = true;
  },
};
</script>

<style scoped>
  @import url('./RunInfoBox.css');
  @import url('../../_misc/components/FlexContainer.css');

  .PlayerInfoBox {
    background-color: #ffbd16;
    color: black;
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
    position: absolute;
    border: 2px solid black;
    height: calc(100% - 4px);
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity 1s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
