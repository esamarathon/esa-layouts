<template>
  <div :class="`PlayerHUD ${donationsToRead.length || tagScanned ? 'Success' : ''}`">
    <div
      v-if="tagScanned"
    >
      Tag Scanned:
      <br>{{ scannedName }}
      <br>on button {{ buttonID }}
    </div>
    <div
      v-else
      :class="donationsToRead.length ? 'ToRead' : ''"
    >
      <template v-if="donationsToRead.length">
        Time for donations? 😊
      </template>
      <template v-else>
        No Donations Currently
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { Donation } from 'types';

@Component
export default class extends Vue {
  @State donationsToRead!: Donation;
  tagScanned = false;
  scannedName = '';
  buttonID = '';
  tagScanTimeout!: number;

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
  @import url('https://fonts.googleapis.com/css?family=Barlow+Condensed:400,400i,500,500i,600,600i,700,700i,800,800i,900,900i&display=swap&subset=latin-ext,vietnamese');

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

  .Success {
    background-color: rgb(0, 177, 15);
  }
</style>
