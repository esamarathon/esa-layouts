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
const current = nodecg.Replicant('currentSponsorLogo', { persistent: false });

export default {
  name: 'SponsorLogos',
  data() {
    return {
      show: false,
      imgSrc: '',
    };
  },
  mounted() {
    current.on('change', (newVal) => {
      if (newVal) {
        this.show = true;
        this.imgSrc = newVal.url;
      }
    });
  },
};
</script>

<style scoped>
  @import url('../../_misc/components/FlexContainer.css');

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
