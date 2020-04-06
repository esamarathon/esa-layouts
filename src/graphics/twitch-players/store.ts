import clone from 'clone';
import { ReplicantBrowser } from 'nodecg/types/browser';
import { RestreamViewerTool } from 'schemas';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';

Vue.use(Vuex);

// Replicants and their types
const reps: {
  restreamViewerTool: ReplicantBrowser<RestreamViewerTool>;
  [k: string]: ReplicantBrowser<unknown>;
} = {
  restreamViewerTool: nodecg.Replicant('restreamViewerTool'),
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
