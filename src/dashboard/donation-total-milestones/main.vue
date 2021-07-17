<template>
  <v-app :style="{ 'min-height': '250px' }">
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
import { DonationTotalMilestones } from '@esa-layouts/types/schemas';
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
  @replicantNS
    .State((s) => s.reps.donationTotalMilestones) readonly milestones!: DonationTotalMilestones;

  addBlank(): void {
    storeModule.addBlankItem();
  }
}
</script>
