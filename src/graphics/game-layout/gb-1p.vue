<template>
  <div>
    <!-- Game Captures -->
    <game-capture
      id="GameCapture1"
      class="BorderLeft"
      :style="{
        left: '875px',
        top: '0px',
        width: '1045px',
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
        width: '875px',
        height: '166px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture"
      :style="{
        left: '0px',
        top: !online && crowdCam ? '166px' : '0px',
        width: '875px',
        height: !online && crowdCam ? '384px' : '550px',
      }"
    />

    <!-- General Run Info -->
    <div
      class="Fixed FlexColumn BorderBottom"
      :style="{
        left: '0px',
        top: '550px',
        width: '875px',
        height: '260px',
      }"
    >
      <player />
      <commentators-reader />
      <commentators-reader show-reader />

      <!-- Run Game Info/Timer -->
      <div
        class="Flex"
        :style="{ flex: '1' }"
      >
        <run-info
          :style="{
            'width': '525px',
            height: '100%',
          }"
        />
        <timer
          class="BorderLeft"
          :style="{
            'width': '350px',
            height: '100%',
          }"
        />
      </div>
    </div>

    <!-- Media Box -->
    <media-box
      :font-size="36"
      :style="{
        left: '0px',
        top: '810px',
        width: '875px',
        height: '190px',
      }"
    />

    <!-- Donation Bar -->
    <donation-bar
      class="BorderLeft"
      :style="{
        left: '875px',
        top: '940px',
        width: '1045px',
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
