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

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture"
      :style="{
        left: '0px',
        top: '0px',
        width: '668px',
        height: '313px',
      }"
    />
    <!-- Crowd Camera -->
    <div
      id="CameraCaptureCrowd"
      class="Capture BorderTop"
      :style="{
        left: '0px',
        top: '313px',
        width: '668px',
        height: '114px',
      }"
    />

    <!-- General Run Info -->
    <div
      class="Fixed FlexColumn BorderBottom"
      :style="{
        left: '0px',
        top: '427px',
        width: '668px',
        height: '343px',
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
      :font-size="45"
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
