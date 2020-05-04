import clone from 'clone';
import type { ReplicantBrowser } from 'nodecg/types/browser';
import type { Commentators, GameLayouts, SponsorLogos } from 'schemas';
import SpeedcontrolUtil from 'speedcontrol-util/browser';
import type { RunDataActiveRun, Timer } from 'speedcontrol-util/types';
import type { Asset } from 'types';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';

const sc = new SpeedcontrolUtil(nodecg);
Vue.use(Vuex);

// Replicants and their types
const reps: {
  gameLayouts: ReplicantBrowser<GameLayouts>;
  sponsorLogoAssets: ReplicantBrowser<Asset[]>;
  sponsorLogos: ReplicantBrowser<SponsorLogos>;
  commentators: ReplicantBrowser<Commentators>;
  timer: ReplicantBrowser<Timer>;
  runDataActiveRun: ReplicantBrowser<RunDataActiveRun>;
  [k: string]: ReplicantBrowser<unknown>;
} = {
  gameLayouts: nodecg.Replicant('gameLayouts'),
  sponsorLogoAssets: nodecg.Replicant('assets:sponsor-logos'),
  sponsorLogos: nodecg.Replicant('sponsorLogos'),
  commentators: nodecg.Replicant('commentators'),
  timer: sc.timer,
  runDataActiveRun: sc.runDataActiveRun,
};

// Types for mutations below
export type UpdateSelected = (code?: string) => void;
export type UpdateList = (list: GameLayouts['available']) => void;
export type ClearList = () => void;

const store = new Vuex.Store({
  state: {},
  mutations: {
    setState(state, { name, val }): void {
      Vue.set(state, name, val);
    },
    /* Mutations to replicants start */
    updateSelected(state, code): void {
      if (typeof reps.gameLayouts.value !== 'undefined') {
        reps.gameLayouts.value.selected = code;
      }
    },
    updateList(state, list): void {
      if (typeof reps.gameLayouts.value !== 'undefined') {
        reps.gameLayouts.value.available = clone(list);
      }
    },
    clearList(): void {
      if (typeof reps.gameLayouts.value !== 'undefined') {
        reps.gameLayouts.value.available.length = 0;
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

export default async function (): Promise<Store<{}>> {
  return NodeCG.waitForReplicants(
    ...Object.keys(reps).map((key) => reps[key]),
  ).then(() => store);
}