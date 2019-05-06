<template>
  <div id="layout">
    <capture id="gameCapture1"></capture>
    <capture id="camCapture1"></capture>
  </div>
</template>

<script>
import Capture from './components/Capture.vue';

export default {
  name: 'Layout',
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
