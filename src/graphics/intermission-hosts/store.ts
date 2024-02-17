import { ReplicantModule, ReplicantTypes } from '@esa-layouts/browser_shared/replicant_store';
import { RunData } from 'speedcontrol-util/types';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { Module, Mutation, VuexModule, getModule } from 'vuex-module-decorators';

Vue.use(Vuex);

@Module({ name: 'OurModule' })
class OurModule extends VuexModule {
  nextRun: RunData | null = null;

  // Helper getter to return all replicants.
  get reps(): ReplicantTypes {
    return this.context.rootState.ReplicantModule.reps;
  }

  @Mutation
  setNextRun(run: RunData): void {
    Vue.set(this, 'nextRun', run);
  }
}

const store = new Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {},
  modules: { ReplicantModule, OurModule },
});
export default store;
export const storeModule = getModule(OurModule, store);
