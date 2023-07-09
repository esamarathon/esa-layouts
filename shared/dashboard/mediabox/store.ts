import type NodeCGTypes from '@nodecg/types';
import clone from 'clone';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import type { MediaBox } from '../../types';
import type { MediaBox as MediaBoxRep, Prizes } from '../../types/schemas';

Vue.use(Vuex);

// Replicants and their types
const reps: {
  images: NodeCGTypes.ClientReplicant<NodeCGTypes.AssetFile[]>;
  prizes: NodeCGTypes.ClientReplicant<Prizes>;
  settings: NodeCGTypes.ClientReplicant<MediaBoxRep>;
  [k: string]: NodeCGTypes.ClientReplicant<unknown>;
} = {
  images: nodecg.Replicant('assets:media-box-images'),
  prizes: nodecg.Replicant('prizes'),
  settings: nodecg.Replicant('mediaBox'),
};

interface StateTypes {
  images: NodeCGTypes.AssetFile[];
  prizes: Prizes;
  disableSave: boolean;
  newRotation: MediaBox.RotationElem[];
}

// Types for mutations/actions below
export type UpdateNewRotation = (arr: MediaBox.RotationElem[]) => void;
export type Save = () => void;

export const store = new Vuex.Store({
  state: {
    images: [],
    prizes: [],
    disableSave: false,
    newRotation: [],
  } as StateTypes,
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
      await new Promise((res) => { setTimeout(res, 1000); }); // Fake 1s wait
      Vue.set(state, 'disableSave', false);
    },
  },
});

Object.keys(reps).forEach((key) => {
  reps[key].on('change', (val) => {
    store.commit('setState', { name: key, val: clone(val) });
  });
});

export const setUpReplicants = async (): Promise<Store<StateTypes>> => {
  await NodeCG.waitForReplicants(...Object.keys(reps).map((key) => reps[key]));
  return store;
};
export default setUpReplicants;
