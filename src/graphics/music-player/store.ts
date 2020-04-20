import clone from 'clone';
import type { ReplicantBrowser } from 'nodecg/types/browser';
import type { MusicPlayer } from 'schemas';
import type { Asset } from 'types';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';

Vue.use(Vuex);

// Replicants and their types
const reps: {
  music: ReplicantBrowser<Asset[]>;
  musicPlayer: ReplicantBrowser<MusicPlayer>;
  [k: string]: ReplicantBrowser<unknown>;
} = {
  music: nodecg.Replicant('assets:music'),
  musicPlayer: nodecg.Replicant('musicPlayer'),
};

// Types for mutations below
export type UpdatePlayingState = (playing: boolean) => void;
export type UpdatePausedState = (paused: boolean) => void;
export type UpdateFile = (sum?: string) => void;
export type UpdatePosition = (pos?: number) => void;
export type UpdateMetadata = (val?: { title?: string; artist?: string }) => void;
export type UpdateHistory = (sum: string) => void;

export interface StateTypes {
  playing: boolean;
  paused: boolean;
  sum?: string;
  position?: number;
  metadata: {
    title?: string;
    artist?: string;
  };
  history: {
    [k: string]: number;
  };
  recent: string[];
}

/**
 * Updates replicant when needed, based on local state.
 * @param state Vuex store state.
 */
function updateReplicant(state: StateTypes): void {
  if (typeof reps.musicPlayer.value !== undefined) {
    reps.musicPlayer.value = {
      playing: state.playing,
      paused: state.paused,
      sum: state.sum,
      position: state.position,
      metadata: {
        title: state.metadata.title,
        artist: state.metadata.artist,
      },
      history: clone(state.history),
      recent: clone(state.recent),
    };
  }
}

const store = new Vuex.Store({
  state: {
    playing: false,
    paused: false,
    sum: undefined,
    position: undefined,
    metadata: {
      title: undefined,
      artist: undefined,
    },
    history: {},
    recent: [],
  } as StateTypes,
  mutations: {
    setState(state, { name, val }): void {
      Vue.set(state, name, val);
    },
    /* Mutations to replicants start */
    updatePlayingState(state, playing): void {
      Vue.set(state, 'playing', playing);
      updateReplicant(state);
    },
    updatePausedState(state, paused): void {
      Vue.set(state, 'paused', paused);
      updateReplicant(state);
    },
    updateFile(state, sum): void {
      Vue.set(state, 'sum', sum);
      updateReplicant(state);
    },
    updatePosition(state, pos): void {
      Vue.set(state, 'position', (pos && pos >= 0) ? Math.floor(pos) : pos);
      updateReplicant(state);
    },
    updateMetadata(state, { title, artist } = {}): void {
      Vue.set(state.metadata, 'title', title);
      Vue.set(state.metadata, 'artist', artist);
      updateReplicant(state);
    },
    updateHistory(state, sum: string): void {
      const count = state.history[sum] ? state.history[sum] + 1 : 1;
      Vue.set(state.history, sum, count);
      const recent = clone(state.recent);
      recent.push(sum);
      recent.length = Math.min(recent.length, 10);
      if (recent.length < (reps.music.value?.length || 0)) {
        Vue.set(state, 'recent', clone(recent));
      } else {
        Vue.set(state, 'recent', recent.slice(1));
      }
      updateReplicant(state);
    },
    /* Mutations to replicants end */
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
  )
    .then(() => {
      // Updates local state with replicant contents on start.
      Vue.set(store.state, 'playing', reps.musicPlayer.value?.playing);
      Vue.set(store.state, 'paused', reps.musicPlayer.value?.paused);
      Vue.set(store.state, 'sum', reps.musicPlayer.value?.sum);
      Vue.set(store.state, 'position', reps.musicPlayer.value?.position);
      Vue.set(store.state.metadata, 'title', reps.musicPlayer.value?.metadata.title);
      Vue.set(store.state.metadata, 'artist', reps.musicPlayer.value?.metadata.artist);
      Vue.set(store.state, 'history', clone(reps.musicPlayer.value?.history));
      Vue.set(store.state, 'recent', clone(reps.musicPlayer.value?.recent));
    })
    .then(() => store);
}
