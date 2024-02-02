import type { Bids, Commentators, DonationReader, IntermissionSlides, MediaBox, MusicData, Prizes, UpcomingRunID } from '@esa-layouts/types/schemas'; // eslint-disable-line object-curly-newline, max-len
import type NodeCGTypes from '@nodecg/types';
import clone from 'clone';
import { SpeedcontrolUtilBrowser } from 'speedcontrol-util';
import { RunData } from 'speedcontrol-util/types';
import type { RunDataArray, TwitchCommercialTimer } from 'speedcontrol-util/types/schemas';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';

const sc = new SpeedcontrolUtilBrowser(nodecg);
Vue.use(Vuex);

// Replicants and their types
const reps: {
  upcomingRunID: NodeCGTypes.ClientReplicant<UpcomingRunID>;
  musicData: NodeCGTypes.ClientReplicant<MusicData>;
  donationReader: NodeCGTypes.ClientReplicant<DonationReader>;
  mediaBoxImages: NodeCGTypes.ClientReplicant<NodeCGTypes.AssetFile[]>;
  mediaBox: NodeCGTypes.ClientReplicant<MediaBox>;
  bids: NodeCGTypes.ClientReplicant<Bids>;
  prizes: NodeCGTypes.ClientReplicant<Prizes>;
  commentators: NodeCGTypes.ClientReplicant<Commentators>;
  assetsIntermissionSlides: NodeCGTypes.ClientReplicant<NodeCGTypes.AssetFile[]>;
  runDataArray: NodeCGTypes.ClientReplicant<RunDataArray>;
  twitchCommercialTimer: NodeCGTypes.ClientReplicant<TwitchCommercialTimer>;
  intermissionSlides: NodeCGTypes.ClientReplicant<IntermissionSlides>;
  [k: string]: NodeCGTypes.ClientReplicant<unknown>;
} = {
  upcomingRunID: nodecg.Replicant('upcomingRunID'),
  musicData: nodecg.Replicant('musicData'),
  donationReader: nodecg.Replicant('donationReader'),
  mediaBoxImages: nodecg.Replicant('assets:media-box-images'),
  mediaBox: nodecg.Replicant('mediaBox'),
  bids: nodecg.Replicant('bids'),
  prizes: nodecg.Replicant('prizes'),
  commentators: nodecg.Replicant('commentators'),
  assetsIntermissionSlides: nodecg.Replicant('assets:intermission-slides'),
  runDataArray: sc.runDataArray,
  twitchCommercialTimer: sc.twitchCommercialTimer,
  intermissionSlides: nodecg.Replicant('intermissionSlides'),
};

interface StateTypes {
  nextRuns: RunData[];
  upcomingRunID: UpcomingRunID;
  bids: Bids;
  prizes: Prizes;
  assetsIntermissionSlides: NodeCGTypes.AssetFile[];
}

export const store = new Vuex.Store({
  state: {
    nextRuns: [],
    upcomingRunID: null,
    bids: [],
    prizes: [],
    assetsIntermissionSlides: [],
  } as StateTypes,
  mutations: {
    setState(state, { name, val }): void {
      Vue.set(state, name, val);
    },
    setNextRuns(state, runs: RunData[]): void {
      Vue.set(state, 'nextRuns', runs);
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
