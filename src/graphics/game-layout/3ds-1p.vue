<template>
  <div id="Layout">
    <!-- Game Captures -->
    <capture
      id="GameCapture1"
      class="GameCapture BorderBottom BorderLeft"
    ></capture>
    <capture
      id="GameCapture2"
      class="GameCapture BorderLeft"
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

    <!-- Information Storage (below game) -->
    <info-storage-box
      id="InfoStorageBox2"
      class="BorderLeft"
    >
      <game-name></game-name>
      <game-extra-info></game-extra-info>
      <timer></timer>
    </info-storage-box>

    <!-- Donations Bar -->
    <donations-bar class="BorderTop"></donations-bar>
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
    left: 695px;
    top: 0px;
    width: 1225px;
    height: 689px;
  }
  #GameCapture2 {
    left: 1525px;
    top: 689px;
    width: 395px;
    height: 311px;
  }

  #CameraCapture1 {
    left: 0px;
    top: 0px;
    width: 695px;
    height: 400px;
  }

  #DonationsBar {
    left: 0px;
    top: 940px;
    width: 1525px;
    height: 60px;
  }

  #InfoStorageBox1 {
    left: 0px;
    top: 400px;
    width: 695px;
    height: 540px;
  }

  #InfoStorageBox2 {
    justify-content: center;
    left: 695px;
    top: 689px;
    width: 830px;
    height: 251px;
  }
</style>
