<template>
  <div id="Layout">
    <!-- Game Captures -->
    <capture
      id="GameCapture1"
      class="GameCapture BorderRight"
    ></capture>
    <capture
      id="GameCapture2"
      class="GameCapture"
    ></capture>

    <!-- Camera Captures -->
    <capture
      id="CameraCapture1"
      class="CameraCapture BorderTop BorderRight BorderLeft"
    ></capture>

    <!-- Information Storage (left) -->
    <info-storage-box id="InfoStorageBox1">
      <player-container
        :team-id="0"
        single
      ></player-container>
      <commentators></commentators>
      <sponsor-logos></sponsor-logos>
    </info-storage-box>

    <!-- Information Storage (right) -->
    <info-storage-box
      id="InfoStorageBox2"
      class=""
    >
      <player-container
        :team-id="1"
        single
      ></player-container>
      <div
        id="GameInfo"
        class="FlexContainer"
      >
        <game-name></game-name>
        <game-extra-info></game-extra-info>
        <timer></timer>
      </div>
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
import SponsorLogos from '../_misc/components/SponsorLogos.vue';
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
  .GameCapture {
    width: 960px;
    height: 720px;
  }

  #GameCapture1 {
    left: 0px;
    top: 0px;
  }
  #GameCapture2 {
    left: 960px;
    top: 0px;
  }

  #CameraCapture1 {
    left: 711px;
    top: 720px;
    width: 498px;
    height: 280px;
  }

  #InfoStorageBox1 {
    left: 0px;
    top: 720px;
    width: 711px;
    height: 280px;
  }

  #InfoStorageBox2 {
    left: 1209px;
    top: 720px;
    width: 711px;
    height: 235px;
  }

  #GameInfo {
    width: 100%;
    flex-direction: column;
    flex: 1;
  }

  #GameNameBox {
    font-size: 35px;
  }
  #GameExtraInfoBox {
    font-size: 30px;
  }

  #DonationsBar {
    left: 1209px;
    top: 955px;
    width: 711px;
    height: 45px;
  }

  #DonationsBar >>> .DonationBox {
    padding: 0 7px;
  }

  #TimerBox {
    margin-top: -0.09em;
    font-size: 80px;
  }
</style>
