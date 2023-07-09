<template>
  <div>
    <!-- Crowd Camera Capture -->
    <div
      v-if="!online && crowdCam"
      id="CameraCaptureCrowd"
      class="Capture BorderBottom"
      :style="{
        left: '0px',
        top: '0px',
        width: '533px',
        height: '150px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture"
      :style="{
        left: '0px',
        top: !online && crowdCam ? '150px' : '0px',
        width: '533px',
        height: !online && crowdCam ? '400px' : '550px',
      }"
    />
    <div
      id="CameraCapture2"
      class="Capture BorderLeft BorderBottom"
      :style="{
        left: '533px',
        top: '0px',
        width: '1387px',
        height: '780px',
      }"
    />

    <!-- Run Game Info/Timer -->
    <div
      class="Fixed Flex"
      :style="{
        left: '533px',
        top: '780px',
        width: '1387px',
        height: '160px',
      }"
    >
      <run-info
        class="BorderLeft"
        :style="{
          'font-size': '45px',
          'width': '1000px',
          height: '100%',
        }"
      />
      <timer
        class="BorderLeft"
        :style="{
          'width': '387px',
          height: '100%',
        }"
      />
    </div>

    <!-- Player/Commentator -->
    <div
      class="Fixed"
      :style="{
        left: '0px',
        top: '550px',
        width: '533px',
      }"
    >
      <player />
      <commentators-reader />
      <commentators-reader show-reader />
    </div>

    <!-- Media Box -->
    <media-box
      vertical
      :font-size="36"
      :style="{
        left: '0px',
        top: '684px',
        width: '533px',
        height: '256px',
      }"
    />

    <!-- Donation Bar -->
    <donation-bar
      :style="{
        left: '0px',
        top: '940px',
        width: '1920px',
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
import Player from './components/Player.vue';
import RunInfo from './components/RunInfo.vue';
import Timer from './components/Timer.vue';

@Component({
  components: {
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
