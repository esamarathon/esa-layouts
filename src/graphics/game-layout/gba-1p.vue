<template>
  <div>
    <!-- Game Captures -->
    <game-capture
      id="GameCapture1"
      class="BorderLeft"
      :style="{
        left: '512px',
        top: '0px',
        width: '1408px',
        height: '940px',
      }"
    />

    <!-- Crowd Camera Capture -->
    <div
      v-if="!online && crowdCam"
      id="CameraCaptureCrowd"
      class="Capture BorderBottom"
      :style="{
        left: '0px',
        top: '0px',
        width: '512px',
        height: '142px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture"
      :style="{
        left: '0px',
        top: !online && crowdCam ? '142px' : '0px',
        width: '512px',
        height: !online && crowdCam ? '323px' : '465px',
      }"
    />

    <!-- General Run Info -->
    <div
      class="Fixed FlexColumn BorderBottom"
      :style="{
        left: '0px',
        top: '465px',
        width: '512px',
        height: '351px',
      }"
    >
      <player />
      <commentators-reader />
      <commentators-reader show-reader />

      <!-- Run Game Info/Timer -->
      <div
        class="FlexColumn"
        :style="{
          flex: '1',
          width: '100%',
        }"
      >
        <run-info />
        <timer />
      </div>
    </div>

    <!-- Media Box -->
    <media-box
      vertical
      :font-size="28"
      :style="{
        left: '0px',
        top: '816px',
        width: '512px',
        height: '184px',
      }"
    />

    <!-- Donation Bar -->
    <donation-bar
      class="BorderLeft"
      :style="{
        left: '512px',
        top: '940px',
        width: '1408px',
        height: '60px',
      }"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import MediaBox from '@shared/graphics/mediabox';
import { Configschema } from '@esa-layouts/types/schemas';
import GameCapture from './components/GameCapture.vue';
import Player from './components/Player.vue';
import CommentatorsReader from './components/CommentatorsReader.vue';
import RunInfo from './components/RunInfo.vue';
import Timer from './components/Timer.vue';
import DonationBar from './components/DonationBar.vue';

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
export default class extends Vue {
  @State((s) => s.gameLayouts.crowdCamera) readonly crowdCam!: boolean;
  online = (nodecg.bundleConfig as Configschema).event.online;
}
</script>
