import clone from 'clone';
import type { ReplicantBrowser } from 'nodecg/types/browser';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';

Vue.use(Vuex);

export interface Users {
  [k: string]: {
    [k: string]: {
      display_name: string;
      country_code?: string;
    };
  };
}

// Replicants and their types
const reps: {
  users: ReplicantBrowser<Users>;
  [k: string]: ReplicantBrowser<unknown>;
} = {
  users: nodecg.Replicant('users', 'speedcontrol-flagcarrier'),
};

const store = new Vuex.Store({
  state: {},
  mutations: {
    setState(state, { name, val }): void {
      Vue.set(state, name, val);
    },
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
