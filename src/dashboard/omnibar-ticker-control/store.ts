import { ReplicantModule, replicantModule, ReplicantTypes } from '@esa-layouts/browser_shared/replicant_store';
import { Omnibar } from '@esa-layouts/types/schemas';
import clone from 'clone';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';

Vue.use(Vuex);

@Module({ name: 'OurModule' })
class OurModule extends VuexModule {
  localRotation: Omnibar['rotation'] = [];
  localEdits = false;

  // Helper getter to return all replicants.
  get reps(): ReplicantTypes {
    return this.context.rootState.ReplicantModule.reps;
  }

  /**
   * Set local rotation array.
   */
  @Mutation
  setLocalRotation({ val, manual = false }: { val: Omnibar['rotation'], manual?: boolean }): void {
    this.localRotation = clone(val);
    if (manual) this.localEdits = true;
  }

  /**
   * Set global rotation array, usually when saving changes.
   */
  @Mutation
  setGlobalRotation(val: Omnibar['rotation']): void {
    replicantModule.setReplicant<Omnibar>({
      name: 'omnibar',
      val: { ...replicantModule.repsTyped.omnibar, rotation: clone(val) },
    });
    this.localEdits = false;
  }

  /**
   * Delete item from local rotation array.
   */
  @Mutation
  deleteItem(id: string): void {
    const index = this.localRotation.findIndex((r) => r.id === id);
    if (index >= 0) {
      this.localRotation.splice(index, 1);
      this.localEdits = true;
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
