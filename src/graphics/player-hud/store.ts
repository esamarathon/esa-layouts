import clone from 'clone';
import { ReplicantBrowser } from 'nodecg/types/browser';
import { DonationsToRead, StreamDeckData } from 'schemas';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';

Vue.use(Vuex);

// Replicants and their types
const reps: {
  donationsToRead: ReplicantBrowser<DonationsToRead>;
  streamDeckData: ReplicantBrowser<StreamDeckData>;
  [k: string]: ReplicantBrowser<unknown>;
} = {
  donationsToRead: nodecg.Replicant('donationsToRead'),
  streamDeckData: nodecg.Replicant('streamDeckData'),
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
