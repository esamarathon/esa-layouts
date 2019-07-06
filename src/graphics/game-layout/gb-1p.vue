<template>
  <div id="Layout">
    <!-- Game Captures -->
    <capture
      id="GameCapture1"
      class="GameCapture BorderLeft"
    ></capture>

    <!-- Camera Captures -->
    <capture
      id="CameraCapture1"
      class="CameraCapture"
    ></capture>

    <!-- Information Storage -->
    <info-storage-box>
      <player-container></player-container>
      <commentators></commentators>
      <div
        id="InfoBox"
        class="FlexContainer"
      >
        <div
          id="GameInfo"
          class="BorderRight"
        >
          <game-name></game-name>
          <game-extra-info></game-extra-info>
        </div>
        <timer></timer>
      </div>
      <sponsor-logos class="BorderTop"></sponsor-logos>
    </info-storage-box>

    <!-- Donations Bar -->
    <donations-bar class="BorderLeft"></donations-bar>
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
  @import url('../_misc/components/FlexContainer.css');

  #GameCapture1 {
    left: 875px;
    top: 0px;
    width: 1045px;
    height: 940px;
  }

  #CameraCapture1 {
    left: 0px;
    top: 0px;
    width: 875px;
    height: 492px;
  }

  #DonationsBar {
    left: 875px;
    top: 940px;
    width: 1045px;
    height: 60px;
  }

  .InfoStorageBox {
    left: 0px;
    top: 492px;
    width: 875px;
    height: 508px;
  }

  #InfoBox {
    width: 100%;
  }

  #GameInfo {
    width: 100%;
    flex: 1;
    padding-top: 10px;
    padding-bottom: 15px;
  }

  #TimerBox {
    width: 350px;
    margin-top: -0.07em;
  }
</style>
