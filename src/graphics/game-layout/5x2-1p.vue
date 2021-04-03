<template>
  <div>
    <!-- Game Captures -->
    <game-capture
      id="GameCapture1"
      class="BorderBottom"
      :slot-no="0"
      :style="{
        left: '0px',
        top: '0px',
        width: '1920px',
        height: '768px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture BorderRight BorderLeft"
      :style="{
        left: '755px',
        top: '768px',
        width: '410px',
        height: '232px',
      }"
    />

    <!-- Player 1 -->
    <div
      class="Fixed"
      :style="{
        left: '0px',
        top: '768px',
        width: '755px',
      }"
    >
      <player />
    </div>

    <!-- Commentator/General Run Info -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '1165px',
        top: '768px',
        width: '755px',
        height: '187px',
      }"
    >
      <comm-and-reader />

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
          top-margin="-0.12em"
          font-size="70px"
        />
      </div>
    </div>

    <!-- Media Box -->
    <media-box
      :font-size="35"
      :style="{
        left: '0px',
        top: '818px',
        width: '755px',
        height: '182px',
      }"
    />

    <!-- Donation Bar -->
    <donation-bar
      :padding="7"
      :style="{
        left: '1165px',
        top: '955px',
        width: '755px',
        height: '45px',
      }"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Configschema } from '@esa-layouts/types/schemas/configschema';
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
export default class extends Vue {
  online = (nodecg.bundleConfig as Configschema).event.online;
}
</script>
