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
        height: '380px',
      }"
    />

    <!-- General Run Info -->
    <div
      class="Fixed FlexColumn BorderBottom"
      :style="{
        left: '0px',
        top: '380px',
        width: '668px',
        height: '310px',
      }"
    >
      <player />
      <commentator />

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
      :style="{
        left: '0px',
        top: '690px',
        width: '668px',
        height: '310px',
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
import GameCapture from './components/GameCapture.vue';
import Player from './components/Player.vue';
import Commentator from './components/Commentator.vue';
import RunInfo from './components/RunInfo.vue';
import Timer from './components/Timer.vue';
import MediaBox from '../_misc/components/MediaBox.vue';
import DonationBar from './components/DonationBar.vue';

@Component({
  components: {
    GameCapture,
    Player,
    Commentator,
    RunInfo,
    Timer,
    MediaBox,
    DonationBar,
  },
})
export default class extends Vue {}
</script>
