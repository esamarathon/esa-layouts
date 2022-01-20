<template>
  <div id="Omnibar" class="Flex">
    <img id="Logo">
    <divider/>
    <total/>
    <divider/>
    <ticker/>
    <divider/>
    <clock/>
  </div>
</template>

<script>
import Total from './components/Total.vue';
import Ticker from './components/Ticker.vue';
import Clock from './components/Clock.vue';
import Divider from './components/Divider.vue';

export default {
  name: 'Omnibar',
  components: {
    Total,
    Ticker,
    Clock,
    Divider,
  },
};
</script>

<style>
  #Background {
    background-color: #19171c;
  }

  #Omnibar {
    color: white;
    position: fixed;
    width: 1920px;
    height: 80px;
    justify-content: flex-start;
  }
</style>
