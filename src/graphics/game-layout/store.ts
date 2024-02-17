import type { Bids, Commentators, CommentatorsNew, CurrentRunDelay, DelayedTimer, DonationReader, DonationReaderNew, GameLayouts, MediaBox, NameCycle, NotableDonations, Prizes, TaskmasterTimestamps } from '@esa-layouts/types/schemas'; // eslint-disable-line object-curly-newline, max-len
import type NodeCGTypes from '@nodecg/types';
import clone from 'clone';
import { SpeedcontrolUtilBrowser } from 'speedcontrol-util';
import type { RunDataActiveRun, Timer } from 'speedcontrol-util/types';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';

const sc = new SpeedcontrolUtilBrowser(nodecg);
Vue.use(Vuex);

// Replicants and their types
const reps: {
  bids: NodeCGTypes.ClientReplicant<Bids>;
  commentators: NodeCGTypes.ClientReplicant<Commentators>;
  commentatorsNew: NodeCGTypes.ClientReplicant<CommentatorsNew>;
  currentRunDelay: NodeCGTypes.ClientReplicant<CurrentRunDelay>;
  delayedTimer: NodeCGTypes.ClientReplicant<DelayedTimer>;
  donationReader: NodeCGTypes.ClientReplicant<DonationReader>;
  donationReaderNew: NodeCGTypes.ClientReplicant<DonationReaderNew>;
  gameLayouts: NodeCGTypes.ClientReplicant<GameLayouts>;
  mediaBox: NodeCGTypes.ClientReplicant<MediaBox>;
  mediaBoxImages: NodeCGTypes.ClientReplicant<NodeCGTypes.AssetFile[]>;
  nameCycle: NodeCGTypes.ClientReplicant<NameCycle>;
  notableDonations: NodeCGTypes.ClientReplicant<NotableDonations>;
  prizes: NodeCGTypes.ClientReplicant<Prizes>;
  runDataActiveRun: NodeCGTypes.ClientReplicant<RunDataActiveRun>;
  taskmasterTimestamps: NodeCGTypes.ClientReplicant<TaskmasterTimestamps>;
  timer: NodeCGTypes.ClientReplicant<Timer>;
  [k: string]: NodeCGTypes.ClientReplicant<unknown>;
} = {
  bids: nodecg.Replicant('bids'),
  commentators: nodecg.Replicant('commentators'),
  commentatorsNew: nodecg.Replicant('commentatorsNew'),
  currentRunDelay: nodecg.Replicant('currentRunDelay'),
  delayedTimer: nodecg.Replicant('delayedTimer'),
  donationReader: nodecg.Replicant('donationReader'),
  donationReaderNew: nodecg.Replicant('donationReaderNew'),
  gameLayouts: nodecg.Replicant('gameLayouts'),
  mediaBox: nodecg.Replicant('mediaBox'),
  mediaBoxImages: nodecg.Replicant('assets:media-box-images'),
  nameCycle: nodecg.Replicant('nameCycle'),
  notableDonations: nodecg.Replicant('notableDonations'),
  prizes: nodecg.Replicant('prizes'),
  runDataActiveRun: sc.runDataActiveRun,
  taskmasterTimestamps: nodecg.Replicant('taskmasterTimestamps'),
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
