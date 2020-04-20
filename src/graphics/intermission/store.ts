import clone from 'clone';
import type { ReplicantBrowser } from 'nodecg/types/browser';
import type { MusicPlayer, SponsorLogos } from 'schemas';
import type { Asset } from 'types';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';

Vue.use(Vuex);

// Replicants and their types
const reps: {
  musicPlayer: ReplicantBrowser<MusicPlayer>;
  sponsorLogoAssets: ReplicantBrowser<Asset[]>;
  sponsorLogos: ReplicantBrowser<SponsorLogos>;
  [k: string]: ReplicantBrowser<unknown>;
} = {
  musicPlayer: nodecg.Replicant('musicPlayer'),
  sponsorLogoAssets: nodecg.Replicant('assets:sponsor-logos'),
  sponsorLogos: nodecg.Replicant('sponsorLogos'),
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
