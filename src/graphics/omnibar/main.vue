<template>
  <div
    id="Omnibar"
    class="Flex"
    :style="{
      width: '1920px',
      height: '80px',
      position: 'fixed',
      zoom,
    }"
  >
    <template v-if="theme === 'swcf'">
      <img
        :style="{ 'padding-left': '25px' }"
        src="../_misc/themes/swcf/OmnibarLogoGGTalentGroup.png"
      >
      <img
        :style="{ 'padding-left': '35px' }"
        src="../_misc/themes/swcf/OmnibarLogoDoGoodPoints.png"
      >
      <div :style="{ 'flex-grow': 1 }" /><!-- Filler div -->
      <total /><!-- Donation Total -->
    </template>
    <template v-else>
      <img id="Logo"><!-- Logo -->
      <divider />
      <total /><!-- Donation Total -->
      <divider />
      <ticker /><!-- Ticker -->
      <divider />
      <clock /><!-- Clock -->
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getZoomAmountCSS } from '../_misc/helpers';
import Clock from './components/Clock.vue';
import Divider from './components/Divider.vue';
import Ticker from './components/Ticker.vue';
import Total from './components/Total.vue';

@Component({
  components: {
    Divider,
    Total,
    Ticker,
    Clock,
  },
})
export default class extends Vue {
  theme = nodecg.bundleConfig.event.theme;
  zoom = getZoomAmountCSS();
}
</script>
