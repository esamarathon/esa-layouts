<template>
  <div>
    <!-- Game Captures -->
    <game-capture
      id="GameCapture1"
      class="BorderLeft BorderBottom"
      :style="{
        left: '533px',
        top: '0px',
        width: '1387px',
        height: '780px',
      }"
    />

    <!-- Crowd Camera Capture -->
    <div
      id="CameraCaptureCrowd"
      class="Capture"
      :style="{
        left: '0px',
        top: '0px',
        width: '533px',
        height: '325px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture BorderTop"
      :style="{
        left: '0px',
        top: '325px',
        width: '533px',
        height: '325px',
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

    <!-- Player/Commetator/Media Box -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '0px',
        top: '650px',
        width: '533px',
        height: '290px',
      }"
    >
      <!-- Player/Commetator -->
      <player />
      <commentators-reader />
      <commentators-reader show-reader />

      <!-- Media Box -->
      <media-box
        :font-size="25"
        :style="{
          'flex-grow': 1,
          position: 'unset',
          width: '100%',
        }"
      />
    </div>

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
import { Vue, Component } from 'vue-property-decorator';
import MediaBox from '@shared/graphics/mediabox';
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
export default class extends Vue {}
</script>
