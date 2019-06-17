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
      <player-info-box></player-info-box>
      <commentator-box></commentator-box>
      <game-name-box></game-name-box>
      <game-extra-info-box></game-extra-info-box>
      <timer-box></timer-box>
    </info-storage-box>

    <!-- Donation Bar -->
    <donations-bar></donations-bar>
  </div>
</template>

<script>
import Capture from './components/Capture.vue';
import CommentatorBox from './components/CommentatorBox.vue';
import DonationsBar from './components/DonationsBar.vue';
import GameExtraInfoBox from './components/GameExtraInfoBox.vue';
import GameNameBox from './components/GameNameBox.vue';
import InfoStorageBox from './components/InfoStorageBox.vue';
import PlayerInfoBox from './components/PlayerInfoBox.vue';
import TimerBox from './components/TimerBox.vue';

export default {
  name: 'Layout',
  components: {
    Capture,
    DonationsBar,
    PlayerInfoBox,
    CommentatorBox,
    InfoStorageBox,
    GameNameBox,
    GameExtraInfoBox,
    TimerBox,
  },
};
</script>

<style scoped>
  #GameCapture1 {
    left: 668px;
    top: 0px;
    width: 1252px;
    height: 940px;
  }

  #CameraCapture1 {
    left: 0px;
    top: 0px;
    width: 668px;
    height: 380px;
  }

  #DonationsBar {
    left: 668px;
    top: 940px;
    width: 1252px;
    height: 60px;
  }

  #InfoStorageBox {
    left: 0px;
    top: 380px;
    width: 668px;
    height: 620px;
  }
</style>
