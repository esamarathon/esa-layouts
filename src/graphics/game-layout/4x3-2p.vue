<template>
  <div>
    <!-- Game Captures -->
    <game-capture
      id="GameCapture1"
      class="BorderRight"
      :slot-no="0"
      :style="{
        left: '0px',
        top: '0px',
        width: '960px',
        height: '720px',
      }"
    />
    <game-capture
      id="GameCapture2"
      :slot-no="1"
      finish-time-pos="bottomright"
      :style="{
        left: '960px',
        top: '0px',
        width: '960px',
        height: '720px',
      }"
    />

    <!-- Camera Captures -->
    <!-- Online has 2 camera spots -->
    <div
      v-if="!online"
      id="CameraCapture1"
      class="Capture BorderTop BorderRight BorderLeft"
      :style="{
        left: '711px',
        top: '720px',
        width: '498px',
        height: '280px',
      }"
    />
    <template v-else>
      <div
        id="CameraCapture1"
        class="Capture BorderTop BorderRight BorderLeft"
        :style="{
          left: '711px',
          top: '720px',
          width: '249px',
          height: '280px',
        }"
      />
      <div
        id="CameraCapture2"
        class="Capture BorderTop BorderRight"
        :style="{
          left: '960px',
          top: '720px',
          width: '249px',
          height: '280px',
        }"
      />
    </template>

    <!-- Player 1/Commentator -->
    <div
      class="Fixed"
      :style="{
        left: '0px',
        top: '720px',
        width: '711px',
      }"
    >
      <player :slot-no="0" />
      <comm-and-reader />
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
      <player :slot-no="1" />

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
          top-margin="-0.09em"
          font-size="80px"
        />
      </div>
    </div>

    <!-- Media Box -->
    <media-box
      :font-size="36"
      :style="{
        left: '0px',
        top: '810px',
        width: '711px',
        height: '190px',
      }"
    />

    <!-- Donation Bar -->
    <donation-bar
      :padding="7"
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
