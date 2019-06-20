<template>
  <div
    v-if="show"
    id="PlayerInfoBox"
    class="RunInfoBox FlexContainer"
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
        <span :key="name">
          {{ name }}
        </span>
      </transition>
    </div>
    <div
      v-if="showFlag"
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
// import Vue from 'vue';

const playerSoloImg = require('../player-solo.png');
// const twitchIconImg = require('../twitch-icon.png');

export default {
  name: 'PlayerInfo',
  props: {
    name: {
      type: String,
      default: 'Player',
    },
    twitch: {
      type: String,
      default: '/twitch',
    },
    country: {
      type: String,
      default: 'gb',
    },
  },
  data() {
    return {
      text: '',
      countryCode: '',
      show: false,
      showFlag: true,
      playerIcon: playerSoloImg,
    };
  },
  created() {
    this.text = this.name;
    this.countryCode = this.country;
    this.show = true;
  },
  mounted() {
    // Vue.prototype.$sc.runDataActiveRun.on('change', this.updateData);
  },
  destroyed() {
    // Vue.prototype.$sc.runDataActiveRun.removeListener('change', this.updateData);
  },
  methods: {
    updateData(runData) {
      if (runData) {
        this.show = true;
        this.name = runData.teams[0].players[0].name;
        const { country } = runData.teams[0].players[0];
        if (country) {
          this.country = country;
          this.showFlag = true;
        } else {
          this.showFlag = false;
        }
      } else {
        this.show = false;
      }
    },
  },
};
</script>

<style scoped>
  @import url('./RunInfoBox.css');
  @import url('./FlexContainer.css');

  #PlayerInfoBox {
    font-weight: 500;
    margin-top: 3px;
    font-size: 40px;
    height: 60px;
  }

  #PlayerInfoBox > .PlayerIcon {
    height: 100%;
    width: 100px;
    text-align: left;
    position: relative;
  }

  #PlayerInfoBox > .PlayerIcon > img {
    height: 100%;
    position: absolute;
  }

  #PlayerInfoBox > .PlayerName {
    flex: 1;
    position: relative;
  }

  #PlayerInfoBox > .PlayerName > span {
    position: absolute;
  }

  #PlayerInfoBox > .Flag {
    height: 100%;
    width: 100px;
    justify-content: flex-end;
    position: relative;
  }

  #PlayerInfoBox > .Flag > img {
    position: absolute;
    border: 2px solid white;
    height: calc(100% - 4px);
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity 1s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
