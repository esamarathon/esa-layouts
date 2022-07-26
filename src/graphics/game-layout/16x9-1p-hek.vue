<template>
  <div>
    <!-- Game Captures -->
    <game-capture
      id="GameCapture1"
      class="BorderLeft BorderBottom"
      :style="{
        left: '533px',
        top: '0px',
        width: '1387px',
        height: '780px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture"
      :style="{
        left: '0px',
        top: '50px',
        width: '533px',
        height: '500px',
      }"
    />

    <!-- Run Game Info/Timer -->
    <div
      class="Fixed Flex"
      :style="{
        left: '533px',
        top: '780px',
        width: '1387px',
        height: '160px',
      }"
    >
      <run-info
        class="BorderLeft"
        :style="{
          'font-size': '45px',
          'width': '1000px',
          height: '100%',
        }"
      />
      <timer
        class="BorderLeft"
        :style="{
          'width': '387px',
          height: '100%',
        }"
      />
    </div>

    <!-- Player/Commentator -->
    <div
      class="Fixed"
      :style="{
        left: '0px',
        top: '550px',
        width: '533px',
      }"
    >
      <player />
      <commentators-reader />
      <commentators-reader show-reader />
    </div>

    <!-- Commentary Bias Meter -->
    <div
      class="Fixed Flex"
      :style="{
        left: '0px',
        top: '47px',
        width: '533px',
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
        {{ bias.optionTitle }}
      </div>
    </div>
    <div
      class="Fixed Flex BorderBottom"
      :style="{
        'justify-content': 'space-between',
        padding: '0 7px',
        left: '0px',
        top: '0px',
        width: '533px',
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
      vertical
      :font-size="36"
      :style="{
        left: '0px',
        top: '684px',
        width: '533px',
        height: '256px',
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
import { Bids, Configschema } from '@esa-layouts/types/schemas';
import MediaBox from '@shared/graphics/mediabox';
import { Component, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { formatUSD } from '../_misc/helpers';
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
  @State bids!: Bids;
  bias = (nodecg.bundleConfig as Configschema).tracker.otherBidwarBias;

  get commBiasBid(): Bids[0] | undefined {
    return this.bids.find((b) => b.id === this.bias.bidId);
  }

  get commBiasTeam1Total(): string {
    const opt = this.commBiasBid?.options.find((o) => o.id === this.bias.option1Id);
    if (!opt) return '$0'; // If the above is not found, return neutral value.
    return formatUSD(opt.total);
  }

  get commBiasTeam2Total(): string {
    const opt = this.commBiasBid?.options.find((o) => o.id === this.bias.option2Id);
    if (!opt) return '$0'; // If the above is not found, return neutral value.
    return formatUSD(opt.total);
  }

  get commBiasTeam1Diff(): string | null {
    const opt1 = this.commBiasBid?.options.find((o) => o.id === this.bias.option1Id);
    const opt2 = this.commBiasBid?.options.find((o) => o.id === this.bias.option2Id);
    if (!opt1 || !opt2) return null; // If either of the above is not found, return nothing.
    const diff = opt1.total - opt2.total;
    if (!diff) return null; // If there is no difference, return nothing.
    return `${diff > 0 ? '+' : '-'}${formatUSD(Math.abs(diff))}`;
  }

  get commBiasTeam2Diff(): string | null {
    const opt1 = this.commBiasBid?.options.find((o) => o.id === this.bias.option1Id);
    const opt2 = this.commBiasBid?.options.find((o) => o.id === this.bias.option2Id);
    if (!opt1 || !opt2) return null; // If either of the above is not found, return nothing.
    const diff = opt2.total - opt1.total;
    if (!diff) return null; // If there is no difference, return nothing.
    return `${diff > 0 ? '+' : '-'}${formatUSD(Math.abs(diff))}`;
  }

  get commBiasPercentage(): string {
    const opt = this.commBiasBid?.options.find((o) => o.id === this.bias.option1Id);
    if (!this.commBiasBid || !opt || this.commBiasBid.total <= 0) {
      return '50%'; // If the bid/option above is not found or $0, return neutral value.
    }
    return `${Math.floor((opt.total / this.commBiasBid.total) * 100)}%`;
  }
}
</script>
