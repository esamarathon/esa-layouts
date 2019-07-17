<template>
  <div id="Layout">
    <!-- Game Captures -->
    <capture
      id="GameCapture1"
      class="GameCapture BorderRight"
    ></capture>
    <capture
      id="GameCapture2"
      class="GameCapture BorderRight"
    ></capture>
    <capture
      id="GameCapture3"
      class="GameCapture"
    ></capture>

    <!-- Camera Captures -->
    <capture
      id="CameraCapture1"
      class="CameraCapture BorderRight BorderLeft"
    ></capture>

    <!-- Players -->
    <info-storage-box
      id="InfoStorageBox1"
      class="PlayerStorageBox"
    >
      <player-container
        :team-id="0"
        single
      ></player-container>
    </info-storage-box>
    <info-storage-box
      id="InfoStorageBox2"
      class="PlayerStorageBox"
    >
      <player-container
        :team-id="1"
        single
      ></player-container>
    </info-storage-box>
    <info-storage-box
      id="InfoStorageBox3"
      class="PlayerStorageBox"
    >
      <player-container
        :team-id="2"
        single
      ></player-container>
    </info-storage-box>

    <info-storage-box id="InfoStorageBox4">
      <sponsor-logos></sponsor-logos>
    </info-storage-box>

    <info-storage-box id="InfoStorageBox5">
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
    width: 640px;
    height: 480px;
  }

  #GameCapture1 {
    left: 0px;
    top: 0px;
  }
  #GameCapture2 {
    left: 640px;
    top: 0px;
  }
  #GameCapture3 {
    left: 1280px;
    top: 0px;
  }

  #CameraCapture1 {
    left: 600px;
    top: 535px;
    width: 721px;
    height: 405px;
  }

  /* Players */
  .PlayerStorageBox {
    width: 640px;
    height: 55px;
    top: 480px;
  }
  #InfoStorageBox1 {
    left: 0px;
  }
  #InfoStorageBox2 {
    left: 640px;
  }
  #InfoStorageBox3 {
    left: 1280px;
  }

  #InfoStorageBox4 {
    left: 0px;
    top: 535px;
    width: 600px;
    height: 405px;
  }

  #InfoStorageBox5 {
    left: 1321px;
    top: 535px;
    width: 600px;
    height: 405px;
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
</style>
