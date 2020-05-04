<template>
  <div>
    <!-- Game Captures -->
    <div
      id="GameCapture1"
      class="Capture BorderRight"
      :style="{
        left: '0px',
        top: '0px',
        width: '960px',
        height: '540px',
      }"
    />
    <div
      id="GameCapture2"
      class="Capture"
      :style="{
        left: '960px',
        top: '0px',
        width: '960px',
        height: '540px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture BorderTop BorderRight BorderLeft"
      :style="{
        left: '660px',
        top: '540px',
        width: '600px',
        height: '400px',
      }"
    />

    <!-- Player 1/Commentator -->
    <div
      class="Fixed"
      :style="{
        left: '0px',
        top: '540px',
        width: '660px',
        height: '90px',
      }"
    >
      <player />
      <commentator />
    </div>

    <!-- Player 2/General Run Info -->
    <div
      class="Fixed FlexColumn NoWrap"
      :style="{
        left: '1260px',
        top: '540px',
        width: '660px',
        height: '400px',
      }"
    >
      <player />

      <!-- Run Game Info/Timer -->
      <div
        class="FlexColumn"
        :style="{ flex: '1' }"
      >
        <run-info :style="{ 'font-size': '45px' }" />
        <timer :style="{ 'font-size': '120px' }" />
      </div>
    </div>

    <!-- Media Box -->
    <media-box
      :style="{
        left: '0px',
        top: '630px',
        width: '660px',
        height: '310px',
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
import { Vue, Component } from 'vue-property-decorator';
import Player from './components/Player.vue';
import Commentator from './components/Commentator.vue';
import RunInfo from './components/RunInfo.vue';
import Timer from './components/Timer.vue';
import MediaBox from '../_misc/components/MediaBox.vue';
import DonationBar from './components/DonationBar.vue';

@Component({
  components: {
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
