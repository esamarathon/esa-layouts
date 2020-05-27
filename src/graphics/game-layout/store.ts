import clone from 'clone';
import type { ReplicantBrowser } from 'nodecg/types/browser';
import type { Commentators, DonationReader, GameLayouts, MediaBox, NameCycle, NotableDonations, Prizes } from 'schemas'; // eslint-disable-line object-curly-newline, max-len
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
  mediaBoxImages: ReplicantBrowser<Asset[]>;
  mediaBox: ReplicantBrowser<MediaBox>;
  commentators: ReplicantBrowser<Commentators>;
  donationReader: ReplicantBrowser<DonationReader>;
  nameCycle: ReplicantBrowser<NameCycle>;
  notableDonations: ReplicantBrowser<NotableDonations>;
  prizes: ReplicantBrowser<Prizes>;
  timer: ReplicantBrowser<Timer>;
  runDataActiveRun: ReplicantBrowser<RunDataActiveRun>;
  [k: string]: ReplicantBrowser<unknown>;
} = {
  gameLayouts: nodecg.Replicant('gameLayouts'),
  mediaBoxImages: nodecg.Replicant('assets:media-box-images'),
  mediaBox: nodecg.Replicant('mediaBox'),
  commentators: nodecg.Replicant('commentators'),
  donationReader: nodecg.Replicant('donationReader'),
  nameCycle: nodecg.Replicant('nameCycle'),
  notableDonations: nodecg.Replicant('notableDonations'),
  prizes: nodecg.Replicant('prizes'),
  timer: sc.timer,
  runDataActiveRun: sc.runDataActiveRun,
};

interface StateTypes {
  coop: boolean;
  runDataActiveRun: RunDataActiveRun;
}

// Types for mutations below
export type UpdateSelected = (code?: string) => void;
export type UpdateList = (list: GameLayouts['available']) => void;
export type ClearList = () => void;

const store = new Vuex.Store({
  state: {
    coop: false,
  } as StateTypes,
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
    updateCoop(state, coop): void {
      Vue.set(state, 'coop', coop);
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
