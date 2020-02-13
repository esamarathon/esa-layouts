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
import { Asset } from 'types';

@Component
export default class extends Vue {
  @State sponsorLogoAssets!: Asset[];
  @State sponsorLogos!: SponsorLogos;

  get current(): { id: string; url: string} | undefined {
    const asset = this.sponsorLogoAssets.find((s) => s.sum === this.sponsorLogos.current.sum);
    return asset ? {
      id: this.sponsorLogos.current.id,
      url: asset.url,
    } : undefined;
  }
}
</script>

<style scoped>
  .SponsorLogo > img {
    position: absolute;
    box-sizing: border-box;
    padding: 50px;
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
