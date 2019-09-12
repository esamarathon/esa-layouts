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
const hashtag = require('../logo.png');
const ymLogo = require('../youngminds.png');

export default {
  name: 'RotatingLogos',
  data() {
    return {
      logo: undefined,
    };
  },
  mounted() {
    this.changeLogo();
  },
  methods: {
    changeLogo() {
      this.logo = (this.logo !== hashtag) ? hashtag : ymLogo;
      const time = (this.logo === ymLogo) ? 15 : 45;
      setTimeout(this.changeLogo, time * 1000);
    },
  },
};
</script>

<style scoped>
  @import url('../../_misc/components/FlexContainer.css');

  #RotatingLogos {
    padding: 0 15px;
  }

  #LogoWrapper {
    position: relative;
    width: 250px;
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
