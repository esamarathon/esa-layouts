<template>
  <div id="Intermission">
    <logo></logo>
    <capture
      id="CameraCapture1"
      class="CameraCapture"
    ></capture>

    <info-storage-box
      id="SponsorLogo"
    >
      <sponsor-logos></sponsor-logos>
    </info-storage-box>

    <info-storage-box
      id="ReaderAndMusic"
    >
      <reader></reader>
      <music></music>
    </info-storage-box>
  </div>
</template>

<script>
import CutBackground from '../_misc/cut_bg';
import Capture from '../_misc/components/Capture.vue';
import SponsorLogos from '../_misc/components/SponsorLogos.vue';
import InfoStorageBox from '../_misc/components/InfoStorageBox.vue';
import Logo from './components/Logo.vue';
import Music from './components/Music.vue';
import Reader from './components/Reader.vue';

export default {
  name: 'Intermission',
  components: {
    SponsorLogos,
    InfoStorageBox,
    Capture,
    Logo,
    Music,
    Reader,
  },
  mounted() {
    CutBackground();
  },
};
</script>

<style>
  .Logo {
    left: 53px;
    top: 43px;
    width: 609px;
    height: 276px;
  }

  #SponsorLogo {
    left: 26px;
    top: 741px;
    width: 662px;
    height: 259px;
  }

  #CameraCapture1 {
    left: 30px;
    top: 370px;
    width: 655px;
    height: 368px;
  }

  #ReaderAndMusic {
    justify-content: flex-start;
    flex-direction: row;
    background-color: rgba(0,0,0,0.3);
    left: 718px;
    top: 910px;
    width: 1172px;
    height: 60px;
    font-size: 30px;
  }
</style>
