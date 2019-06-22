<template>
  <div
    id="SponsorLogoBox"
    class="FlexContainer"
  >
    <div class="SponsorLogo FlexContainer">
      <transition name="fade">
        <img
          v-if="show"
          :key="imgSrc"
          :src="imgSrc"
        >
      </transition>
    </div>
  </div>
</template>

<script>
const logos = nodecg.Replicant('assets:sponsor-logos');

export default {
  name: 'SponsorLogos',
  data() {
    return {
      show: false,
      imgSrc: '',
      index: 0,
    };
  },
  mounted() {
    NodeCG.waitForReplicants(logos).then(() => {
      if (!logos.value.length) {
        return;
      }
      this.showNextLogo();
      setInterval(this.showNextLogo, 10000);
    });
  },
  methods: {
    showNextLogo() {
      this.show = true;
      this.imgSrc = logos.value[this.index].url;
      this.index += 1;
      if (logos.value.length <= this.index) {
        this.index = 0;
      }
    },
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
    box-sizing: border-box;
    padding: 30px;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity 1s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
