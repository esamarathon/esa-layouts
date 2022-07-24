<template>
  <div>
    <h1>Unread Donations</h1>
    <div
      v-if="!donationsToRead.length"
      :style="{ 'font-size': '30px', 'font-style': 'italic' }"
    >
      None right now!
    </div>
    <donation
      v-for="(donation, index) in donationsToRead"
      :key="donation.id"
      :data="donation"
      :index="index"
    />
  </div>
</template>

<script lang="ts">
import { replicantNS } from '@esa-layouts/browser_shared/replicant_store';
import { DonationsToRead } from '@esa-layouts/types/schemas';
import { Component, Vue } from 'vue-property-decorator';
import Donation from './components/Donation.vue';

@Component({
  components: {
    Donation,
  },
})
export default class extends Vue {
  @replicantNS.State((s) => s.reps.donationsToRead) readonly donationsToRead!: DonationsToRead;
}
</script>

<style>
  body {
    font-family: 'Montserrat', sans-serif;
    background-color: #212121;
    color: white;
    overflow: hidden;
    text-align: center;
  }
</style>
