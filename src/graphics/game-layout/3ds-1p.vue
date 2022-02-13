<template>
  <div>
    <!-- Game Captures -->
    <game-capture
      id="GameCapture1"
      class="BorderLeft BorderBottom"
      :style="{
        left: '774px',
        top: '0px',
        width: '1146px',
        height: '689px',
      }"
    />
    <game-capture
      id="GameCapture2"
      class="BorderLeft"
      :style="{
        left: '1506px',
        top: '689px',
        width: '414px',
        height: '311px',
      }"
    />

    <!-- Crowd Camera Capture -->
    <div
      v-if="!online && crowdCam"
      id="CameraCaptureCrowd"
      class="Capture BorderBottom"
      :style="{
        left: '0px',
        top: '0px',
        width: '774px',
        height: '146px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture"
      :style="{
        left: '0px',
        top: !online && crowdCam ? '146px' : '0px',
        width: '774px',
        height: !online && crowdCam ? '381px' : '527px',
      }"
    />

    <!-- Run Game Info/Timer -->
    <div
      class="Fixed FlexColumn BorderLeft"
      :style="{
        left: '774px',
        top: '689px',
        width: '732px',
        height: '251px',
      }"
    >
      <run-info />
      <timer />
    </div>

    <!-- Player/Commetator -->
    <div
      class="Fixed"
      :style="{
        left: '0px',
        top: '527px',
        width: '774px',
      }"
    >
      <player />
      <commentators-reader />
      <commentators-reader show-reader />
    </div>

    <!-- Media Box -->
    <media-box
      :font-size="40"
      :style="{
        left: '0px',
        top: '661px',
        width: '774px',
        height: '279px',
      }"
    />

    <!-- Donation Bar -->
    <donation-bar
      :style="{
        left: '0px',
        top: '940px',
        width: '1506px',
        height: '60px',
      }"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import MediaBox from '@shared/graphics/mediabox';
import { Configschema } from '@esa-layouts/types/schemas';
import GameCapture from './components/GameCapture.vue';
import Player from './components/Player.vue';
import CommentatorsReader from './components/CommentatorsReader.vue';
import RunInfo from './components/RunInfo.vue';
import Timer from './components/Timer.vue';
import DonationBar from './components/DonationBar.vue';

@Component({
  components: {
    GameCapture,
    Player,
    CommentatorsReader,
    RunInfo,
    Timer,
    MediaBox,
    DonationBar,
  },
})
export default class extends Vue {
  @State((s) => s.gameLayouts.crowdCamera) readonly crowdCam!: boolean;
  online = (nodecg.bundleConfig as Configschema).event.online;
}
</script>
