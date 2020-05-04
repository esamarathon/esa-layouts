<template>
  <div>
    <!-- Game Captures -->
    <div
      id="GameCapture1"
      class="Capture BorderLeft BorderBottom"
      :style="{
        left: '774px',
        top: '0px',
        width: '1146px',
        height: '689px',
      }"
    />
    <div
      id="GameCapture2"
      class="Capture BorderLeft"
      :style="{
        left: '1506px',
        top: '689px',
        width: '414px',
        height: '311px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture"
      :style="{
        left: '0px',
        top: '0px',
        width: '774px',
        height: '437px',
      }"
    />

    <!-- Run Game Info/Timer -->
    <div
      class="Fixed FlexColumn BorderLeft NoWrap"
      :style="{
        left: '774px',
        top: '689px',
        width: '732px',
        height: '251px',
      }"
    >
      <run-info />
      <timer />
    </div>

    <!-- Player/Commetator -->
    <div
      class="Fixed"
      :style="{
        left: '0px',
        top: '437px',
        width: '774px',
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
        top: '527px',
        width: '774px',
        height: '413px',
      }"
    />

    <!-- Donation Bar -->
    <donation-bar
      :style="{
        left: '0px',
        top: '940px',
        width: '1506px',
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
