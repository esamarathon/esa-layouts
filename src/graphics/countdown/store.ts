import type { Countdown } from '@/types/schemas';
import clone from 'clone';
import type { ReplicantBrowser } from 'nodecg/types/browser';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';

Vue.use(Vuex);

// Replicants and their types
const reps: {
  countdown: ReplicantBrowser<Countdown>;
  [k: string]: ReplicantBrowser<unknown>;
} = {
  countdown: nodecg.Replicant('countdown'),
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
