<template>
  <div>
    <!-- Game Captures -->
    <game-capture
      id="GameCapture1"
      class="BorderLeft BorderBottom"
      :style="{
        left: gameLeft || '533px',
        top: '0px',
        width: gameWidth || '1387px',
        height: gameHeight || '780px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture Flex"
      :style="{
        left: '0px',
        top: '0px',
        width: cameraWidth || '533px',
        height: cameraHeight || '780px',
      }"
    />

    <!-- Participants -->
    <div
      :class="{
        Flex: true,
        BorderBottom: participantsBorderBottom,
      }"
      :style="{
        left: '0px',
        top: '0px',
        width: cameraWidth || '533px',
        height: participantsHeight || '780px',
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
          zoom: participantsZoom || 1,
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
      class="Fixed Flex"
      :style="{
        left: '0px',
        top: gameInfoMediaBoxTop || '780px',
        width: '1346px',
        height: gameInfoMediaBoxHeight || '160px',
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
      class="BorderLeft"
      :font-size="40"
      :style="{
        left: '1346px',
        top: gameInfoMediaBoxTop || '780px',
        width: '574px',
        height: gameInfoMediaBoxHeight || '160px',
      }"
    />

    <!-- Donation Bar -->
    <donation-bar
      :padding="donationBarBoxPadding || 15"
      :style="{
        left: '0px',
        top: donationBarTop || '940px',
        width: donationBarWidth || '1920px',
        height: donationBarHeight || '60px',
        'font-size': donationBarBoxFontSize || '30px',
      }"
    />
  </div>
</template>

<script lang="ts">
import { CommentatorsNew, DonationReaderNew } from '@esa-layouts/types/schemas';
import MediaBox from '@shared/graphics/mediabox';
import { RunDataActiveRun, RunDataPlayer } from 'speedcontrol-util/types';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';
import ParticipantInfo from '../_misc/components/ParticipantInfo.vue';
import DonationBar from './components/DonationBar.vue';
import GameCapture from './components/GameCapture.vue';
import RunInfo from './components/RunInfo.vue';
import Timer from './components/Timer.vue';

@Component({
  components: {
    GameCapture,
    RunInfo,
    Timer,
    MediaBox,
    DonationBar,
    ParticipantInfo,
  },
})
export default class extends Vue {
  @Prop({ type: String, required: false }) gameLeft!: string | undefined;
  @Prop({ type: String, required: false }) gameWidth!: string | undefined;
  @Prop({ type: String, required: false }) gameHeight!: string | undefined;
  @Prop({ type: String, required: false }) cameraWidth!: string | undefined;
  @Prop({ type: String, required: false }) cameraHeight!: string | undefined;
  @Prop({ type: String, required: false }) participantsHeight!: string | undefined;
  @Prop({ type: Number, required: false }) participantsZoom!: number | undefined;
  @Prop({ type: Boolean, default: true }) participantsBorderBottom!: boolean;
  @Prop({ type: String, required: false }) gameInfoMediaBoxTop!: string | undefined;
  @Prop({ type: String, required: false }) gameInfoMediaBoxHeight!: string | undefined;
  @Prop({ type: String, required: false }) donationBarTop!: string | undefined;
  @Prop({ type: String, required: false }) donationBarWidth!: string | undefined;
  @Prop({ type: String, required: false }) donationBarHeight!: string | undefined;
  @Prop({ type: Number, required: false }) donationBarBoxPadding!: number | undefined;
  @Prop({ type: String, required: false }) donationBarBoxFontSize!: string | undefined;
  @State('runDataActiveRun') runData!: RunDataActiveRun;
  @State readonly commentatorsNew!: CommentatorsNew;
  @State readonly donationReaderNew!: DonationReaderNew;

  get players(): RunDataPlayer[] {
    if (!this.runData) return [];
    if (this.runData.relay) {
      const team = this.runData?.teams[0];
      const player = team?.players.find((p) => p.id === team.relayPlayerID);
      return player ? [player] : [];
    }
    return this.runData.teams.map((t) => t.players).flat(1);
  }
}
</script>

<style>
  @import url('../_misc/themes/esaw24.theme.css');
</style>
