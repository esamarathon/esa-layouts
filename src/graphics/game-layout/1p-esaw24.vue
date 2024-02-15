<template>
  <div>
    <!-- Game Captures -->
    <game-capture
      id="GameCapture1"
      class="BorderLeft"
      :style="{
        left: '796px',
        top: '0px',
        width: '1124px',
        height: '843px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture Flex"
      :style="{
        left: '0px',
        top: '0px',
        width: '796px',
        height: '843px',
        'align-items': 'flex-end',
      }"
    >
      <div
        class="Flex"
        :style="{
          width: '100%',
          // background: 'rgba(0, 0, 0, 0.5)',
          'align-items': 'flex-end',
          padding: '25px',
          'padding-bottom': '25px',
        }
      ">
        <div
          class="Flex"
          :style="{
            gap: '10px',
            // flex-direction and flex-wrap are used in conjunction with a reversed element order
            // so we can have more participant names on the bottom than on top.
            'flex-direction': 'row-reverse',
            'flex-wrap': 'wrap-reverse',
          }"
        >
          <!-- So that we can style it so that participant names are properly weighted
          to the bottom (more on bottom than on top) we actually add the elements
          in reverse order -->
          <participant-info
            v-if="reader"
            type="reader"
            :name="reader.name"
            :pronouns="reader.pronouns"
          />
          <participant-info
            v-for="commentator of comms"
            :key="commentator.name"
            type="commentator"
            :name="commentator.name"
            :pronouns="commentator.pronouns"
          />
          <participant-info
            v-for="player of players.slice(0).reverse()"
            :key="player.id"
            type="player"
            :name="player.name"
            :pronouns="player.pronouns"
            :country="player.country"
          />
        </div>
      </div>
    </div>

    <!-- Run Game Info/Timer -->
    <div
      class="Fixed Flex BorderTop"
      :style="{
        left: '0px',
        top: '843px',
        width: '1346px',
        height: '157px',
      }"
    >
      <run-info
        :style="{
          'font-size': '45px',
          'width': '959px',
          height: '100%',
        }"
      />
      <timer
        :style="{
          'width': '387px',
          height: '100%',
        }"
      />
    </div>

    <!-- Player/Commentators -->
    <!--<div
      class="Fixed FlexColumn"
      :style="{
        left: '0px',
        top: '843px',
        width: '673px',
        height: '157px',
        'justify-content': 'flex-start',
      }"
    >
      <player />
      <commentators-reader />
      <commentators-reader show-reader />
    </div>-->

    <!-- Media Box -->
    <media-box
      class="BorderLeft BorderTop"
      :font-size="40"
      :style="{
        left: '1346px',
        top: '843px',
        width: '574px',
        height: '157px',
      }"
    />
  </div>
</template>

<script lang="ts">
import { Commentators, DonationReader } from '@esa-layouts/types/schemas';
import MediaBox from '@shared/graphics/mediabox';
import { RunDataActiveRun } from 'speedcontrol-util/types';
import { Component, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';
import CommentatorsReader from './components/CommentatorsReader.vue';
import DonationBar from './components/DonationBar.vue';
import GameCapture from './components/GameCapture.vue';
import ParticipantInfo from './components/ParticipantInfo.vue';
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
    ParticipantInfo,
  },
})
export default class extends Vue {
  @State('runDataActiveRun') runData!: RunDataActiveRun;
  @State readonly commentators!: Commentators;
  @State readonly donationReader!: DonationReader;
  @State((s) => s.gameLayouts.crowdCamera) readonly crowdCam!: boolean;
  online = nodecg.bundleConfig.event.online;

  get players() {
    if (!this.runData) return [];
    return this.runData.teams.map((t) => t.players).flat(1);
  }

  // This needs replacing with server data correctly!
  get comms(): { name: string, pronouns?: string }[] {
    return this.commentators.map((c) => ({
      name: c.replace(/\((.*?)\)/g, '').trim(),
      pronouns: (c.match(/\((.*?)\)/g) || [])[0]?.replace(/[()]/g, ''),
    }));
  }

  // This needs replacing with server data correctly!
  get reader(): { name: string, pronouns?: string } | undefined {
    if (!this.donationReader) {
      return undefined;
    }
    return {
      name: this.donationReader.replace(/\((.*?)\)/g, '').trim(),
      pronouns: (this.donationReader.match(/\((.*?)\)/g) || [])[0]?.replace(/[()]/g, ''),
    };
  }
}
</script>
