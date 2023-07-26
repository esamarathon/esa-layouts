<template>
  <div>
    <!-- Game Captures -->
    <game-capture
      id="GameCapture1"
      class="BorderLeft BorderRight"
      :style="{
        left: '679px',
        top: '0px',
        width: '562px',
        height: '1000px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture"
      :style="{
        left: '0px',
        top: '0px',
        width: '679px',
        height: '382px',
      }"
    />
    <div
      id="CameraCapture2"
      class="Capture"
      :style="{
        left: '1241px',
        top: '0px',
        width: '679px',
        height: '382px',
      }"
    />

    <!-- General Run Info -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '0px',
        top: '382px',
        width: '679px',
        height: '573px',
      }"
    >
      <player />
      <commentators-reader />
      <commentators-reader show-reader />

      <!-- Run Game Info/Timer -->
      <div
        class="FlexColumn"
        :style="{ flex: '1', width: '100%' }"
      >
        <run-info :style="{ 'font-size': '45px' }" />
        <timer fontSize="125px" />
      </div>
    </div>

    <!-- Media Box -->
    <media-box
      :font-size="36"
      class="BorderTop"
      :style="{
        left: '1241px',
        top: '382px',
        width: '679px',
        height: '618px',
      }"
    />

    <!-- Donation Bar -->
    <donation-bar
      :padding="7"
      :style="{
        left: '0px',
        top: '955px',
        width: '679px',
        height: '45px',
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
