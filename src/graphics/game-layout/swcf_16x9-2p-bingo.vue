<template>
  <div>
    <!-- Game Captures -->
    <game-capture
      id="GameCapture1"
      class="BorderBottom BorderTop BorderRight"
      :slot-no="0"
      finish-time-pos="bottomleft"
      :style="{
        left: '1070px',
        top: '0px',
        width: '850px',
        height: '500px',
        'border-color': '#3d9ef4',
      }"
    />
    <game-capture
      id="GameCapture2"
      class="BorderTop BorderBottom BorderRight"
      :slot-no="1"
      finish-time-pos="topleft"
      :style="{
        left: '1070px',
        top: '500px',
        width: '850px',
        height: '500px',
        'border-color': '#f24743',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture BorderLeft BorderRight BorderTop"
      :style="{
        left: '556px',
        top: '0px',
        width: '514px',
        height: '450px',
        'border-color': '#3d9ef4',
      }"
    />
    <div
      id="CameraCapture2"
      class="Capture BorderLeft BorderRight BorderBottom"
      :style="{
        left: '556px',
        top: '550px',
        width: '514px',
        height: '450px',
        'border-color': '#f24743',
      }"
    />

    <!-- Players -->
    <player
      class="Fixed"
      :slot-no="0"
      :style="{
        'font-size': '22px',
        left: '556px',
        top: '450px',
        width: '514px',
        height: '50px',
        'background-color': '#3d9ef4',
      }"
    />
    <player
      class="Fixed"
      :slot-no="1"
      :style="{
        'font-size': '22px',
        left: '556px',
        top: '500px',
        width: '514px',
        height: '50px',
        'background-color': '#f24743',
      }"
    />

    <!-- General Run Info/Commentators -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '0px',
        top: '0px',
        width: '555px',
        height: '462px',
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
