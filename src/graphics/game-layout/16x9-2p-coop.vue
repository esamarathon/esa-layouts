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
        :coop="0"
      ></player-container>
      <sponsor-logos></sponsor-logos>
    </info-storage-box>

    <!-- Information Storage (right) -->
    <info-storage-box
      id="InfoStorageBox2"
      class=""
    >
      <player-container
        :team-id="0"
        :coop="1"
      ></player-container>
      <commentators></commentators>
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
import Capture from '../_misc/components/Capture.vue';
import Commentators from './components/Commentators.vue';
import DonationsBar from './components/DonationsBar.vue';
import GameExtraInfo from './components/GameExtraInfo.vue';
import GameName from './components/GameName.vue';
import InfoStorageBox from '../_misc/components/InfoStorageBox.vue';
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
    height: 540px;
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
    left: 660px;
    top: 540px;
    width: 600px;
    height: 400px;
  }

  #InfoStorageBox1 {
    left: 0px;
    top: 540px;
    width: 660px;
    height: 400px;
  }

  #InfoStorageBox2 {
    left: 1260px;
    top: 540px;
    width: 660px;
    height: 400px;
  }

  #GameInfo {
    width: 100%;
    flex-direction: column;
    flex: 1;
  }

  #DonationsBar {
    left: 0px;
    top: 940px;
    width: 1920px;
    height: 60px;
  }

  #TimerBox {
    margin-top: -0.09em;
  }
</style>
