import type { VideoPlayer } from '@esa-layouts/types/schemas';
import type NodeCGTypes from '@nodecg/types';
import clone from 'clone';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';

Vue.use(Vuex);
let localEditTimeout: number | undefined;

// Replicants and their types
const reps: {
  videoPlayer: NodeCGTypes.ClientReplicant<VideoPlayer>;
  videos: NodeCGTypes.ClientReplicant<NodeCGTypes.AssetFile[]>;
  [k: string]: NodeCGTypes.ClientReplicant<unknown>;
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
export type PlaylistAdd = (val: { sum?: string, commercial?: boolean }) => void;
export type PlaylistUpdateLength = (val: { i: number, length: number }) => void;
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
    playlistAdd(state, { sum, commercial }: { sum?: string, commercial?: boolean }): void {
      state.newPlaylist.push({ sum, length: 0, commercial: commercial ?? true });
      onLocalEdits(store);
    },
    playlistUpdateLength(state, { i, length }: { i: number, length: string }): void {
      state.newPlaylist[i].length = !Number.isNaN(length) ? Number(length) : 0;
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
      await new Promise((res) => { setTimeout(res, 1000); }); // Fake 1s wait
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
