<template>
  <div
    class="Fixed Flex"
    :style="{
      position: 'relative',
    }"
  >
    <transition name="fade">
      <img
        v-if="current"
        :key="current.id"
        :src="current.url"
        :style="{
          position: 'absolute',
          'object-fit': 'contain',
          width: '100%',
          height: '100%',
          padding: '30px',
          'box-sizing': 'border-box',
        }"
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
  .fade-enter-active, .fade-leave-active {
    transition: opacity 1s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
