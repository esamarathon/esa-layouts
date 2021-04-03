import type { VideoPlayer } from '@esa-layouts/types/schemas';
import type { Asset } from '@esamarathon/esa-layouts-shared/types';
import clone from 'clone';
import type { ReplicantBrowser } from 'nodecg/types/browser';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';

Vue.use(Vuex);
let localEditTimeout: number | undefined;

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
  localEdits: boolean;
  newPlaylist: VideoPlayer['playlist'];
}

// Types for mutations/actions below
export type UpdateNewPlaylist = (arr: VideoPlayer['playlist']) => void;
export type PlaylistAdd = (sum: string) => void;
export type PlaylistRemove = (i: number) => void;
export type PlaylistRefresh = () => void;
export type Save = () => void;

function onLocalEdits(store: Store<StateTypes>): void {
  Vue.set(store.state, 'localEdits', true);
  window.clearTimeout(localEditTimeout);
  localEditTimeout = window.setTimeout(() => {
    store.commit('playlistRefresh');
  }, 30 * 1000);
}

const store = new Vuex.Store({
  state: {
    disableSave: false,
    localEdits: false,
    newPlaylist: [],
  } as StateTypes,
  mutations: {
    setState(state, { name, val }): void {
      Vue.set(state, name, val);
    },
    updateNewPlaylist(state, arr: VideoPlayer['playlist']): void {
      Vue.set(state, 'newPlaylist', arr);
      onLocalEdits(store);
    },
    playlistAdd(state, sum: string): void {
      state.newPlaylist.push(sum);
      onLocalEdits(store);
    },
    playlistRemove(state, i: number): void {
      state.newPlaylist.splice(i, 1);
      onLocalEdits(store);
    },
    playlistRefresh(state): void {
      Vue.set(state, 'newPlaylist', clone(reps.videoPlayer.value?.playlist || []));
      Vue.set(state, 'localEdits', false);
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
      window.clearTimeout(localEditTimeout);
      Vue.set(state, 'localEdits', false);
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
