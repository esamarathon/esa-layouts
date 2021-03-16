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
      <comm-and-reader />

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
      :font-size="40"
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
import MediaBox from '@esamarathon/esa-layouts-shared/mediabox/graphics';
import GameCapture from './components/GameCapture.vue';
import Player from './components/Player.vue';
import CommAndReader from './components/CommAndReader.vue';
import RunInfo from './components/RunInfo.vue';
import Timer from './components/Timer.vue';
import DonationBar from './components/DonationBar.vue';

@Component({
  components: {
    GameCapture,
    Player,
    CommAndReader,
    RunInfo,
    Timer,
    MediaBox,
    DonationBar,
  },
})
export default class extends Vue {}
</script>
