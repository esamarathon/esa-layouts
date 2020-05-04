<template>
  <div>
    <!-- Game Captures -->
    <div
      id="GameCapture1"
      class="Capture BorderLeft BorderBottom"
      :style="{
        left: '533px',
        top: '0px',
        width: '1387px',
        height: '780px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture"
      :style="{
        left: '0px',
        top: '0px',
        width: '533px',
        height: '650px',
      }"
    />

    <!-- Run Game Info/Timer -->
    <div
      class="Fixed Flex NoWrap"
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
          flex: '3',
          height: '100%',
        }"
      />
      <timer
        class="BorderLeft"
        :style="{
          'min-width': '387px',
          flex: '1',
          height: '100%',
        }"
      />
    </div>

    <!-- Player/Commetator -->
    <div
      class="Fixed"
      :style="{
        left: '0px',
        top: '650px',
        width: '533px',
        height: '90px',
      }"
    >
      <player />
      <commentator />
    </div>

    <!-- Media Box -->
    <media-box
      :style="{
        left: '0px',
        top: '740px',
        width: '533px',
        height: '200px',
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
