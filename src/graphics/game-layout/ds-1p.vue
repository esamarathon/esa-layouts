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
    <game-capture
      id="GameCapture2"
      class="BorderTop BorderLeft"
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
      <comm-and-reader />
    </div>

    <!-- Media Box -->
    <media-box
      vertical
      :font-size="30"
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
