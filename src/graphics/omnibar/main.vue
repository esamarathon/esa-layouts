<template>
  <div
    id="Omnibar"
    class="Flex"
  >
    <t-t-s></t-t-s>
    <img
      src="./logo.png"
      :style="{ padding: '0 10px' }"
    >
    <divider></divider>
    <total></total>
    <divider></divider>
    <sub-count></sub-count>
    <divider></divider>
    <ticker></ticker>
    <divider></divider>
    <clock></clock>
  </div>
</template>

<script>
import TTS from '../_misc/components/TextToSpeech.vue';
import Total from './components/Total.vue';
import SubCount from './components/SubCount.vue';
import Ticker from './components/Ticker.vue';
import Clock from './components/Clock.vue';
import Divider from './components/Divider.vue';

export default {
  name: 'Omnibar',
  components: {
    TTS,
    Total,
    SubCount,
    Ticker,
    Clock,
    Divider,
  },
};
</script>

<style>
  #Omnibar {
    position: fixed;
    width: 1920px;
    height: 80px;
    justify-content: flex-start;
  }
</style>
