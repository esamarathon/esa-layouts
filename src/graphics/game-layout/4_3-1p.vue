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
      <player-info></player-info>
      <commentators></commentators>
      <game-name></game-name>
      <game-extra-info></game-extra-info>
      <timer></timer>
    </info-storage-box>

    <!-- Donations Bar -->
    <donations-bar></donations-bar>
  </div>
</template>

<script>
import Capture from './components/Capture.vue';
import Commentators from './components/Commentators.vue';
import DonationsBar from './components/DonationsBar.vue';
import GameExtraInfo from './components/GameExtraInfo.vue';
import GameName from './components/GameName.vue';
import InfoStorageBox from './components/InfoStorageBox.vue';
import PlayerInfo from './components/PlayerInfo.vue';
import Timer from './components/Timer.vue';

export default {
  name: 'Layout',
  components: {
    Capture,
    DonationsBar,
    PlayerInfo,
    Commentators,
    InfoStorageBox,
    GameName,
    GameExtraInfo,
    Timer,
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
