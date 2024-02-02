<template>
  <div>
    <!-- Game Captures -->
    <game-capture
      id="GameCapture1"
      class="BorderLeft BorderBottom"
      :style="{
        left: '858px',
        top: '0px',
        width: '1062px',
        height: '797px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture"
      :style="{
        left: '0px',
        top: '0px',
        width: '858px',
        height: '483px',
      }"
    />
    <game-capture
      id="CameraCapture2"
      class="BorderTop BorderLeft BorderBottom"
      :style="{
        left: '373px',
        top: '648px',
        width: '485px',
        height: '323px',
      }"
    />

    <!-- Run Game Info/Timer -->
    <div
      class="Fixed Flex"
      :style="{
        left: '858px',
        top: '797px',
        width: '1062px',
        height: '143px',
      }"
    >
      <run-info
        class="BorderLeft"
        :style="{
          'width': '692px',
          height: '100%',
        }"
      />
      <timer
        class="BorderLeft"
        :style="{
          'width': '370px',
          height: '100%',
        }"
      />
    </div>

    <!-- Player/Commetator -->
    <div
      class="Fixed"
      :style="{
        left: '0px',
        top: '483px',
        width: '858px',
      }"
    >
      <player />
      <commentators-reader />
      <commentators-reader show-reader />
    </div>

    <!-- Media Box -->
    <media-box
      vertical
      :font-size="30"
      :style="{
        left: '0px',
        top: '619px',
        width: '373px',
        height: '381px',
      }"
    />

    <!-- Donation Bar -->
    <donation-bar
      class="BorderLeft"
      :style="{
        left: '858px',
        top: '940px',
        width: '1062px',
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
