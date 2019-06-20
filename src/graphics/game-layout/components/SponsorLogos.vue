<template>
  <div
    id="SponsorLogoBox"
    class="FlexContainer"
  >
    <div class="SponsorLogo FlexContainer">
      <transition name="fade">
        <img
          :key="imgSrc"
          :src="imgSrc"
        >
      </transition>
    </div>
  </div>
</template>

<script>
// example of how to reference image
const sponsorLogo = require('../../twitch.png');

export default {
  name: 'SponsorLogos',
  data() {
    return {
      imgSrc: sponsorLogo,
    };
  },
};
</script>

<style scoped>
  @import url('./FlexContainer.css');

  #SponsorLogoBox {
    flex: 1; /* We *should* be inside a flex box! */
    width: 100%;
    box-sizing: border-box;
  }

  #SponsorLogoBox > .SponsorLogo {
    position: relative;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  #SponsorLogoBox > .SponsorLogo > img {
    position: absolute;
    max-height: calc(100% - 100px);
    max-width: calc(100% - 100px);
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity 1s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
