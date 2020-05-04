<template>
  <div>
    <!-- Game Captures -->
    <div
      id="GameCapture1"
      class="Capture BorderLeft"
      :style="{
        left: '875px',
        top: '0px',
        width: '1045px',
        height: '940px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture"
      :style="{
        left: '0px',
        top: '0px',
        width: '875px',
        height: '492px',
      }"
    />

    <!-- General Run Info -->
    <div
      class="Fixed FlexColumn BorderBottom NoWrap"
      :style="{
        left: '0px',
        top: '492px',
        width: '875px',
        height: '210px',
      }"
    >
      <player />
      <commentator />

      <!-- Run Game Info/Timer -->
      <div
        class="Flex NoWrap"
        :style="{ flex: '1', width: '100%' }"
      >
        <run-info
          class="BorderRight"
          :style="{
            flex: '3',
            height: '100%',
          }"
        />
        <timer
          :style="{
            'min-width': '350px',
            flex: '1',
            height: '100%',
          }"
        />
      </div>
    </div>

    <!-- Media Box -->
    <media-box
      :style="{
        left: '0px',
        top: '702px',
        width: '875px',
        height: '298px',
      }"
    />

    <!-- Donation Bar -->
    <donation-bar
      class="BorderLeft"
      :style="{
        left: '875px',
        top: '940px',
        width: '1045px',
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
