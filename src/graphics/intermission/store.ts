import type { Bids, DonationReader, MediaBox, MusicData, Prizes, UpcomingRunID } from '@/types/schemas'; // eslint-disable-line object-curly-newline, max-len
import type { Asset, Tracker } from '@esamarathon/esa-layouts-shared/types';
import clone from 'clone';
import type { ReplicantBrowser } from 'nodecg/types/browser';
import { SpeedcontrolUtilBrowser } from 'speedcontrol-util';
import type { RunDataArray, TwitchCommercialTimer } from 'speedcontrol-util/schemas';
import { RunData } from 'speedcontrol-util/types';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';

const sc = new SpeedcontrolUtilBrowser(nodecg);
Vue.use(Vuex);

// Replicants and their types
const reps: {
  upcomingRunID: ReplicantBrowser<UpcomingRunID>;
  musicData: ReplicantBrowser<MusicData>;
  donationReader: ReplicantBrowser<DonationReader>;
  mediaBoxImages: ReplicantBrowser<Asset[]>;
  mediaBox: ReplicantBrowser<MediaBox>;
  bids: ReplicantBrowser<Bids>;
  prizes: ReplicantBrowser<Prizes>;
  intermissionSlides: ReplicantBrowser<Asset[]>;
  runDataArray: ReplicantBrowser<RunDataArray>;
  twitchCommercialTimer: ReplicantBrowser<TwitchCommercialTimer>;
  [k: string]: ReplicantBrowser<unknown>;
} = {
  upcomingRunID: nodecg.Replicant('upcomingRunID'),
  musicData: nodecg.Replicant('musicData'),
  donationReader: nodecg.Replicant('donationReader'),
  mediaBoxImages: nodecg.Replicant('assets:media-box-images'),
  mediaBox: nodecg.Replicant('mediaBox'),
  bids: nodecg.Replicant('bids'),
  prizes: nodecg.Replicant('prizes'),
  intermissionSlides: nodecg.Replicant('assets:intermission-slides'),
  runDataArray: sc.runDataArray,
  twitchCommercialTimer: sc.twitchCommercialTimer,
};

interface StateTypes {
  nextRuns: RunData[];
  currentBid?: Tracker.FormattedBid;
  currentPrize?: Tracker.FormattedPrize;
  currentMedia?: Asset;
  upcomingRunID: UpcomingRunID;
  bids: Bids;
  prizes: Prizes;
  intermissionSlides: Asset[];
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
    setCurrentMedia(state, media?: Asset): void {
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
