<template>
  <div
    id="SponsorLogoBox"
    class="Flex"
  >
    <div
      class="SponsorLogo Flex"
    >
      <transition name="fade">
        <img
          v-if="current"
          :key="current.id"
          :src="current.url"
        >
      </transition>
    </div>
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
    if (!this.sponsorLogoAssets) {
      return undefined;
    }
    const asset = this.sponsorLogoAssets.find((s) => s.sum === this.sponsorLogos.current?.sum);
    return asset && this.sponsorLogos.current ? {
      id: this.sponsorLogos.current.id,
      url: asset.url,
    } : undefined;
  }
}
</script>

<style scoped>
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
