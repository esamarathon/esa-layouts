<template>
  <div>
    <!-- Game Captures -->
    <game-capture
      id="GameCapture1"
      class="BorderBottom BorderLeft"
      :style="{
        left: '557px',
        top: '0px',
        width: '888px',
        height: '500px',
      }"
    />
    <game-capture
      id="GameCapture2"
      class="BorderLeft"
      :style="{
        left: '557px',
        top: '500px',
        width: '888px',
        height: '500px',
      }"
    />

    <!-- Camera Capture -->
    <div
      id="CameraCapture1"
      class="Capture BorderLeft"
      :style="{
        left: '1445px',
        top: '0px',
        width: '475px',
        height: '950px',
      }"
    />

    <!-- Player 1 -->
    <div
      class="Fixed"
      :style="{
        left: '1445px',
        top: '950px',
        width: '475px',
      }"
    >
      <player />
    </div>

    <!-- General Run Info/Commentators -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '0px',
        top: '0px',
        width: '557px',
        height: '957px',
      }"
    >
      <!-- Run Game Info/Timer -->
      <div
        class="FlexColumn"
        :style="{
          width: '100%',
          overflow: 'hidden',
        }"
      >
        <run-info :style="{ 'font-size': '45px' }" no-wrap />
        <timer font-size="120px" />
      </div>
      <commentators-reader :style="{ 'margin-top': '15px', 'width': '95%' }" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CommentatorsReader from './components/CommentatorsReader.vue';
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
  },
})
export default class extends Vue {}
</script>
