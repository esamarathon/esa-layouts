<template>
  <div id="Intermission">
    <div id="Background"></div>
    <logo></logo>
    <capture
      id="IntermissionCamera"
      class="Flex CameraCapture BorderTop BorderRight BorderBottom BorderLeft"
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
import { generateClipPath } from '../_misc/cut-background';
import Capture from '../_misc/components/Capture.vue';
import SponsorLogos from '../_misc/components/SponsorLogos.vue';
import InfoStorageBox from '../_misc/components/InfoStorageBox.vue';
import Logo from './components/Logo.vue';
import Music from './components/Music.vue';
import Reader from './components/Reader.vue';
import RunUpcoming from './components/RunUpcoming.vue';
import Rotation from './components/Rotation.vue';
import AdTimer from './components/AdTimer.vue';

const runDataActiveRun = nodecg.Replicant('runDataActiveRun', 'nodecg-speedcontrol');
const runDataArray = nodecg.Replicant('runDataArray', 'nodecg-speedcontrol');

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
    };
  },
  created() {
    NodeCG.waitForReplicants(runDataActiveRun, runDataArray).then(() => this.refreshUpcomingRun());
    nodecg.listenFor('forceRefreshIntermission', this.refreshUpcomingRun);
  },
  mounted() {
    const clipPath = generateClipPath();
  },
  methods: {
    refreshUpcomingRun() {
      const nextRun = this.getNextRun();
      if (nextRun.length) {
        [this.nextRun] = nextRun;
      }
    },
    getNextRun() {
      const runIndex = this.findRunIndex();
      return clone(runDataArray.value).slice(runIndex + 1).slice(0, 1);
    },
    findRunIndex() {
      if (!runDataActiveRun.value) {
        return -1;
      }
      return clone(runDataArray.value).findIndex(run => run.id === runDataActiveRun.value.id);
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
