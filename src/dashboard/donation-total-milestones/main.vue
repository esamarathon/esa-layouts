<template>
  <v-app>
    <div class="mb-2 d-flex">
      <div>
        <span class="font-weight-bold">Donation Total:</span>
        ${{ formatAmount(total) }}
      </div>
      <v-spacer />
      <div>
        <v-radio-group v-model="sortOpt" row class="pa-0 ma-0" hide-details label="Sort By">
          <v-radio label="Added" :value="0" />
          <v-radio label="Name" :value="1" />
          <v-radio label="Amount" :value="2" class="mr-0" />
        </v-radio-group>
      </div>
    </div>
    <v-btn @click="addBlank">Add New Milestone</v-btn>
    <div v-if="!milestonesSorted.length" class="pa-3 font-italic">
      No milestones created, add a new one with the button above.
    </div>
    <div v-else :style="{ height: '350px', 'overflow-y': 'scroll', 'margin-top': '10px' }">
      <milestone
        v-for="(milestone, i) in milestonesSorted"
        :key="milestone.id"
        :milestone="milestone"
        :index="i"
      />
    </div>
  </v-app>
</template>

<script lang="ts">
import { DonationTotal, DonationTotalMilestones } from '@esa-layouts/types/schemas';
import { Vue, Component } from 'vue-property-decorator';
import { replicantNS } from '@esa-layouts/browser_shared/replicant_store';
import { sortBy } from 'lodash';
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
  sortByName = false;
  sortOpt = 2;

  get milestonesSorted(): DonationTotalMilestones {
    if (this.sortOpt === 1) {
      return sortBy(this.milestones, ['name']);
    }
    if (this.sortOpt === 2) {
      return sortBy(this.milestones, (o) => (o.addition ? this.total + o.addition : o.amount));
    }
    return this.milestones;
  }

  formatAmount(val: number): string {
    return val.toLocaleString('en-US', { maximumFractionDigits: 0 });
  }

  addBlank(): void {
    storeModule.addBlankItem();
  }
}
</script>
