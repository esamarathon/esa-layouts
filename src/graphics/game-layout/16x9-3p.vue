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
        top: '40px',
        width: '765px',
        height: '430px',
      }"
    />
    <game-capture
      id="GameCapture2"
      class="BorderLeft BorderBottom"
      :slot-no="1"
      finish-time-pos="topright"
      :style="{
        left: '1155px',
        top: '40px',
        width: '765px',
        height: '430px',
      }"
    />
    <game-capture
      id="GameCapture3"
      class="BorderLeft"
      :slot-no="2"
      finish-time-pos="bottomright"
      :style="{
        left: '1155px',
        top: '470px',
        width: '765px',
        height: '430px',
      }"
    />

    <!-- Camera Captures -->
    <!-- Commentators Inside -->
    <div
      id="CameraCapture1"
      class="Capture Flex BorderRight"
      :style="{
        'justify-content': 'flex-start',
        'flex-direction': 'column-reverse',
        left: '0px',
        top: '470px',
        width: '765px',
        height: '470px',
      }"
    >
      <comm-and-reader />
    </div>

    <!-- Players -->
    <player
      class="Fixed"
      :slot-no="0"
      :style="{
        'font-size': '22px',
        left: '0px',
        top: '0px',
        width: '765px',
        height: '40px',
      }"
    />
    <player
      class="Fixed"
      :slot-no="1"
      :style="{
        'font-size': '22px',
        left: '1155px',
        top: '0px',
        width: '765px',
        height: '40px',
      }"
    />
    <player
      class="Fixed"
      :slot-no="2"
      :style="{
        'font-size': '22px',
        left: '1155px',
        top: '900px',
        width: '765px',
        height: '40px',
      }"
    />

    <!-- Run Game Info/Timer -->
    <div
      class="Fixed FlexColumn BorderBottom"
      :style="{
        left: '765px',
        top: '0px',
        width: '390px',
        height: '390px',
      }"
    >
      <run-info no-wrap />
      <timer />
    </div>

    <!-- Media Box -->
    <media-box
      vertical
      :font-size="42"
      :style="{
        left: '765px',
        top: '390px',
        width: '390px',
        height: '550px',
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
