import type NodeCGTypes from '@nodecg/types';
import clone from 'clone';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';

Vue.use(Vuex);

export interface Users {
  [k: string]: {
    [k: string]: {
      display_name: string; // eslint-disable-line camelcase
      country_code?: string; // eslint-disable-line camelcase
    };
  };
}

// Replicants and their types
const reps: {
  users: NodeCGTypes.ClientReplicant<Users>;
  [k: string]: NodeCGTypes.ClientReplicant<unknown>;
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

export default async (): Promise<Store<Record<string, unknown>>> => {
  await NodeCG.waitForReplicants(...Object.keys(reps).map((key) => reps[key]));
  return store;
};
