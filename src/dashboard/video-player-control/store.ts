import clone from 'clone';
import type { ReplicantBrowser } from 'nodecg/types/browser';
import type { VideoPlayer } from 'schemas';
import type { Asset } from 'types';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';

Vue.use(Vuex);

// Replicants and their types
const reps: {
  videoPlayer: ReplicantBrowser<VideoPlayer>;
  videos: ReplicantBrowser<Asset[]>;
  [k: string]: ReplicantBrowser<unknown>;
} = {
  videoPlayer: nodecg.Replicant('videoPlayer'),
  videos: nodecg.Replicant('assets:videos'),
};

interface StateTypes {
  disableSave: boolean;
  newPlaylist: VideoPlayer['playlist'];
}

// Types for mutations/actions below
export type UpdateNewPlaylist = (arr: VideoPlayer['playlist']) => void;
export type PlaylistAdd = (sum: string) => void;
export type Refresh = () => void;
export type Save = () => void;

const store = new Vuex.Store({
  state: {
    disableSave: false,
    newPlaylist: [],
  } as StateTypes,
  mutations: {
    setState(state, { name, val }): void {
      Vue.set(state, name, val);
    },
    updateNewPlaylist(state, arr: VideoPlayer['playlist']): void {
      Vue.set(state, 'newPlaylist', arr);
    },
    playlistAdd(state, sum: string): void {
      state.newPlaylist.push(sum);
    },
    refresh(state): void {
      Vue.set(state, 'newPlaylist', clone(reps.videoPlayer.value?.playlist || []));
    },
  },
  actions: {
    async save({ state }): Promise<void> {
      Vue.set(state, 'disableSave', true);
      if (typeof reps.videoPlayer.value !== 'undefined') {
        reps.videoPlayer.value.playlist = clone(state.newPlaylist);
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

export default async function (): Promise<Store<StateTypes>> {
  return NodeCG.waitForReplicants(
    ...Object.keys(reps).map((key) => reps[key]),
  ).then(() => store);
}
