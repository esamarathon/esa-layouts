<template>
  <div>
    <!-- Game Captures -->
    <game-capture
      id="GameCapture1"
      class="BorderLeft"
      :style="{
        left: '668px',
        top: '0px',
        width: '1252px',
        height: '940px',
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
        width: '668px',
        height: '114px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture"
      :style="{
        left: '0px',
        top: !online && crowdCam ? '114px' : '0px',
        width: '668px',
        height: !online && crowdCam ? '262px' : '376px',
      }"
    />

    <!-- General Run Info -->
    <div
      class="Fixed FlexColumn BorderBottom"
      :style="{
        left: '0px',
        top: '376px',
        width: '668px',
        height: '394px',
      }"
    >
      <player />
      <commentators-reader />
      <commentators-reader show-reader />

      <!-- Run Game Info/Timer -->
      <div
        class="FlexColumn"
        :style="{
          flex: '1',
          width: '100%',
        }"
      >
        <run-info />
        <timer />
      </div>
    </div>

    <!-- Media Box -->
    <media-box
      :font-size="40"
      :style="{
        left: '0px',
        top: '770px',
        width: '668px',
        height: '230px',
      }"
    />

    <!-- Donation Bar -->
    <donation-bar
      class="BorderLeft"
      :style="{
        left: '668px',
        top: '940px',
        width: '1252px',
        height: '60px',
      }"
    />
  </div>
</template>

<script lang="ts">
import MediaBox from '@shared/graphics/mediabox';
import { Component, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';
import CommentatorsReader from './components/CommentatorsReader.vue';
import DonationBar from './components/DonationBar.vue';
import GameCapture from './components/GameCapture.vue';
import Player from './components/Player.vue';
import RunInfo from './components/RunInfo.vue';
import Timer from './components/Timer.vue';

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
  online = nodecg.bundleConfig.event.online;
}
</script>
