<template>
  <v-app>
    <v-btn @click="addBlank">Add New Donation Alert Tier</v-btn>
    <div v-if="!donationAlerts.length" class="pa-3 font-italic">
      No donation alert tiers created, add a new one with the button above.
    </div>
    <div v-else :style="{ 'margin-top': '10px' }">
      <alert v-for="(alert, i) in donationAlerts" :key="alert.id" :alert="alert" :index="i" />
    </div>
  </v-app>
</template>

<script lang="ts">
import { replicantNS } from '@esa-layouts/browser_shared/replicant_store';
import { DonationAlerts } from '@esa-layouts/types/schemas';
import { Component, Vue } from 'vue-property-decorator';
import Alert from './components/Alert.vue';
import { storeModule } from './store';

@Component({
  components: {
    Alert,
  },
})
export default class DonationAlertControl extends Vue {
  @replicantNS.State((s) => s.reps.donationAlerts) readonly donationAlerts!: DonationAlerts;

  addBlank(): void {
    storeModule.addBlankItem();
  }
}
</script>
