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
const hashtag = require('../hashtag-text.png');
const afLogo = require('../alzheimerfonden.png');

export default {
  name: 'RotatingLogos',
  data() {
    return {
      logo: hashtag,
    };
  },
  mounted() {
    this.changeLogo();
  },
  methods: {
    changeLogo() {
      this.logo = (this.logo === afLogo) ? hashtag : afLogo;
      const time = (this.logo === afLogo) ? 15 : 45;
      setTimeout(this.changeLogo, time * 1000);
    },
  },
};
</script>

<style scoped>
  @import url('../../_misc/components/FlexContainer.css');

  #RotatingLogos {
    padding-right: 7px;
  }

  #LogoWrapper {
    position: relative;
    width: 230px;
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
