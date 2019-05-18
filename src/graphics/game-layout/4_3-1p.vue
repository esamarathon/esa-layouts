<template>
  <div id="Layout">
    <!-- Game Captures -->
    <capture
      id="GameCapture1"
      class="GameCapture"
    ></capture>

    <!-- Camera Captures -->
    <capture
      id="CameraCapture1"
      class="CameraCapture"
    ></capture>

    <!-- Information Storage -->
    <info-storage-box>
      <game-name-box></game-name-box>
      <game-extra-info-box></game-extra-info-box>
    </info-storage-box>
  </div>
</template>

<script>
import Capture from './components/Capture.vue';
import InfoStorageBox from './components/InfoStorageBox.vue';
import GameNameBox from './components/GameNameBox.vue';
import GameExtraInfoBox from './components/GameExtraInfoBox.vue';

export default {
  name: 'Layout',
  components: {
    Capture,
    InfoStorageBox,
    GameNameBox,
    GameExtraInfoBox,
  },
};
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Barlow+Condensed:500&subset=latin-ext');

  /* Needs adding to general layout CSS! */
  body {
    font-family: 'Barlow Condensed', sans-serif;
    color: white;
    overflow: hidden;
    margin: 0;
    padding: 0;
  }

  #GameCapture1 {
    left: 587px;
    top: 0px;
    width: 1333px;
    height: 1000px;
  }

  #CameraCapture1 {
    left: 0px;
    top: 0px;
    width: 587px;
    height: 380px;
  }

  #InfoStorageBox {
    left: 0px;
    top: 380px;
    width: 587px;
    height: 620px;
    padding-top: 5px;
  }
</style>
