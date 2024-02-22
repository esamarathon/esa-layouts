import { replicantModule, ReplicantModule, ReplicantTypes } from '@esa-layouts/browser_shared/replicant_store';
import clone from 'clone';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';

Vue.use(Vuex);

@Module({ name: 'OurModule' })
class OurModule extends VuexModule {
  // Helper getter to return all replicants.
  get reps(): ReplicantTypes {
    return this.context.rootState.ReplicantModule.reps;
  }

  @Mutation
  toggleItem({ key, active }: { key: string, active: boolean }): void {
    const donations = clone(replicantModule.repsTyped.additionalDonations);
    const donationIndex = donations.findIndex((d) => d.key === key);
    if (donationIndex >= 0) {
      donations[donationIndex].active = active;
    } else {
      donations.push({ key, active });
    }
    replicantModule.setReplicant({ name: 'additionalDonations', val: donations });
  }
}

const store = new Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {},
  modules: { ReplicantModule, OurModule },
});
export default store;
export const storeModule = getModule(OurModule, store);
