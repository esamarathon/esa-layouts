<template>
  <div>
    <!-- Game Captures -->
    <game-capture
      id="GameCapture1"
      class="BorderLeft BorderTop BorderRight"
      :slot-no="0"
      finish-time-pos="bottomleft"
      :style="{
        left: '556px',
        top: '0px',
        width: '682px',
        height: '384px',
        'border-color': '#3d9ef4',
      }"
    />
    <game-capture
      id="GameCapture2"
      class="BorderLeft BorderRight BorderTop"
      :slot-no="1"
      finish-time-pos="bottomleft"
      :style="{
        left: '1238px',
        top: '0px',
        width: '682px',
        height: '384px',
        'border-color': '#f24743',
      }"
    />
    <game-capture
      id="GameCapture3"
      class="BorderLeft BorderBottom BorderRight"
      :slot-no="2"
      finish-time-pos="topright"
      :style="{
        left: '556px',
        top: '616px',
        width: '682px',
        height: '384px',
        'border-color': '#fd9618',
      }"
    />
    <game-capture
      id="GameCapture4"
      class="BorderLeft BorderBottom BorderRight"
      :slot-no="3"
      finish-time-pos="topright"
      :style="{
        left: '1238px',
        top: '616px',
        width: '682px',
        height: '384px',
        'border-color': '#25cf0f',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture BorderLeft BorderTop BorderBottom BorderRight"
      :style="{
        left: '914px',
        top: '384px',
        width: '324px',
        height: '182px',
        'border-color': '#3d9ef4',
      }"
    />
    <div
      id="CameraCapture2"
      class="Capture BorderLeft BorderTop BorderBottom BorderRight"
      :style="{
        left: '1596px',
        top: '384px',
        width: '324px',
        height: '182px',
        'border-color': '#f24743',
      }"
    />
    <div
      id="CameraCapture3"
      class="Capture BorderLeft BorderBottom BorderRight BorderTop"
      :style="{
        left: '556px',
        top: '434px',
        width: '324px',
        height: '182px',
        'border-color': '#fd9618',
      }"
    />
    <div
      id="CameraCapture4"
      class="Capture BorderLeft BorderBottom BorderRight BorderTop"
      :style="{
        left: '1238px',
        top: '434px',
        width: '324px',
        height: '182px',
        'border-color': '#25cf0f',
      }"
    />

    <!-- Players -->
    <player
      class="Fixed"
      :slot-no="0"
      :style="{
        'font-size': '22px',
        left: '556px',
        top: '384px',
        width: '358px',
        height: '50px',
        'background-color': '#3d9ef4',
      }"
    />
    <player
      class="Fixed"
      :slot-no="1"
      :style="{
        'font-size': '22px',
        left: '1238px',
        top: '384px',
        width: '358px',
        height: '50px',
        'background-color': '#f24743',
      }"
    />
    <player
      class="Fixed"
      :slot-no="2"
      :style="{
        'font-size': '22px',
        left: '880px',
        top: '566px',
        width: '358px',
        height: '50px',
        'background-color': '#fd9618',
      }"
    />
    <player
      class="Fixed"
      :slot-no="3"
      :style="{
        'font-size': '22px',
        left: '1562px',
        top: '566px',
        width: '358px',
        height: '50px',
        'background-color': '#25cf0f',
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
