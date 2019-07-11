<template>
  <div
    id="RotatingLogos"
    class="FlexContainer"
  >
    <div
      id="LogoWrapper"
      class="FlexContainer"
    >
      <transition name="fade">
        <img
          :key="logo"
          :src="logo"
        >
      </transition>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line import/extensions
import { serverBus } from '../main.js';

const hashtag = require('../hashtag-text.png');
const afLogo = require('../alzheimerfonden.png');

export default {
  name: 'RotatingLogos',
  data() {
    return {
      logo: hashtag,
      ticks: 0,
    };
  },
  mounted() {
    serverBus.$on('tick', () => {
      this.ticks += 1;
      if ((this.logo === afLogo && this.ticks === this.calcTicks(15))
      || (this.logo === hashtag && this.ticks === this.calcTicks(45))) {
        this.logo = (this.logo === afLogo) ? hashtag : afLogo;
        this.ticks = 0;
      }
    });
  },
  methods: {
    calcTicks(seconds) {
      return seconds / 5;
    },
  },
};
</script>

<style scoped>
  @import url('../../_misc/components/FlexContainer.css');

  #RotatingLogos {
    height: 100%;
    padding-right: 7px;
  }

  #LogoWrapper {
    position: relative;
    width: 230px;
    height: 100%;
  }

  #LogoWrapper > img {
    position: absolute;
    max-width: 100%;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity 1s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
