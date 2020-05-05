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
        height: '720px',
      }"
    />
    <div
      id="GameCapture2"
      class="Capture"
      :style="{
        left: '960px',
        top: '0px',
        width: '960px',
        height: '720px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture BorderTop BorderRight BorderLeft"
      :style="{
        left: '711px',
        top: '720px',
        width: '498px',
        height: '280px',
      }"
    />

    <!-- Player 1/Commentator -->
    <div
      class="Fixed"
      :style="{
        left: '0px',
        top: '720px',
        width: '711px',
      }"
    >
      <player />
      <commentator />
    </div>

    <!-- Player 2/General Run Info -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '1209px',
        top: '720px',
        width: '711px',
        height: '235px',
      }"
    >
      <player />

      <!-- Run Game Info/Timer -->
      <div
        class="FlexColumn"
        :style="{
          flex: '1',
          width: '100%',
        }"
      >
        <run-info :style="{ 'font-size': '35px' }" />
        <timer
          :style="{
            'font-size': '80px',
            'margin-top': '-0.09em',
          }"
        />
      </div>
    </div>

    <!-- Media Box -->
    <media-box
      :style="{
        left: '0px',
        top: '810px',
        width: '711px',
        height: '190px',
      }"
    />

    <!-- Donation Bar -->
    <donation-bar
      class="BorderLeft"
      :style="{
        left: '1209px',
        top: '955px',
        width: '711px',
        height: '45px',
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
