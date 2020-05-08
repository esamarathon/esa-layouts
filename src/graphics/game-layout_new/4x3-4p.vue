<template>
  <div>
    <!-- Game Captures -->
    <div
      id="GameCapture1"
      class="Capture BorderRight BorderBottom"
      :style="{
        left: '0px',
        top: '0px',
        width: '626px',
        height: '470px',
      }"
    />
    <div
      id="GameCapture2"
      class="Capture BorderLeft BorderBottom"
      :style="{
        left: '1294px',
        top: '0px',
        width: '626px',
        height: '470px',
      }"
    />
    <div
      id="GameCapture3"
      class="Capture BorderRight"
      :style="{
        left: '0px',
        top: '470px',
        width: '626px',
        height: '470px',
      }"
    />
    <div
      id="GameCapture4"
      class="Capture BorderLeft"
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
      class="Capture BorderTop BorderBottom"
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
      <commentator />

      <!-- Run Game Info/Timer -->
      <div
        class="FlexColumn"
        :style="{
          flex: '1',
          width: '100%',
        }"
      >
        <run-info :style="{ 'font-size': '40px' }" />
        <timer
          :style="{
            'font-size': '90px',
          }"
        />
      </div>

      <!-- Player 1/2 -->
      <div
        class="Flex"
        :style="{ width: '100%' }"
      >
        <player
          :slot-no="0"
          :style="{
            'margin-right': '3px',
            width: 'calc(50%)',
          }"
        />
        <player
          :slot-no="1"
          :style="{
            'margin-left': '3px',
            width: 'calc(50%)',
          }"
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
        :style="{
          'margin-right': '3px',
          width: 'calc(50%)',
        }"
      />
      <player
        :slot-no="3"
        :style="{
          'margin-left': '3px',
          width: 'calc(50%)',
        }"
      />
    </div>

    <!-- Media Box -->
    <media-box
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
