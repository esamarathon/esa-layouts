<template>
  <div id="Layout">
    <!-- Game Captures -->
    <capture
      id="GameCapture1"
      class="GameCapture BorderLeft BorderBottom"
    ></capture>
    <capture
      id="GameCapture2"
      class="GameCapture BorderTop BorderLeft"
    ></capture>

    <!-- Camera Captures -->
    <capture
      id="CameraCapture1"
      class="CameraCapture"
    ></capture>

    <!-- Information Storage (below camera) -->
    <info-storage-box id="InfoStorageBox1">
      <player-container></player-container>
      <commentators></commentators>
    </info-storage-box>

    <!-- Information Storage (sponspr logos) -->
    <info-storage-box
      id="InfoStorageBox2"
      class=""
    >
      <sponsor-logos></sponsor-logos>
    </info-storage-box>

    <!-- Information Storage (below main game feed) -->
    <info-storage-box id="InfoStorageBox3">
      <div
        id="GameInfo"
        class="FlexContainer BorderRight BorderLeft"
      >
        <game-name></game-name>
        <game-extra-info></game-extra-info>
      </div>
      <timer></timer>
    </info-storage-box>

    <!-- Donations Bar -->
    <donations-bar class="BorderLeft"></donations-bar>
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
  #GameCapture1 {
    left: 858px;
    top: 0px;
    width: 1062px;
    height: 797px;
  }
  #GameCapture2 {
    left: 373px;
    top: 636px;
    width: 485px;
    height: 364px;
  }

  #CameraCapture1 {
    left: 0px;
    top: 0px;
    width: 858px;
    height: 483px;
  }

  #DonationsBar {
    left: 858px;
    top: 940px;
    width: 1062px;
    height: 60px;
  }

  #InfoStorageBox1 {
    left: 0px;
    top: 483px;
    width: 858px;
    height: 153px;
  }

  #InfoStorageBox2 {
    left: 0px;
    top: 636px;
    width: 373px;
    height: 364px;
  }

  #InfoStorageBox3 {
    left: 858px;
    top: 797px;
    width: 1062px;
    height: 143px;
    flex-direction: row;
  }

  #GameInfo {
    flex-direction: column;
    box-sizing: border-box;
    height: 100%;
    flex: 1;
    padding-top: 10px;
    padding-bottom: 15px;
  }

  #TimerBox {
    width: 350px;
    margin-top: -0.07em;
  }
</style>
