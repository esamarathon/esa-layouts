import type { Commentators, CurrentRunDelay, DelayedTimer, DonationReader, GameLayouts, MediaBox, NameCycle, NotableDonations, Prizes } from '@/types/schemas'; // eslint-disable-line object-curly-newline, max-len
import type { Asset } from '@esamarathon/esa-layouts-shared/types';
import clone from 'clone';
import type { ReplicantBrowser } from 'nodecg/types/browser';
import { SpeedcontrolUtilBrowser } from 'speedcontrol-util';
import type { RunDataActiveRun, Timer } from 'speedcontrol-util/types';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';

const sc = new SpeedcontrolUtilBrowser(nodecg);
Vue.use(Vuex);

// Replicants and their types
const reps: {
  commentators: ReplicantBrowser<Commentators>;
  currentRunDelay: ReplicantBrowser<CurrentRunDelay>;
  delayedTimer: ReplicantBrowser<DelayedTimer>;
  donationReader: ReplicantBrowser<DonationReader>;
  gameLayouts: ReplicantBrowser<GameLayouts>;
  mediaBox: ReplicantBrowser<MediaBox>;
  mediaBoxImages: ReplicantBrowser<Asset[]>;
  nameCycle: ReplicantBrowser<NameCycle>;
  notableDonations: ReplicantBrowser<NotableDonations>;
  prizes: ReplicantBrowser<Prizes>;
  runDataActiveRun: ReplicantBrowser<RunDataActiveRun>;
  timer: ReplicantBrowser<Timer>;
  [k: string]: ReplicantBrowser<unknown>;
} = {
  commentators: nodecg.Replicant('commentators'),
  currentRunDelay: nodecg.Replicant('currentRunDelay'),
  delayedTimer: nodecg.Replicant('delayedTimer'),
  donationReader: nodecg.Replicant('donationReader'),
  gameLayouts: nodecg.Replicant('gameLayouts'),
  mediaBox: nodecg.Replicant('mediaBox'),
  mediaBoxImages: nodecg.Replicant('assets:media-box-images'),
  nameCycle: nodecg.Replicant('nameCycle'),
  notableDonations: nodecg.Replicant('notableDonations'),
  prizes: nodecg.Replicant('prizes'),
  runDataActiveRun: sc.runDataActiveRun,
  timer: sc.timer,
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

export default async (): Promise<Store<StateTypes>> => {
  await NodeCG.waitForReplicants(...Object.keys(reps).map((key) => reps[key]));
  return store;
};
