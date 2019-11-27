import clone from 'clone';
import { ReplicantBrowser } from 'nodecg/types/browser';
import { CurrentVideoSum } from 'schemas';
import { Asset } from 'types';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';

Vue.use(Vuex);

// Replicants and their types
const reps: {
  currentVideoSum: ReplicantBrowser<CurrentVideoSum>;
  videos: ReplicantBrowser<Asset[]>;
  [k: string]: ReplicantBrowser<unknown>;
} = {
  currentVideoSum: nodecg.Replicant('currentVideoSum'),
  videos: nodecg.Replicant('assets:videos'),
};

// Types for mutations below
export type UpdateCurrentVideo = (sum: string | null) => void;

const store = new Vuex.Store({
  state: {},
  mutations: {
    setState(state, { name, val }): void {
      Vue.set(state, name, val);
    },
    /* Mutations to replicants start */
    updateCurrentVideo(state, sum): void {
      reps.currentVideoSum.value = sum;
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
