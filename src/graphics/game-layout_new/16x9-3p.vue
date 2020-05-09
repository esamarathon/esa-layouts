<template>
  <div>
    <!-- Game Captures -->
    <div
      id="GameCapture1"
      class="Capture BorderRight BorderBottom"
      :style="{
        left: '0px',
        top: '40px',
        width: '765px',
        height: '430px',
      }"
    />
    <div
      id="GameCapture2"
      class="Capture BorderLeft BorderBottom"
      :style="{
        left: '1155px',
        top: '40px',
        width: '765px',
        height: '430px',
      }"
    />
    <div
      id="GameCapture3"
      class="Capture BorderLeft"
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
      <commentator />
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
