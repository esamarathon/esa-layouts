import clone from 'clone';
import type { ReplicantBrowser } from 'nodecg/types/browser';
import type { DonationReader } from 'schemas';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';

Vue.use(Vuex);

// Replicants and their types
const reps: {
  donationReader: ReplicantBrowser<DonationReader>;
  [k: string]: ReplicantBrowser<unknown>;
} = {
  donationReader: nodecg.Replicant('donationReader'),
};

// Types for mutations below
export type Modify = (name: string) => void;
export type Clear = () => void;

const store = new Vuex.Store({
  state: {},
  mutations: {
    setState(state, { name, val }): void {
      Vue.set(state, name, val);
    },
    /* Mutations to replicants start */
    modify(state, name): void {
      reps.donationReader.value = name;
    },
    clear(): void {
      reps.donationReader.value = null;
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
