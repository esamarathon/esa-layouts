import type { UpcomingRunID, VideoPlayer } from '@esa-layouts/types/schemas';
import type { Asset } from '@esamarathon/esa-layouts-shared/types';
import clone from 'clone';
import type { ReplicantBrowser } from 'nodecg/types/browser';
import { RunData } from 'speedcontrol-util/types';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';

Vue.use(Vuex);

// Replicants and their types
const reps: {
  upcomingRunID: ReplicantBrowser<UpcomingRunID>;
  videoPlayer: ReplicantBrowser<VideoPlayer>;
  videos: ReplicantBrowser<Asset[]>;
  [k: string]: ReplicantBrowser<unknown>;
} = {
  upcomingRunID: nodecg.Replicant('upcomingRunID'),
  videoPlayer: nodecg.Replicant('videoPlayer'),
  videos: nodecg.Replicant('assets:videos'),
};

interface StateTypes {
  upcomingRunID: UpcomingRunID;
}

// Types for mutations below
export type UpdatePlayingState = (isPlaying: boolean) => void;
export type UpdateCurrent = (sum?: string) => void;
export type UpdatePlayCount = (sum: string) => void;
export type ClearPlaylist = () => void;

const store = new Vuex.Store({
  state: {
    upcomingRunID: null,
  },
  mutations: {
    setState(state, { name, val }): void {
      Vue.set(state, name, val);
    },
    setNextRuns(state, runs: RunData[]): void {
      Vue.set(state, 'nextRuns', runs);
    },
    /* Mutations to replicants start */
    updatePlayingState(state, isPlaying: boolean): void {
      if (typeof reps.videoPlayer.value !== 'undefined') {
        reps.videoPlayer.value.playing = isPlaying;
      }
    },
    updateCurrent(state, sum?: string): void {
      if (typeof reps.videoPlayer.value !== 'undefined') {
        reps.videoPlayer.value.current = sum || null;
      }
    },
    updatePlayCount(state, sum: string): void {
      if (typeof reps.videoPlayer.value !== 'undefined' && sum) {
        if (!reps.videoPlayer.value.plays[sum]) {
          reps.videoPlayer.value.plays[sum] = 1;
        } else {
          reps.videoPlayer.value.plays[sum] += 1;
        }
      }
    },
    clearPlaylist(): void {
      if (typeof reps.videoPlayer.value !== 'undefined') {
        reps.videoPlayer.value.playlist.length = 0;
      }
    },
    /* Mutations to replicants end */
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
