import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { getModule, Module, VuexModule } from 'vuex-module-decorators';
import { ReplicantModule, ReplicantTypes } from '../../browser_shared/replicant_store';

Vue.use(Vuex);

@Module({ name: 'OurModule' })
class OurModule extends VuexModule {
  // Helper getter to return all replicants.
  get reps(): ReplicantTypes {
    return this.context.rootState.ReplicantModule.reps;
  }
}

const store = new Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {},
  modules: { ReplicantModule },
});
export default store;
export const storeModule = getModule(OurModule, store);
