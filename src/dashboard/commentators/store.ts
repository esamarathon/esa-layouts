import clone from 'clone';
import type { ReplicantBrowser } from 'nodecg/types/browser';
import type { Commentators } from 'schemas';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';

Vue.use(Vuex);

// Replicants and their types
const reps: {
  commentators: ReplicantBrowser<Commentators>;
  [k: string]: ReplicantBrowser<unknown>;
} = {
  commentators: nodecg.Replicant('commentators'),
};

// Types for mutations below
export type ClearCommentators = () => void;
export type AddCommentator = (name: string) => void;

const store = new Vuex.Store({
  state: {},
  mutations: {
    setState(state, { name, val }): void {
      Vue.set(state, name, val);
    },
    /* Mutations to replicants start */
    clearCommentators(): void {
      if (typeof reps.commentators.value !== 'undefined') {
        reps.commentators.value.length = 0;
      }
    },
    addCommentator(state, name): void {
      if (typeof reps.commentators.value !== 'undefined'
        && !reps.commentators.value.includes(name)) {
        reps.commentators.value.push(name);
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

export default async (): Promise<Store<Record<string, unknown>>> => {
  await NodeCG.waitForReplicants(...Object.keys(reps).map((key) => reps[key]));
  return store;
};
