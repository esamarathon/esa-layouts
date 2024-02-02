<template>
  <div>
    <!-- Game Captures -->
    <game-capture
      id="GameCapture1"
      class="BorderBottom"
      :style="{
        left: '0px',
        top: '0px',
        width: '553px',
        height: '280px',
      }"
    />
    <game-capture
      id="GameCapture2"
      class="BorderLeft"
      :style="{
        left: '553px',
        top: '0px',
        width: '814px',
        height: '542px',
      }"
    />
    <game-capture
      id="GameCapture3"
      class="BorderLeft"
      :style="{
        left: '1367px',
        top: '0px',
        width: '553px',
        height: '542px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture"
      :style="{
        left: '0px',
        top: '280px',
        width: '553px',
        height: '660px',
      }"
    />

    <!-- General Run Info -->
    <div
      class="Fixed FlexColumn BorderLeft"
      :style="{
        left: '553px',
        top: '542px',
        width: '814px',
        height: '398px',
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
      :font-size="36"
      class="BorderTop BorderLeft"
      :style="{
        left: '1367px',
        top: '542px',
        width: '553px',
        height: '398px',
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
export default class extends Vue {}
</script>
