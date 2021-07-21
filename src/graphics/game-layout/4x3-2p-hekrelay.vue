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
        height: '720px',
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
        height: '720px',
      }"
    />

    <!-- Camera Captures -->
    <!-- Online has 3 camera spots -->
    <div
      v-if="!online"
      id="CameraCapture1"
      class="Capture BorderTop BorderRight BorderLeft"
      :style="{
        left: '711px',
        top: '770px',
        width: '498px',
        height: '230px',
      }"
    />
    <template v-else>
      <div
        id="CameraCapture1"
        class="Capture BorderTop BorderRight BorderLeft"
        :style="{
          left: '587px',
          top: '770px',
          width: '249px',
          height: '230px',
        }"
      />
      <div
        id="CameraCapture2"
        class="Capture BorderTop BorderRight"
        :style="{
          left: '836px',
          top: '770px',
          width: '249px',
          height: '230px',
        }"
      />
      <div
        id="CameraCapture3"
        class="Capture BorderTop BorderRight"
        :style="{
          left: '1085px',
          top: '770px',
          width: '249px',
          height: '230px',
        }"
      />
    </template>

    <!-- Player 1/Commentator -->
    <div
      class="Fixed"
      :style="{
        left: '0px',
        top: '720px',
        width: '587px',
      }"
    >
      <player :slot-no="0" />
      <comm-and-reader />
    </div>

    <!-- Player 2/General Run Info -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '1334px',
        top: '720px',
        width: '586px',
        height: '235px',
      }"
    >
      <player :slot-no="1" />

      <!-- Run Game Info/Timer -->
      <div
        class="FlexColumn"
        :style="{
          flex: '1',
          width: '100%',
        }"
      >
        <run-info :style="{ 'font-size': '35px' }" />
        <timer
          top-margin="-0.09em"
          font-size="80px"
        />
      </div>
    </div>

    <!-- Commentary Bias Meter -->
    <div
      class="Fixed Flex"
      :style="{
        left: '587px',
        top: '685px',
        width: '747px',
        height: '35px',
      }"
    >
      <div
        class="Flex"
        :style="{
          'background-color': '#41245b', // HARDCODED COLOUR, BAD!
          color: 'white', // HARDCODED COLOUR, BAD!
          height: '100%',
          padding: '0 10px',
          'font-size': '25px',
          'text-transform': 'uppercase',
          'font-weight': 600,
        }"
      >
        Commentary Bias
      </div>
    </div>
    <div
      class="Fixed Flex BorderTop BorderRight BorderLeft"
      :style="{
        'justify-content': 'space-between',
        padding: '0 7px',
        left: '587px',
        top: '720px',
        width: '747px',
        height: '50px',
        color: 'white',
        'font-size': '25px',
        'font-weight': 600,
        background: `linear-gradient(to right, #e8d53a ${commBiasPercentage}, #af60f7 0)`
      }"
    >
      <div class="BiasBarText">
        {{ commBiasTeam1Total }}
        <template v-if="commBiasTeam1Diff">({{ commBiasTeam1Diff }})</template>
      </div>
      <div class="BiasBarText">
        <template v-if="commBiasTeam1Diff">({{ commBiasTeam2Diff }})</template>
        {{ commBiasTeam2Total }}
      </div>
    </div>

    <!-- Media Box -->
    <media-box
      :font-size="36"
      :style="{
        left: '0px',
        top: '810px',
        width: '587px',
        height: '190px',
      }"
    />

    <!-- Donation Bar -->
    <donation-bar
      :padding="7"
      :style="{
        left: '1334px',
        top: '955px',
        width: '586px',
        height: '45px',
      }"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Configschema } from '@esa-layouts/types/schemas/configschema';
import MediaBox from '@esamarathon/esa-layouts-shared/mediabox/graphics';
import { State } from 'vuex-class';
import { Bids } from '@esa-layouts/types/schemas';
import GameCapture from './components/GameCapture.vue';
import Player from './components/Player.vue';
import CommAndReader from './components/CommAndReader.vue';
import RunInfo from './components/RunInfo.vue';
import Timer from './components/Timer.vue';
import DonationBar from './components/DonationBar.vue';
import { formatUSD } from '../_misc/helpers';

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
export default class extends Vue {
  @State bids!: Bids;
  bidId = 0; // ID of relevant bid in the tracker.
  optionId1 = 0; // ID of option of team 1 in the tracker on the above bid.
  optionId2 = 0; // ID of option of team 2 in the tracker on the above bid.
  online = (nodecg.bundleConfig as Configschema).event.online;

  get commBiasBid(): Bids[0] | undefined {
    return this.bids.find((b) => b.id === this.bidId);
  }

  get commBiasTeam1Total(): string {
    const opt = this.commBiasBid?.options.find((o) => o.id === this.optionId1);
    if (!opt) return '$0'; // If the above is not found, return neutral value.
    return formatUSD(opt.total);
  }

  get commBiasTeam2Total(): string {
    const opt = this.commBiasBid?.options.find((o) => o.id === this.optionId2);
    if (!opt) return '$0'; // If the above is not found, return neutral value.
    return formatUSD(opt.total);
  }

  get commBiasTeam1Diff(): string | null {
    const opt1 = this.commBiasBid?.options.find((o) => o.id === this.optionId1);
    const opt2 = this.commBiasBid?.options.find((o) => o.id === this.optionId2);
    if (!opt1 || !opt2) return null; // If either of the above is not found, return nothing.
    const diff = opt1.total - opt2.total;
    if (!diff) return null; // If there is no difference, return nothing.
    return `${diff > 0 ? '+' : '-'}${formatUSD(diff)}`;
  }

  get commBiasTeam2Diff(): string | null {
    const opt1 = this.commBiasBid?.options.find((o) => o.id === this.optionId1);
    const opt2 = this.commBiasBid?.options.find((o) => o.id === this.optionId2);
    if (!opt1 || !opt2) return null; // If either of the above is not found, return nothing.
    const diff = opt2.total - opt1.total;
    if (!diff) return null; // If there is no difference, return nothing.
    return `${diff > 0 ? '+' : '-'}${formatUSD(diff)}`;
  }

  get commBiasPercentage(): string {
    const opt = this.commBiasBid?.options.find((o) => o.id === this.optionId1);
    if (!this.commBiasBid || !opt || this.commBiasBid.total <= 0) {
      return '50%'; // If the bid/option above is not found or $0, return neutral value.
    }
    return `${Math.floor((opt.total / this.commBiasBid.total) * 100)}%`;
  }
}
</script>

<style scoped>
  .BiasBarText {
    background-color: rgba(0, 0, 0, 0.4);
    padding: 3px 7px;
    border-radius: 10px;
  }
</style>
