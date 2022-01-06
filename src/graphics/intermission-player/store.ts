import type { UpcomingRunID, VideoPlayer } from '@esa-layouts/types/schemas';
import clone from 'clone';
import type { ReplicantBrowser } from 'nodecg/types/browser';
import { RunData, RunDataArray } from 'speedcontrol-util/types';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';

Vue.use(Vuex);

// Replicants and their types
const reps: {
  runDataArray: ReplicantBrowser<RunDataArray>;
  upcomingRunID: ReplicantBrowser<UpcomingRunID>;
  videoPlayer: ReplicantBrowser<VideoPlayer>;
  [k: string]: ReplicantBrowser<unknown>;
} = {
  runDataArray: nodecg.Replicant('runDataArray', 'nodecg-speedcontrol'),
  upcomingRunID: nodecg.Replicant('upcomingRunID'),
  videoPlayer: nodecg.Replicant('videoPlayer'),
};

interface StateTypes {
  upcomingRunID: UpcomingRunID;
}

const store = new Vuex.Store({
  state: {
    upcomingRunID: null,
    nextRun: null,
  },
  mutations: {
    setState(state, { name, val }): void {
      Vue.set(state, name, val);
    },
    setNextRun(state, run: RunData): void {
      Vue.set(state, 'nextRun', run);
    },
  },
});

Object.keys(reps).forEach((key) => {
  reps[key].on('change', (val) => {
    store.commit('setState', { name: key, val: clone(val) });
  });
});

export default async (): Promise<Store<StateTypes>> => {
  await NodeCG.waitForReplicants(...Object.keys(reps).map((key) => reps[key]));
  return store;
};
