<template>
  <div>
    <!-- Game Captures -->
    <!-- Player 1 -->
    <game-capture
      id="GameCapture1"
      class="BorderRight"
      :slot-no="0"
      finish-time-pos="bottomright"
      :style="{
        left: '0px',
        top: '0px',
        width: '720px',
        height: '540px',
      }"
    />
    <!-- Player 2 -->
    <game-capture
      id="GameCapture2"
      class="BorderLeft"
      :slot-no="1"
      :style="{
        left: '1200px',
        top: '0px',
        width: '720px',
        height: '540px',
      }"
    />

    <!-- Extra Middle Space -->
    <div
      class="Capture"
      :style="{
        left: '720px',
        top: '0px',
        width: '480px',
        height: '540px',
      }"
    />

    <!-- Camera Captures -->
    <!-- Online has 2 camera spots -->
    <div
      v-if="!online"
      id="CameraCapture1"
      class="Capture BorderTop BorderRight BorderLeft"
      :style="{
        left: '660px',
        top: '540px',
        width: '600px',
        height: '400px',
      }"
    />
    <template v-else>
      <div
        id="CameraCapture1"
        class="Capture BorderTop BorderRight BorderLeft"
        :style="{
          left: '660px',
          top: '540px',
          width: '300px',
          height: '400px',
        }"
      />
      <div
        id="CameraCapture2"
        class="Capture BorderTop BorderRight"
        :style="{
          left: '960px',
          top: '540px',
          width: '300px',
          height: '400px',
        }"
      />
    </template>

    <!-- Player 1/Commentator -->
    <div
      class="Fixed"
      :style="{
        left: '0px',
        top: '540px',
        width: '660px',
      }"
    >
      <player :slot-no="0" />
      <comm-and-reader />
    </div>

    <!-- Player 2/General Run Info -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '1260px',
        top: '540px',
        width: '660px',
        height: '400px',
      }"
    >
      <player :slot-no="1" />

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
        <timer font-size="120px" />
      </div>
    </div>

    <!-- Media Box -->
    <media-box
      :font-size="45"
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
import MediaBox from '@shared/graphics/mediabox';
import { Component, Vue } from 'vue-property-decorator';
import CommAndReader from './components/CommAndReader.vue';
import DonationBar from './components/DonationBar.vue';
import GameCapture from './components/GameCapture.vue';
import Player from './components/Player.vue';
import RunInfo from './components/RunInfo.vue';
import Timer from './components/Timer.vue';

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
export default class extends Vue {
  online = nodecg.bundleConfig.event.online;
}
</script>
