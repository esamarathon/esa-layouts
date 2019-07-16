<template>
  <div
    id="Omnibar"
    class="FlexContainer"
  >
    <t-t-s></t-t-s>
    <static-logo></static-logo>
    <rotating-logos></rotating-logos>
    <divider></divider>
    <total></total>
    <divider></divider>
    <ticker></ticker>
    <divider></divider>
    <clock></clock>
  </div>
</template>

<script>
import TTS from './components/TTS.vue';
import StaticLogo from './components/StaticLogo.vue';
import RotatingLogos from './components/RotatingLogos.vue';
import Total from './components/Total.vue';
import Ticker from './components/Ticker.vue';
import Clock from './components/Clock.vue';
import Divider from './components/Divider.vue';

export default {
  name: 'Omnibar',
  components: {
    TTS,
    StaticLogo,
    RotatingLogos,
    Total,
    Ticker,
    Clock,
    Divider,
  },
};
</script>

<style>
  @import url('../_misc/components/FlexContainer.css');

  #Omnibar {
    position: fixed;
    width: 1920px;
    height: 80px;
    justify-content: flex-start;
  }
</style>
