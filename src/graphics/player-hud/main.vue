<template>
  <div
    :class="`PlayerHUD ${backgroundClass}`"
  >
    <template v-if="tagScanned">
      Tag Scanned:
      <br>{{ scannedName }}
      <br>on button {{ buttonID }}
    </template>
    <template v-else-if="donationsToRead.length">
      Donations Pending:
      <br>{{ donationsToRead.length }}
      <br>Largest Unread Donation: {{ largestDonation }}
    </template>
    <template v-else-if="streamDeckData.playerHUDTriggerType">
      <template v-if="streamDeckData.playerHUDTriggerType === 'message'">
        Any time
        <br>for messages?
      </template>
    </template>
    <template v-else>
      Nothing currently
      <br>to be read
    </template>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { StreamDeckData, DonationsToRead } from '@esa-layouts/types/schemas';

@Component
export default class extends Vue {
  @State donationsToRead!: DonationsToRead;
  @State streamDeckData!: StreamDeckData;
  tagScanned = false;
  scannedName = '';
  buttonID = '';
  tagScanTimeout!: number;

  get largestDonation(): string {
    return `$${this.donationsToRead
      .reduce((prev, current) => ((prev > current.amount) ? prev : current.amount), 0)
      .toFixed(2)}`;
  }

  get backgroundClass(): string {
    if (this.tagScanned) {
      return 'TagScanned';
    }
    if (this.donationsToRead.length) {
      return 'DonationsToRead';
    }
    if (this.streamDeckData.playerHUDTriggerType) {
      return 'MessageToRead';
    }
    return '';
  }

  mounted(): void {
    nodecg.listenFor('bigbuttonTagScanned', (data) => {
      window.clearTimeout(this.tagScanTimeout);
      this.tagScanned = true;
      this.buttonID = data.flagcarrier.id;
      this.scannedName = data.user.displayName;
      this.tagScanTimeout = window.setTimeout(() => {
        this.tagScanned = false;
        this.buttonID = '';
        this.scannedName = '';
      }, 5000);
    });
  }
}
</script>

<style>
  body {
    font-family: 'Barlow Condensed';
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  .PlayerHUD {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    color: white;
    background-color: black;
    transition: background-color 1s;
    text-shadow: 4px 4px 1px black;
    text-align: center;
    font-size: 18vh;
  }

  .TagScanned {
    background-color: rgb(165, 0, 165);
  }
  .DonationsToRead {
    background-color: rgb(0, 177, 15);
  }
  .MessageToRead {
    background-color: rgb(255, 208, 0);
    color: black;
    text-shadow: unset;
    font-weight: 600;
  }
</style>
