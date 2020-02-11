<template>
  <div
    class="SponsorLogo Fixed Flex"
  >
    <transition name="fade">
      <img
        v-if="current"
        :key="current.id"
        :src="current.url"
      >
    </transition>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { SponsorLogos } from 'schemas';

@Component
export default class extends Vue {
  // @State('sponsorLogos') current!: SponsorLogos;
  current = null;
}
</script>

<style scoped>
  .SponsorLogo > img {
    position: absolute;
    box-sizing: border-box;
    padding: 60px;
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
