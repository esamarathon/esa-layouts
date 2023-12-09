import { ReplicantModule, ReplicantTypes, replicantModule } from '@esa-layouts/browser_shared/replicant_store';
import { DonationAlerts } from '@esa-layouts/types/schemas';
import clone from 'clone';
import { v4 as uuid } from 'uuid';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { Module, Mutation, VuexModule, getModule } from 'vuex-module-decorators';

Vue.use(Vuex);

@Module({ name: 'OurModule' })
class OurModule extends VuexModule {
  // Helper getter to return all replicants.
  get reps(): ReplicantTypes {
    return this.context.rootState.ReplicantModule.reps;
  }

  @Mutation
  addBlankItem(): void {
    const items = clone(replicantModule.repsTyped.donationAlerts);
    items.push({
      id: uuid(),
      threshold: 0,
      sound: null,
      volume: 50,
      graphic: null,
      graphicDisplayTime: 5,
    });
    replicantModule.setReplicant({ name: 'donationAlerts', val: items });
  }

  @Mutation
  editItem(data: DonationAlerts[0]): void {
    const items = clone(replicantModule.repsTyped.donationAlerts);
    const itemIndex = items.findIndex((i) => i.id === data.id);
    if (itemIndex >= 0) {
      items[itemIndex] = clone(data);
      replicantModule.setReplicant({ name: 'donationAlerts', val: items });
    }
  }

  @Mutation
  removeItem(id: string): void {
    const items = clone(replicantModule.repsTyped.donationAlerts);
    const itemIndex = items.findIndex((i) => i.id === id);
    if (itemIndex >= 0) {
      items.splice(itemIndex, 1);
      replicantModule.setReplicant({ name: 'donationAlerts', val: items });
    }
  }
}

const store = new Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {},
  modules: { ReplicantModule, OurModule },
});
export default store;
export const storeModule = getModule(OurModule, store);
