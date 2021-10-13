<template>
  <div>
    <!-- Game Captures -->
    <game-capture
      id="GameCapture1"
      class="BorderRight BorderBottom"
      :slot-no="0"
      finish-time-pos="topleft"
      :style="{
        left: '0px',
        top: '0px',
        width: '626px',
        height: '470px',
      }"
    />
    <game-capture
      id="GameCapture2"
      class="BorderLeft BorderBottom"
      :slot-no="1"
      finish-time-pos="topright"
      :style="{
        left: '1294px',
        top: '0px',
        width: '626px',
        height: '470px',
      }"
    />
    <game-capture
      id="GameCapture3"
      class="BorderRight"
      :slot-no="2"
      :style="{
        left: '0px',
        top: '470px',
        width: '626px',
        height: '470px',
      }"
    />
    <game-capture
      id="GameCapture4"
      class="BorderLeft"
      :slot-no="3"
      finish-time-pos="bottomright"
      :style="{
        left: '1294px',
        top: '470px',
        width: '626px',
        height: '470px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture"
      :style="{
        left: '626px',
        top: '308px',
        width: '668px',
        height: '325px',
      }"
    />

    <!-- General Run Info -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '626px',
        top: '0px',
        width: '668px',
        height: '308px',
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
        <run-info :style="{ 'font-size': '40px' }" />
        <timer font-size="90px" />
      </div>

      <!-- Player 1/2 -->
      <div
        class="Flex"
        :style="{ width: '100%' }"
      >
        <player
          :slot-no="0"
          class="Player"
          :style="{ 'margin-right': '3px' }"
        />
        <player
          :slot-no="1"
          class="Player"
          :style="{ 'margin-left': '3px' }"
        />
      </div>
    </div>

    <!-- Player 3/4 -->
    <div
      class="Fixed Flex"
      :style="{
        left: '626px',
        top: '633px',
        width: '668px',
      }"
    >
      <player
        :slot-no="2"
        class="Player"
        :style="{ 'margin-right': '3px' }"
      />
      <player
        :slot-no="3"
        class="Player"
        :style="{ 'margin-left': '3px' }"
      />
    </div>

    <!-- Media Box -->
    <media-box
      :font-size="35"
      :style="{
        left: '626px',
        top: '683px',
        width: '668px',
        height: '257px',
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
import MediaBox from '@shared/graphics/mediabox';
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
export default class extends Vue {}
</script>

<style scoped>
  .Player {
    width: calc(50%);
  }
</style>
