<template>
  <div>
    <!-- Game Captures -->
    <div
      id="GameCapture1"
      class="Capture BorderLeft"
      :style="{
        left: '668px',
        top: '0px',
        width: '1252px',
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
        width: '668px',
        height: '380px',
      }"
    />

    <!-- General Run Info -->
    <div
      class="Fixed FlexColumn BorderBottom NoWrap HideOverflow BorderBox"
      :style="{
        left: '0px',
        top: '380px',
        width: '668px',
        height: '310px',
      }"
    >
      <player />
      <commentator />

      <!-- Run Game Info/Timer -->
      <div
        class="Flex FlexColumn"
        :style="{
          flex: '1',
          'padding-top': '10px',
        }"
      >
        <run-info />
        <timer />
      </div>
    </div>

    <!-- Media Box -->
    <media-box
      :style="{
        left: '0px',
        top: '690px',
        width: '668px',
        height: '310px',
      }"
    />

    <!-- Donations Bar -->
    <div
      class="Fixed BorderLeft"
      :style="{
        left: '668px',
        top: '940px',
        width: '1252px',
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

@Component({
  components: {
    Player,
    Commentator,
    RunInfo,
    Timer,
    MediaBox,
  },
})
export default class extends Vue {}
</script>
