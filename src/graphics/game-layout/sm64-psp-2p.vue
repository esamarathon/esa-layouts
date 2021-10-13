<template>
  <div>
    <!-- Game Captures -->
    <!-- Player 1 -->
    <game-capture
      id="GameCapture1"
      class="BorderRight"
      :slot-no="0"
      :style="{
        left: '0px',
        top: '0px',
        width: '678px',
        height: '508px',
      }"
    />
    <game-capture
      id="GameCapture2"
      class="BorderRight"
      :style="{
        left: '0px',
        top: '558px',
        width: '419px',
        height: '382px',
      }"
    />
    <!-- Player 2 -->
    <game-capture
      id="GameCapture3"
      class="BorderLeft"
      :slot-no="1"
      finish-time-pos="bottomright"
      :style="{
        left: '1242px',
        top: '0px',
        width: '678px',
        height: '508px',
      }"
    />
    <game-capture
      id="GameCapture4"
      class="BorderLeft"
      :style="{
        left: '1501px',
        top: '558px',
        width: '419px',
        height: '382px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture BorderRight"
      :style="{
        left: '419px',
        top: '558px',
        width: '541px',
        height: '382px',
      }"
    />
    <div
      id="CameraCapture2"
      class="Capture"
      :style="{
        left: '960px',
        top: '558px',
        width: '541px',
        height: '382px',
      }"
    />

    <!-- Player 1 -->
    <player
      class="Fixed"
      :style="{
        left: '0px',
        top: '508px',
        width: '960px',
      }"
      :slot-no="0"
    />

    <!-- Player 2 -->
    <player
      class="Fixed"
      :style="{
        left: '960px',
        top: '508px',
        width: '960px',
      }"
      :slot-no="1"
    />

    <!-- General Run Info -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '678px',
        top: '-2px',
        width: '564px',
        height: '258px',
      }"
    >
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
        <timer
          top-margin="-0.09em"
          font-size="75px"
        />
      </div>
    </div>

    <!-- Media Box -->
    <media-box
      class="BorderTop"
      :style="{
        left: '678px',
        top: '256px',
        width: '564px',
        height: '252px',
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
import { Configschema } from '@esa-layouts/types/schemas/configschema';
import MediaBox from '@shared/graphics/mediabox';
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
  online = (nodecg.bundleConfig as Configschema).event.online;
}
</script>
