<template>
  <div>
    <!-- Game Captures -->
    <game-capture
      id="GameCapture1"
      class="BorderRight"
      :slot-no="0"
      :style="{
        left: '0px',
        top: '0px',
        width: '640px',
        height: '480px',
      }"
    />
    <game-capture
      id="GameCapture2"
      class="BorderRight"
      :slot-no="1"
      :style="{
        left: '640px',
        top: '0px',
        width: '640px',
        height: '480px',
      }"
    />
    <game-capture
      id="GameCapture3"
      :slot-no="2"
      :style="{
        left: '1280px',
        top: '0px',
        width: '640px',
        height: '480px',
      }"
    />

    <!-- Camera Captures -->
    <!-- On-site has 2 camera spots. -->
    <!-- Online has 3 camera spots. -->
    <template v-if="!online">
      <div
        id="CameraCapture1"
        class="Capture BorderLeft"
        :style="{
          left: '600px',
          top: '530px',
          width: '481px',
          height: crowdCam ? '243px' : '410px',
        }"
      />
      <div
        id="CameraCapture2"
        class="Capture BorderRight BorderLeft"
        :style="{
          left: '1081px',
          top: '530px',
          width: '240px',
          height: crowdCam ? '243px' : '410px',
        }"
      />
    </template>
    <template v-else>
      <div
        id="CameraCapture1"
        class="Capture BorderRight BorderLeft"
        :style="{
          left: '600px',
          top: '530px',
          width: '240px',
          height: '410px',
        }"
      />
      <div
        id="CameraCapture2"
        class="Capture BorderRight"
        :style="{
          left: '840px',
          top: '530px',
          width: '240px',
          height: '410px',
        }"
      />
      <div
        id="CameraCapture3"
        class="Capture BorderRight"
        :style="{
          left: '1080px',
          top: '530px',
          width: '241px',
          height: '410px',
        }"
      />
    </template>

    <!-- Crowd Camera Capture -->
    <div
      v-if="!online && crowdCam"
      id="CameraCaptureCrowd"
      class="Capture BorderTop BorderRight BorderLeft"
      :style="{
        left: '600px',
        top: '773px',
        width: '721px',
        height: '167px',
      }"
    />

    <!-- Players -->
    <player
      class="Fixed"
      :slot-no="0"
      :style="{
        left: '0px',
        top: '480px',
        width: '640px',
        height: '50px',
      }"
    />
    <player
      class="Fixed"
      :slot-no="1"
      :style="{
        left: '640px',
        top: '480px',
        width: '640px',
        height: '50px',
      }"
    />
    <player
      class="Fixed"
      :slot-no="2"
      :style="{
        left: '1280px',
        top: '480px',
        width: '640px',
        height: '50px',
      }"
    />

    <!-- General Run Info -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '1321px',
        top: '530px',
        width: '600px',
        height: '410px',
      }"
    >
      <commentators-reader />
      <commentators-reader show-reader />

      <!-- Run Game Info/Timer -->
      <div
        class="FlexColumn"
        :style="{
          flex: '1',
          width: '100%',
          overflow: 'hidden',
        }"
      >
        <run-info
          :style="{ 'font-size': '45px' }"
          no-wrap
        />
        <timer />
      </div>
    </div>

    <!-- Media Box -->
    <media-box
      vertical
      :font-size="38"
      :style="{
        left: '0px',
        top: '535px',
        width: '600px',
        height: '405px',
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
