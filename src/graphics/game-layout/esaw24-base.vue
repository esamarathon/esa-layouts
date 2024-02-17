<template>
  <div>
    <!-- Game Captures -->
    <game-capture
      id="GameCapture1"
      class="BorderLeft"
      :style="{
        left: left || '796px',
        top: top || '0px',
        width: width || '1124px',
        height: height || '843px',
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
            v-if="donationReaderNew"
            type="reader"
            :name="donationReaderNew.name"
            :pronouns="donationReaderNew.pronouns"
            :country="donationReaderNew.country"
          />
          <participant-info
            v-for="commentator of commentatorsNew.slice(0).reverse()"
            :key="commentator.name"
            type="commentator"
            :name="commentator.name"
            :pronouns="commentator.pronouns"
            :country="commentator.country"
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
import { CommentatorsNew, DonationReaderNew } from '@esa-layouts/types/schemas';
import MediaBox from '@shared/graphics/mediabox';
import { RunDataActiveRun } from 'speedcontrol-util/types';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';
import ParticipantInfo from '../_misc/components/ParticipantInfo.vue';
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
    ParticipantInfo,
  },
})
export default class extends Vue {
  @Prop({ type: String, required: false }) left!: string | undefined;
  @Prop({ type: String, required: false }) top!: string | undefined;
  @Prop({ type: String, required: false }) width!: string | undefined;
  @Prop({ type: String, required: false }) height!: string | undefined;
  @State('runDataActiveRun') runData!: RunDataActiveRun;
  @State readonly commentatorsNew!: CommentatorsNew;
  @State readonly donationReaderNew!: DonationReaderNew;
  @State((s) => s.gameLayouts.crowdCamera) readonly crowdCam!: boolean;
  online = nodecg.bundleConfig.event.online;

  get players() {
    if (!this.runData) return [];
    return this.runData.teams.map((t) => t.players).flat(1);
  }
}
</script>

<style>
  @import url('../_misc/themes/esaw24.theme.css');
</style>
