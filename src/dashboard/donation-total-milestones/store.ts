import { replicantModule, ReplicantModule, ReplicantTypes } from '@esa-layouts/browser_shared/replicant_store';
import { DonationTotalMilestones, Omnibar } from '@esa-layouts/types/schemas';
import clone from 'clone';
import { v4 as uuid } from 'uuid';
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
  addBlankItem(): void {
    const items = clone(replicantModule.repsTyped.donationTotalMilestones);
    items.push({
      id: uuid(),
      name: 'Default Milestone Name',
      enabled: false,
    });
    replicantModule.setReplicant({ name: 'donationTotalMilestones', val: items });
  }

  @Mutation
  toggleItem({ id, enabled }: { id: string, enabled: boolean }): void {
    const items = clone(replicantModule.repsTyped.donationTotalMilestones);
    const item = items.find((i) => i.id === id);
    if (item && (item.addition || item.amount)) {
      item.enabled = enabled;
      if (item.addition) {
        item.amount = enabled
          ? replicantModule.repsTyped.donationTotal + item.addition
          : undefined;
      }
      replicantModule.setReplicant({ name: 'donationTotalMilestones', val: items });
    }
  }

  @Mutation
  pinItem({ id, pinned }: { id: string, pinned: boolean }): void {
    replicantModule.setReplicant<Omnibar>({
      name: 'omnibar',
      val: { ...replicantModule.repsTyped.omnibar, pin: pinned ? { type: 'Milestone', id } : null },
    });
  }

  @Mutation
  editItem(data: DonationTotalMilestones[0]): void {
    const items = clone(replicantModule.repsTyped.donationTotalMilestones);
    const itemIndex = items.findIndex((i) => i.id === data.id);
    if (itemIndex >= 0) {
      items[itemIndex] = clone(data);
      replicantModule.setReplicant({ name: 'donationTotalMilestones', val: items });
    }
  }

  @Mutation
  removeItem(id: string): void {
    const items = clone(replicantModule.repsTyped.donationTotalMilestones);
    const itemIndex = items.findIndex((i) => i.id === id);
    if (itemIndex >= 0 && !items[itemIndex].enabled) {
      items.splice(itemIndex, 1);
      replicantModule.setReplicant({ name: 'donationTotalMilestones', val: items });
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
