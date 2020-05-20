import clone from 'clone';
import type { ReplicantBrowser } from 'nodecg/types/browser';
import type { MediaBox, Prizes } from 'schemas';
import type { Asset } from 'types';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';

Vue.use(Vuex);

// Replicants and their types
const reps: {
  images: ReplicantBrowser<Asset[]>;
  prizes: ReplicantBrowser<Prizes>;
  settings: ReplicantBrowser<MediaBox>;
  [k: string]: ReplicantBrowser<unknown>;
} = {
  images: nodecg.Replicant('assets:media-box-images'),
  prizes: nodecg.Replicant('prizes'),
  settings: nodecg.Replicant('mediaBox'),
};

// Types for mutations/actions below
export type UpdateNewRotation = (arr: MediaBox['rotation']) => void;
export type Save = () => void;

const store = new Vuex.Store({
  state: {
    disableSave: false,
    newRotation: [] as MediaBox['rotation'],
  },
  mutations: {
    setState(state, { name, val }): void {
      Vue.set(state, name, val);
    },
    updateNewRotation(state, arr): void {
      Vue.set(state, 'newRotation', arr);
    },
  },
  actions: {
    async save({ state }): Promise<void> {
      Vue.set(state, 'disableSave', true);
      if (typeof reps.settings.value !== 'undefined') {
        reps.settings.value.rotation = clone(state.newRotation);
      }
      await new Promise((res) => setTimeout(res, 1000)); // Fake 1s wait
      Vue.set(state, 'disableSave', false);
    },
  },
});

Object.keys(reps).forEach((key) => {
  reps[key].on('change', (val) => {
    store.commit('setState', { name: key, val: clone(val) });
  });
});

export default async function (): Promise<Store<{
  disableSave: boolean;
  newRotation: MediaBox['rotation'];
}>> {
  return NodeCG.waitForReplicants(
    ...Object.keys(reps).map((key) => reps[key]),
  ).then(() => store);
}
