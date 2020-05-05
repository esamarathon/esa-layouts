<template>
  <div>
    <!-- Game Captures -->
    <div
      id="GameCapture1"
      class="Capture BorderRight"
      :style="{
        left: '0px',
        top: '0px',
        width: '640px',
        height: '480px',
      }"
    />
    <div
      id="GameCapture2"
      class="Capture BorderRight"
      :style="{
        left: '640px',
        top: '0px',
        width: '640px',
        height: '480px',
      }"
    />
    <div
      id="GameCapture3"
      class="Capture"
      :style="{
        left: '1280px',
        top: '0px',
        width: '640px',
        height: '480px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture BorderRight BorderLeft"
      :style="{
        left: '600px',
        top: '530px',
        width: '721px',
        height: '410px',
      }"
    />

    <player
      class="Fixed"
      :style="{
        left: '0px',
        top: '480px',
        width: '640px',
        height: '50px',
      }"
    />
    <player
      class="Fixed"
      :style="{
        left: '640px',
        top: '480px',
        width: '640px',
        height: '50px',
      }"
    />
    <player
      class="Fixed"
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
      <commentator />

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
