import type NodeCGTypes from '@alvancamp/test-nodecg-types';
import type { Bids, Commentators, DonationReader, MediaBox, MusicData, Prizes, UpcomingRunID } from '@esa-layouts/types/schemas'; // eslint-disable-line object-curly-newline, max-len
import type { Tracker } from '@shared/types';
import clone from 'clone';
import { SpeedcontrolUtilBrowser } from 'speedcontrol-util';
import { RunData } from 'speedcontrol-util/types';
import type { RunDataArray, TwitchCommercialTimer } from 'speedcontrol-util/types/speedcontrol/schemas';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';

const sc = new SpeedcontrolUtilBrowser(nodecg as any); // Needs fixing in speedcontrol-util!
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
  intermissionSlides: NodeCGTypes.ClientReplicant<NodeCGTypes.AssetFile[]>;
  runDataArray: NodeCGTypes.ClientReplicant<RunDataArray>;
  twitchCommercialTimer: NodeCGTypes.ClientReplicant<TwitchCommercialTimer>;
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
  intermissionSlides: nodecg.Replicant('assets:intermission-slides'),
  runDataArray: sc.runDataArray as any, // Needs fixing in speedcontrol-util!
  twitchCommercialTimer: sc.twitchCommercialTimer as any, // Needs fixing in speedcontrol-util!
};

interface StateTypes {
  nextRuns: RunData[];
  currentBid?: Tracker.FormattedBid;
  currentPrize?: Tracker.FormattedPrize;
  currentMedia?: NodeCGTypes.AssetFile;
  upcomingRunID: UpcomingRunID;
  bids: Bids;
  prizes: Prizes;
  intermissionSlides: NodeCGTypes.AssetFile[];
}

export const store = new Vuex.Store({
  state: {
    nextRuns: [],
    upcomingRunID: null,
    bids: [],
    prizes: [],
    intermissionSlides: [],
  } as StateTypes,
  mutations: {
    setState(state, { name, val }): void {
      Vue.set(state, name, val);
    },
    setCurrentBid(state, bid?: Tracker.FormattedBid): void {
      Vue.set(state, 'currentBid', bid);
    },
    setCurrentPrize(state, prize?: Tracker.FormattedPrize): void {
      Vue.set(state, 'currentPrize', prize);
    },
    setCurrentMedia(state, media?: NodeCGTypes.AssetFile): void {
      Vue.set(state, 'currentMedia', media);
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
