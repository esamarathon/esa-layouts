<template>
  <v-app :style="{ 'min-height': '250px' }">
    <div class="mb-2">
      <span class="font-weight-bold">Current Donation Total:</span>
      ${{ formatAmount(total) }}
    </div>
    <v-btn @click="addBlank">Add New Milestone</v-btn>
    <div v-if="!milestones.length" class="pa-3 font-italic">
      No milestones created, add a new one with the button above.
    </div>
    <template v-else>
      <milestone v-for="milestone in milestones" :key="milestone.id" :milestone="milestone" />
    </template>
  </v-app>
</template>

<script lang="ts">
import { DonationTotal, DonationTotalMilestones } from '@esa-layouts/types/schemas';
import { Vue, Component } from 'vue-property-decorator';
import { replicantNS } from '@esa-layouts/browser_shared/replicant_store';
import { storeModule } from './store';
import Milestone from './components/Milestone.vue';

@Component({
  components: {
    Milestone,
  },
})
export default class extends Vue {
  @replicantNS.State((s) => s.reps.donationTotal) readonly total!: DonationTotal;
  @replicantNS.State(
    (s) => s.reps.donationTotalMilestones,
  ) readonly milestones!: DonationTotalMilestones;

  formatAmount(val: number): string {
    return val.toLocaleString('en-US', { maximumFractionDigits: 0 });
  }

  addBlank(): void {
    storeModule.addBlankItem();
  }
}
</script>
