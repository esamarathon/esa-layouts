<template>
  <div id="Intermission">
    <logo></logo>
    <capture
      id="IntermissionCamera"
      class="FlexContainer CameraCapture BorderTop BorderRight BorderBottom BorderLeft"
    >
      <ad-timer></ad-timer>
    </capture>
    <info-storage-box
      id="SponsorLogo"
    >
      <sponsor-logos></sponsor-logos>
    </info-storage-box>
    <run-upcoming
      v-if="nextRun"
      id="ComingUpNext"
      :data="nextRun"
      :sc="sc"
    ></run-upcoming>
    <rotation></rotation>
    <info-storage-box
      id="ReaderAndMusic"
    >
      <reader></reader>
      <music></music>
    </info-storage-box>
  </div>
</template>

<script>
import clone from 'clone';
import SpeedcontrolUtil from 'speedcontrol-util';
import CutBackground from '../_misc/cut_bg';
import Capture from '../_misc/components/Capture.vue';
import SponsorLogos from '../_misc/components/SponsorLogos.vue';
import InfoStorageBox from '../_misc/components/InfoStorageBox.vue';
import Logo from './components/Logo.vue';
import Music from './components/Music.vue';
import Reader from './components/Reader.vue';
import RunUpcoming from './components/RunUpcoming.vue';
import Rotation from './components/Rotation.vue';
import AdTimer from './components/AdTimer.vue';

export default {
  name: 'Intermission',
  components: {
    SponsorLogos,
    InfoStorageBox,
    Capture,
    Logo,
    Music,
    Reader,
    RunUpcoming,
    Rotation,
    AdTimer,
  },
  data() {
    return {
      nextRun: undefined,
      sc: new SpeedcontrolUtil(nodecg),
    };
  },
  created() {
    NodeCG.waitForReplicants(this.sc.runDataActiveRun).then(() => this.refreshUpcomingRun());
    nodecg.listenFor('forceRefreshIntermission', this.refreshUpcomingRun);
  },
  mounted() {
    CutBackground();
  },
  methods: {
    refreshUpcomingRun() {
      const nextRun = clone(this.sc.getNextRuns(1));
      if (nextRun.length) {
        [this.nextRun] = nextRun;
      }
    },
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

  #IntermissionCamera {
    justify-content: flex-end;
    align-items: flex-end;
    left: 30px;
    top: 370px;
    width: 655px;
    height: 368px;
  }

  #ComingUpNext {
    position: fixed;
    left: 718px;
    top: 31px;
    width: 1172px;
    height: 199px;
  }

  #Rotation {
    left: 718px;
    top: 240px;
    width: 1172px;
    height: 660px;
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
