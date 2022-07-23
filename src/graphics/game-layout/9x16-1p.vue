<template>
  <div>
    <!-- Game Captures -->
    <game-capture
      id="GameCapture1"
      class="BorderLeft BorderRight"
      :style="{
        left: '1116px',
        top: '0px',
        width: '563px',
        height: '1000px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture BorderLeft"
      :style="{
        left: '241px',
        top: '0px',
        width: '875px',
        height: '490px',
      }"
    />

    <!-- General Run Info -->
    <div
      class="Fixed FlexColumn BorderBottom BorderLeft"
      :style="{
        left: '241px',
        top: '490px',
        width: '875px',
        height: '260px',
      }"
    >
      <player />
      <commentators-reader />
      <commentators-reader show-reader />

      <!-- Run Game Info/Timer -->
      <div
        class="Flex"
        :style="{ flex: '1', 'align-items': 'flex-end' }"
      >
        <run-info
          :style="{
            'width': '525px',
            height: '100%',
          }"
        />
        <timer
          class="BorderLeft"
          :style="{
            'width': '350px',
            height: '100%',
          }"
        />
      </div>
    </div>

    <!-- Media Box -->
    <media-box
      :font-size="36"
      class="BorderLeft"
      :style="{
        left: '241px',
        top: '750px',
        width: '875px',
        height: '190px',
      }"
    />

    <!-- Donation Bar -->
    <donation-bar
      class="BorderLeft"
      :style="{
        left: '0px',
        top: '940px',
        width: '1116px',
        height: '60px',
      }"
    />
  </div>
</template>

<script lang="ts">
import MediaBox from '@shared/graphics/mediabox';
import { Component, Vue } from 'vue-property-decorator';
import CommentatorsReader from './components/CommentatorsReader.vue';
import DonationBar from './components/DonationBar.vue';
import GameCapture from './components/GameCapture.vue';
import Player from './components/Player.vue';
import RunInfo from './components/RunInfo.vue';
import Timer from './components/Timer.vue';

@Component({
  components: {
    GameCapture,
    Player,
    CommentatorsReader,
    RunInfo,
    Timer,
    MediaBox,
    DonationBar,
  },
})
export default class extends Vue {}
</script>
