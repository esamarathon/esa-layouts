<template>
  <div>
    <!-- Game Captures -->
    <game-capture
      id="GameCapture1"
      class="BorderRight"
      :slot-no="0"
      :style="{
        left: '0px',
        top: '0px',
        width: '960px',
        height: '540px',
      }"
    />
    <game-capture
      id="GameCapture2"
      :slot-no="1"
      finish-time-pos="bottomright"
      :style="{
        left: '960px',
        top: '0px',
        width: '960px',
        height: '540px',
      }"
    />

    <!-- Camera Capture -->
    <div
      id="CameraCapture1"
      class="Capture BorderTop BorderRight BorderLeft"
      :style="{
        left: '430px',
        top: '540px',
        width: '600px',
        height: '400px',
      }"
    />

    <!-- Player 1/Commentator -->
    <div
      class="Fixed"
      :style="{
        left: '0px',
        top: '540px',
        width: '430px',
      }"
    >
      <player :slot-no="0" />
      <commentators-reader />
      <commentators-reader show-reader />
    </div>

    <!-- Bingo Card Slot -->
    <div
      class="Fixed BorderTop BorderRight Capture"
      :style="{
        left: '1030px',
        top: '540px',
        width: '460px',
        height: '400px',
      }"
    />

    <!-- Player 2/General Run Info -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '1490px',
        top: '540px',
        width: '430px',
        height: '400px',
      }"
    >
      <player :slot-no="1" />

      <!--<div
        v-if="extraPlayers.length"
        class="Flex CommAndReader"
        :style="{
          width: '100%',
          height: '40px',
          'font-size': '25px',
          'font-weight': 400,
          'white-space': 'nowrap',
        }"
      >
        <span :style="{ 'font-weight': 600, 'padding-right': '5px' }">
          Off Screen:
        </span>
        <template v-for="({ name, pronouns }, i) in extraPlayers">
          <span :key="name">{{ name }}</span>
          <span
            v-if="pronouns"
            :key="`${name}_pronouns`"
            class="Pronouns"
            :style="{
              padding: '1px 3px',
              'margin-left': '4px',
            }"
          >
            {{ pronouns }}
          </span><span
            v-if="i < extraPlayers.length - 1"
            :key="name"
          >,&nbsp;</span>
        </template>
      </div>-->

      <!-- Run Game Info/Timer -->
      <div
        class="FlexColumn"
        :style="{
          flex: '1',
          width: '100%',
          overflow: 'hidden',
        }"
      >
        <run-info
          :style="{ 'font-size': '45px' }"
          no-wrap
        />
        <timer font-size="120px" />
      </div>
    </div>

    <!-- Media Box -->
    <media-box
      :font-size="36"
      :style="{
        left: '0px',
        top: '674px',
        width: '430px',
        height: '266px',
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
import MediaBox from '@shared/graphics/mediabox';
import { RunDataActiveRun } from 'speedcontrol-util/types';
import { Component, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';
import CommentatorsReader from './components/CommentatorsReader.vue';
import DonationBar from './components/DonationBar.vue';
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
    MediaBox,
    DonationBar,
  },
})
export default class extends Vue {
  @State((s) => s.gameLayouts.crowdCamera) readonly crowdCam!: boolean;
  online = nodecg.bundleConfig.event.online;
  @State('runDataActiveRun') runData!: RunDataActiveRun;

  get extraPlayers(): { name: string, pronouns?: string }[] {
    if (this.runData?.relay) return [];
    return (this.runData?.teams[0]?.players || []).slice(2).map((p) => ({
      name: p.name,
      pronouns: p.pronouns,
    }));
  }
}
</script>
