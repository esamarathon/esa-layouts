<template>
  <div id="app">
    <capture id="gameCapture1" />
    <capture id="camCapture1" />
  </div>
</template>

<script>
import Capture from './components/Capture.vue';

export default {
  name: 'App',
  components: {
    Capture,
  },
};
</script>

<style>
  #gameCapture1 {
    left: 587px;
    top: 0px;
    width: 1333px;
    height: 1000px;
  }

  #camCapture1 {
    left: 0px;
    top: 0px;
    width: 587px;
    height: 380px;
  }
</style>
