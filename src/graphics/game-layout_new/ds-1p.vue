<template>
  <div>
    <!-- Game Captures -->
    <div
      id="GameCapture1"
      class="Capture BorderLeft BorderBottom"
      :style="{
        left: '858px',
        top: '0px',
        width: '1062px',
        height: '797px',
      }"
    />
    <div
      id="GameCapture2"
      class="Capture BorderTop BorderLeft"
      :style="{
        left: '373px',
        top: '636px',
        width: '485px',
        height: '364px',
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

    <!-- Run Game Info/Timer -->
    <div
      class="Fixed Flex NoWrap"
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
      <commentator />
    </div>

    <!-- Media Box -->
    <media-box
      :style="{
        left: '0px',
        top: '636px',
        width: '373px',
        height: '364px',
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
