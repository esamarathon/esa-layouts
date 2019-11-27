import clone from 'clone';
import { ReplicantBrowser } from 'nodecg/types/browser';
import { CurrentLayout, CurrentLayoutOverridden, Layouts } from 'schemas';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';

Vue.use(Vuex);

// Replicants and their types
const reps: {
  layouts: ReplicantBrowser<Layouts>;
  currentLayout: ReplicantBrowser<CurrentLayout>;
  currentLayoutOverridden: ReplicantBrowser<CurrentLayoutOverridden>;
  [k: string]: ReplicantBrowser<unknown>;
} = {
  layouts: nodecg.Replicant('layouts'),
  currentLayout: nodecg.Replicant('currentLayout'),
  currentLayoutOverridden: nodecg.Replicant('currentLayoutOverridden'),
};

// Types for mutations below
export type UpdateCurrentLayout = (code: string | null) => void;

const store = new Vuex.Store({
  state: {},
  mutations: {
    setState(state, { name, val }): void {
      Vue.set(state, name, val);
    },
    /* Mutations to replicants start */
    updateCurrentLayout(state, code): void {
      reps.currentLayout.value = code;
      reps.currentLayoutOverridden.value = true;
    },
    /* Mutations to replicants end */
  },
});

Object.keys(reps).forEach((key) => {
  reps[key].on('change', (val) => {
    store.commit('setState', { name: key, val: clone(val) });
  });
});

export default async function (): Promise<Store<{}>> {
  return NodeCG.waitForReplicants(
    ...Object.keys(reps).map((key) => reps[key]),
  ).then(() => store);
}
