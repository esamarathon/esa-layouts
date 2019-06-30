<template>
  <div id="Layout">
    <!-- Game Captures -->
    <capture
      id="GameCapture1"
      class="GameCapture BorderLeft BorderBottom"
    ></capture>

    <!-- Camera Captures -->
    <capture
      id="CameraCapture1"
      class="CameraCapture"
    ></capture>

    <!-- Information Storage (below camera) -->
    <info-storage-box id="InfoStorageBox1">
      <player-container :team-id="0"></player-container>
      <commentators></commentators>
      <sponsor-logos></sponsor-logos>
    </info-storage-box>

    <!-- Information Storage (below game, left) -->
    <info-storage-box
      id="InfoStorageBox2"
      class="BorderLeft"
    >
      <game-name></game-name>
      <game-extra-info></game-extra-info>
    </info-storage-box>

    <!-- Information Storage (below game, right) -->
    <info-storage-box
      id="InfoStorageBox3"
      class="BorderLeft"
    >
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
import PlayerContainer from './components/PlayerContainer.vue';
import SponsorLogos from './components/SponsorLogos.vue';
import Timer from './components/Timer.vue';

export default {
  name: 'Layout',
  components: {
    Capture,
    DonationsBar,
    PlayerContainer,
    Commentators,
    InfoStorageBox,
    GameName,
    GameExtraInfo,
    Timer,
    SponsorLogos,
  },
};
</script>

<style scoped>
  #GameCapture1 {
    left: 533px;
    top: 0px;
    width: 1387px;
    height: 780px;
  }

  #CameraCapture1 {
    left: 0px;
    top: 0px;
    width: 533px;
    height: 400px;
  }

  #DonationsBar {
    left: 0px;
    top: 940px;
    width: 1920px;
    height: 60px;
  }

  #InfoStorageBox1 {
    left: 0px;
    top: 400px;
    width: 533px;
    height: 540px;
  }

  #InfoStorageBox2 {
    justify-content: center;
    left: 533px;
    top: 780px;
    width: 1000px;
    height: 160px;
  }

  #InfoStorageBox3 {
    left: 1533px;
    top: 780px;
    width: 387px;
    height: 160px;
  }

  #TimerBox {
    height: 100%;
  }
</style>
