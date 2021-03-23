import type { UpcomingRunID } from '@/types/schemas';
import clone from 'clone';
import type { ReplicantBrowser } from 'nodecg/types/browser';
import { SpeedcontrolUtilBrowser } from 'speedcontrol-util';
import type { RunDataActiveRunSurrounding, RunDataArray } from 'speedcontrol-util/schemas';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';

const sc = new SpeedcontrolUtilBrowser(nodecg);
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
