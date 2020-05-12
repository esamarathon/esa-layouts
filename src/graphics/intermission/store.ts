import clone from 'clone';
import type { ReplicantBrowser } from 'nodecg/types/browser';
import type { Bids, DonationReader, MusicPlayer, Prizes, SponsorLogos, UpcomingRunID } from 'schemas'; // eslint-disable-line object-curly-newline, max-len
import SpeedcontrolUtil from 'speedcontrol-util/browser';
import { RunDataActiveRun, RunDataArray, TwitchCommercialTimer } from 'speedcontrol-util/types';
import type { Asset } from 'types';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';

const sc = new SpeedcontrolUtil(nodecg);
Vue.use(Vuex);

// Replicants and their types
const reps: {
  upcomingRunID: ReplicantBrowser<UpcomingRunID>;
  musicPlayer: ReplicantBrowser<MusicPlayer>;
  donationReader: ReplicantBrowser<DonationReader>;
  sponsorLogoAssets: ReplicantBrowser<Asset[]>;
  sponsorLogos: ReplicantBrowser<SponsorLogos>;
  bids: ReplicantBrowser<Bids>;
  prizes: ReplicantBrowser<Prizes>;
  intermissionSlides: ReplicantBrowser<Asset[]>;
  runDataArray: ReplicantBrowser<RunDataArray>;
  runDataActiveRun: ReplicantBrowser<RunDataActiveRun>;
  twitchCommercialTimer: ReplicantBrowser<TwitchCommercialTimer>;
  [k: string]: ReplicantBrowser<unknown>;
} = {
  upcomingRunID: nodecg.Replicant('upcomingRunID'),
  musicPlayer: nodecg.Replicant('musicPlayer'),
  donationReader: nodecg.Replicant('donationReader'),
  sponsorLogoAssets: nodecg.Replicant('assets:sponsor-logos'),
  sponsorLogos: nodecg.Replicant('sponsorLogos'),
  bids: nodecg.Replicant('bids'),
  prizes: nodecg.Replicant('prizes'),
  intermissionSlides: nodecg.Replicant('assets:intermission-slides'),
  runDataArray: sc.runDataArray,
  runDataActiveRun: sc.runDataActiveRun,
  twitchCommercialTimer: sc.twitchCommercialTimer,
};

const store = new Vuex.Store({
  state: {},
  mutations: {
    setState(state, { name, val }): void {
      Vue.set(state, name, val);
    },
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
