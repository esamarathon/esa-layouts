import clone from 'clone';
import type { ReplicantBrowser } from 'nodecg/types/browser';
import type { UpcomingRunID } from 'schemas';
import SpeedcontrolUtil from 'speedcontrol-util/browser';
import type { RunDataActiveRunSurrounding, RunDataArray } from 'speedcontrol-util/types';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';

const sc = new SpeedcontrolUtil(nodecg);
Vue.use(Vuex);

// Replicants and their types
const reps: {
  runDataArray: ReplicantBrowser<RunDataArray>;
  runDataActiveRunSurrounding: ReplicantBrowser<RunDataActiveRunSurrounding>;
  upcomingRunID: ReplicantBrowser<UpcomingRunID>;
  [k: string]: ReplicantBrowser<unknown>;
} = {
  runDataArray: sc.runDataArray,
  runDataActiveRunSurrounding: sc.runDataActiveRunSurrounding,
  upcomingRunID: nodecg.Replicant('upcomingRunID'),
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
