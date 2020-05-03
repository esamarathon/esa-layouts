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
      class="Fixed Flex BorderBottom NoWrap HideOverflow BorderBox"
      :style="{
        left: '0px',
        top: '380px',
        width: '668px',
        height: '310px',
        'flex-direction': 'column'
      }"
    >
      <!-- player, to be done -->
      <div
        class="TestArea Flex"
        :style="{ height: '50px', width: '100%' }"
      >
        PLAYER TO GO HERE
      </div>

      <!-- commentators, to be done -->
      <div
        class="TestArea Flex"
        :style="{ height: '40px', width: '100%' }"
      >
        COMMENTATOR TO GO HERE
      </div>

      <!-- Run Game Info/Timer -->
      <div
        class="Flex"
        :style="{
          flex: '1',
          'flex-direction': 'column',
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
import RunInfo from './components/RunInfo.vue';
import Timer from './components/Timer.vue';
import MediaBox from '../_misc/components/MediaBox.vue';

@Component({
  components: {
    RunInfo,
    Timer,
    MediaBox,
  },
})
export default class extends Vue {}
</script>

<style scoped>
  .TestArea {
    background-color: rgba(255, 192, 203, 0.5);
  }
</style>
