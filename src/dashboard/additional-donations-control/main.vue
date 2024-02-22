<template>
  <v-app>
  <div class="mb-2">
    <donation
      v-for="donation of additionalDonationsMapped"
      :key="donation.key"
      :donation="donation"
    />
  </div>
  </v-app>
</template>

<script lang="ts">
import { replicantNS } from '@esa-layouts/browser_shared/replicant_store';
import { AdditionalDonations } from '@esa-layouts/types/schemas';
import { Component, Vue } from 'vue-property-decorator';
import Donation from './components/Donation.vue';

@Component({
  components: {
    Donation,
  },
})
export default class extends Vue {
  @replicantNS.State(
    (s) => s.reps.additionalDonations,
  ) readonly additionalDonations!: AdditionalDonations;
  additionalDonationsCfg = nodecg.bundleConfig.additionalDonations;

  formatAmount(val: number): string {
    return val.toLocaleString('en-US', { maximumFractionDigits: 0 });
  }

  get additionalDonationsMapped() {
    return this.additionalDonationsCfg.map((d) => ({
      key: d.key,
      description: d.description,
      amount: d.amount,
      active: this.additionalDonations.find((a) => a.key === d.key)?.active ?? false,
    }));
  }
}
</script>
