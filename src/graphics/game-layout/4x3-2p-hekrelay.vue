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
    <!-- Online has 2 camera spots -->
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
          left: '711px',
          top: '770px',
          width: '249px',
          height: '230px',
        }"
      />
      <div
        id="CameraCapture2"
        class="Capture BorderTop BorderRight"
        :style="{
          left: '960px',
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
        width: '711px',
      }"
    >
      <player :slot-no="0" show-team-name />
      <comm-and-reader />
    </div>

    <!-- Player 2/General Run Info -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '1209px',
        top: '720px',
        width: '711px',
        height: '235px',
      }"
    >
      <player :slot-no="1" show-team-name />

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
      class="Fixed Flex BorderTop BorderRight BorderLeft"
      :style="{
        'justify-content': 'space-between',
        padding: '0 7px',
        left: '711px',
        top: '720px',
        width: '498px',
        height: '50px',
        color: 'white',
        'font-size': '25px',
        'text-transform': 'uppercase',
        'font-weight': 600,
        background: `linear-gradient(to right, #e8d53a ${commBiasPercentage}, #af60f7 0)`
      }"
    >
      <div class="BiasBarText">{{ commBiasTeam1Total }}</div>
      <div class="BiasBarText">Commentary Bias</div>
      <div class="BiasBarText">{{ commBiasTeam2Total }}</div>
    </div>

    <!-- Media Box -->
    <media-box
      :font-size="36"
      :style="{
        left: '0px',
        top: '810px',
        width: '711px',
        height: '190px',
      }"
    />

    <!-- Donation Bar -->
    <donation-bar
      :padding="7"
      :style="{
        left: '1209px',
        top: '955px',
        width: '711px',
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
  bidId = 0; // ID of relevant bid in the tracker
  optionId1 = 0; // ID of option of team 1 in the tracker on the above bid
  optionId2 = 0; // ID of option of team 2 in the tracker on the above bid
  online = (nodecg.bundleConfig as Configschema).event.online;

  get commBiasBid(): Bids[0] | undefined {
    return this.bids.find((b) => b.id === this.bidId);
  }

  get commBiasTeam1Total(): string {
    const opt = this.commBiasBid?.options.find((o) => o.id === this.optionId1);
    if (!opt) return '$0'; // If either of the above is not found, return neutral value.
    return formatUSD(opt.total);
  }

  get commBiasTeam2Total(): string {
    const opt = this.commBiasBid?.options.find((o) => o.id === this.optionId2);
    if (!opt) return '$0'; // If either of the above is not found, return neutral value.
    return formatUSD(opt.total);
  }

  get commBiasPercentage(): string {
    const opt = this.commBiasBid?.options.find((o) => o.id === this.optionId1);
    if (!this.commBiasBid || !opt) {
      return '50%'; // If either of the above is not found, return neutral value.
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
