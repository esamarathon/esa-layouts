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

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture BorderTop BorderRight BorderLeft"
      :style="{
        left: '660px',
        top: '590px',
        width: '300px',
        height: '350px'
      }"
    />
    <div
      id="CameraCapture2"
      class="Capture BorderTop BorderRight"
      :style="{
        left: '960px',
        top: '590px',
        width: '300px',
        height: '350px'
      }"
    />

    <!-- Player 1/Commentator -->
    <div
      class="Fixed"
      :style="{
        left: '0px',
        top: '540px',
        width: '660px',
      }"
    >
      <player :slot-no="0" />
      <commentators-reader />
      <commentators-reader show-reader />
    </div>

    <!-- Player 2/General Run Info -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '1260px',
        top: '540px',
        width: '660px',
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

    <!-- Commentary Bias Meter -->
    <div
      class="Fixed Flex"
      :style="{
        left: '587px',
        top: '505px',
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
        {{ bias.optionTitle }}
      </div>
    </div>
    <div
      class="Fixed Flex BorderTop BorderRight BorderLeft"
      :style="{
        'justify-content': 'space-between',
        padding: '0 7px',
        left: '660px',
        top: '540px',
        width: '600px',
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
        top: '674px',
        width: '660px',
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
import { Bids } from '@esa-layouts/types/schemas';
import { Configschema } from '@esa-layouts/types/schemas/configschema';
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
  bias = (nodecg.bundleConfig as Configschema).tracker.commentaryBias;

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
