<template>
  <div
    id="Logo"
    class="FlexContainer"
  >
    <img
      id="Cube"
      src="../logo.png"
    >
    <div
      id="TextWrapper"
      class="FlexContainer"
    >
      <transition name="fade">
        <img
          :key="text"
          :src="text"
          class="Text"
        >
      </transition>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line import/extensions
import { serverBus } from '../main.js';

const normal = require('../normal-logo-text.png');
const hashtag = require('../hashtag-logo-text.png');

export default {
  name: 'Logo',
  data() {
    return {
      text: normal,
      ticks: 0,
    };
  },
  mounted() {
    serverBus.$on('tick', () => {
      this.ticks += 1;
      if ((this.text === normal && this.ticks === this.calcTicks(50))
      || (this.text === hashtag && this.ticks === this.calcTicks(10))) {
        this.text = (this.text === normal) ? hashtag : normal;
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

  #Logo {
    height: 100%;
    padding: 0 7px;
  }

  #Cube {
    padding-right: 7px;
  }

  #TextWrapper {
    position: relative;
    width: 291px; /* Width of the text images, currently needing to be set manually. */
  }

  #TextWrapper > img {
    position: absolute;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity 1s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
