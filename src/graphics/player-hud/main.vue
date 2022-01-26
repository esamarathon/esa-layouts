<template>
  <div
    :class="`PlayerHUD Flex ${alertClass}`"
    :style="{
      'flex-direction': 'column',
      'width': '100vw',
      'height': '100vh',
      'box-sizing': 'border-box',
      'padding': '0 5vw',
      'transition': 'background-color 1s',
      'text-align': 'center',
      'font-size': '18vh',
    }"
  >
    <!-- Tag scanning messages. -->
    <template v-if="tagScanned">
      <template v-if="tagScanned === 'success_comm'">
        <div>✔</div>
        <div>
          <span :style="{ 'font-weight': 600 }">{{ tagDisplayName }}</span>
          scanned in as commentator
        </div>
      </template>
      <template v-else-if="tagScanned === 'success_player'">
        <div>✔</div>
        <div>
          <span :style="{ 'font-weight': 600 }">{{ tagDisplayName }}</span>
          scanned in as player on
          <span :style="{ 'white-space': 'nowrap' }">button {{ buttonId }}!</span>
        </div>
      </template>
      <template v-else-if="tagScanned === 'fail_player'">
        <div>❌</div>
        <div>
          <span :style="{ 'font-weight': 600 }">{{ tagDisplayName }}</span>
          cannot scan in as player on
          <span :style="{ 'white-space': 'nowrap' }">button {{ buttonId }}!</span>
        </div>
      </template>
      <template v-else>
        <div>❔</div>
        <div>Tag was scanned but not needed</div>
      </template>
    </template>
    <!-- Manually triggered message from readers via Stream Deck. -->
    <template v-else-if="streamDeckData.playerHUDTriggerType === 'message'">
      Any time
      <br>for messages?
    </template>
    <!-- Donations to be read message (only if run has started). -->
    <template v-else-if="donationsToRead.length && timer.state !== 'stopped'">
      Donations Pending:
      <br>{{ donationsToRead.length }}
      <br>Largest Unread Donation: {{ largestDonation }}
    </template>
    <!-- Nothing. -->
    <template v-else>
      Nothing currently
      <br>to be read
    </template>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { StreamDeckData, DonationsToRead } from '@esa-layouts/types/schemas';
import { replicantNS } from '@esa-layouts/browser_shared/replicant_store';
import { FlagCarrier } from '@esamarathon/mq-events/types';
import { Timer } from 'speedcontrol-util/types';

@Component
export default class extends Vue {
  @replicantNS.State((s) => s.reps.timer) readonly timer!: Timer;
  @replicantNS.State((s) => s.reps.donationsToRead) readonly donationsToRead!: DonationsToRead;
  @replicantNS.State((s) => s.reps.streamDeckData) readonly streamDeckData!: StreamDeckData;
  tagScanned: 'success_comm' | 'success_player' | 'fail_player' | boolean = false;
  scannedData: FlagCarrier.TagScanned | null = null;
  tagScanTimeout!: number;

  get largestDonation(): string {
    return `$${this.donationsToRead
      .reduce((prev, current) => ((prev > current.amount) ? prev : current.amount), 0)
      .toFixed(2)}`;
  }

  get tagDisplayName(): string {
    if (!this.scannedData) return '';
    return this.scannedData.raw.pronouns
      ? `${this.scannedData.user.displayName} (${this.scannedData.raw.pronouns})`
      : this.scannedData.user.displayName;
  }

  get buttonId(): string {
    return this.scannedData?.flagcarrier.id || '';
  }

  get alertClass(): string {
    if (this.tagScanned) {
      switch (this.tagScanned) {
        case 'success_comm':
        case 'success_player':
          return 'TagSuccess';
        case 'fail_player':
          return 'TagFail';
        default:
          return 'TagNothing';
      }
    }
    if (this.streamDeckData.playerHUDTriggerType === 'message') {
      return 'MessageToRead';
    }
    if (this.donationsToRead.length && this.timer.state !== 'stopped') {
      return 'DonationsToRead';
    }
    return '';
  }

  mounted(): void {
    nodecg.listenFor(
      'bigbuttonTagScanned',
      ({ state, data }: {
        state?: 'success_comm' | 'success_player' | 'fail_player',
        data: FlagCarrier.TagScanned,
      }) => {
        window.clearTimeout(this.tagScanTimeout);
        this.tagScanned = state || true;
        this.scannedData = data;
        this.tagScanTimeout = window.setTimeout(() => {
          this.tagScanned = false;
          this.scannedData = null;
        }, 7000);
      },
    );
  }
}
</script>

<style>
  .PlayerHUD {
    background-color: black;
    color: white;
    text-shadow: 4px 4px 1px black;
  }

  *[class*='Tag'] {
    font-size: 15vh;
  }
  .TagSuccess {
    background-color: rgb(0, 177, 15);
  }
  .TagFail, .TagNothing {
    background-color: rgb(148, 0, 0);
  }

  .DonationsToRead {
    background-color: green;
  }

  .MessageToRead {
    background-color: rgb(255, 208, 0);
    color: black;
    text-shadow: unset;
    font-weight: 600;
  }
</style>
