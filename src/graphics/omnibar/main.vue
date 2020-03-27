<template>
  <div
    id="Omnibar"
    class="Flex"
  >
    <t-t-s></t-t-s>
    <img
      src="./logo.png"
      :style="{
        height: '60px',
        padding: '0 15px',
      }"
    >
    <divider></divider>
    <img
      src="./crisis.png"
      :style="{
        height: '60px',
        'padding-left': '10px',
      }"
    >
    <total></total>
    <divider></divider>
    <ticker></ticker>
    <divider></divider>
    <clock></clock>
  </div>
</template>

<script>
import TTS from '../_misc/components/TextToSpeech.vue';
import Total from './components/Total.vue';
import Ticker from './components/Ticker.vue';
import Clock from './components/Clock.vue';
import Divider from './components/Divider.vue';

export default {
  name: 'Omnibar',
  components: {
    TTS,
    Total,
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
