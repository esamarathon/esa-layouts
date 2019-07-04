<template>
  <div id="Layout">
    <!-- Game Captures -->
    <capture
      id="GameCapture1"
      class="GameCapture BorderRight BorderBottom"
    ></capture>
    <capture
      id="GameCapture2"
      class="GameCapture BorderLeft BorderBottom"
    ></capture>
    <capture
      id="GameCapture3"
      class="GameCapture BorderRight"
    ></capture>
    <capture
      id="GameCapture4"
      class="GameCapture BorderLeft"
    ></capture>

    <!-- Camera Captures -->
    <capture
      id="CameraCapture1"
      class="CameraCapture BorderTop BorderBottom"
    ></capture>

    <info-storage-box id="InfoStorageBox1">
      <commentators></commentators>
      <div
        id="GameInfo"
        class="FlexContainer"
      >
        <game-name></game-name>
        <game-extra-info></game-extra-info>
        <timer></timer>
      </div>
      <player-container
        id="PlayerContainer1"
        :team-id="0"
        single
      ></player-container>
      <player-container
        id="PlayerContainer2"
        :team-id="1"
        single
      ></player-container>
    </info-storage-box>

    <info-storage-box id="InfoStorageBox2">
      <player-container
        id="PlayerContainer3"
        :team-id="2"
        single
      ></player-container>
      <player-container
        id="PlayerContainer4"
        :team-id="3"
        single
      ></player-container>
      <sponsor-logos></sponsor-logos>
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
  .GameCapture {
    width: 626px;
    height: 470px;
  }

  #GameCapture1 {
    left: 0px;
    top: 0px;
  }
  #GameCapture2 {
    left: 1294px;
    top: 0px;
  }
  #GameCapture3 {
    left: 0px;
    top: 470px;
  }
  #GameCapture4 {
    left: 1294px;
    top: 470px;
  }

  #CameraCapture1 {
    left: 626px;
    top: 308px;
    width: 668px;
    height: 325px;
  }

  #InfoStorageBox1 {
    left: 626px;
    top: 0px;
    width: 668px;
    height: 308px;
  }

  .PlayerContainer {
    width: 580px;
  }
  .PlayerContainer >>> .PlayerInfoBox {
    height: 40px;
    font-size: 25px;
  }

  #PlayerContainer1, #PlayerContainer3 {
    margin-right: 88px;
  }
  #PlayerContainer2, #PlayerContainer4 {
    margin-top: 3px;
    margin-left: 88px;
  }

  #InfoStorageBox2 {
    left: 626px;
    top: 633px;
    width: 668px;
    height: 307px;
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

  #TimerBox {
    margin-top: -0.15em;
    font-size: 75px;
  }

  #DonationsBar {
    left: 0px;
    top: 940px;
    width: 1920px;
    height: 60px;
  }
</style>
