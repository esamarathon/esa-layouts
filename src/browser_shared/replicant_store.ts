import type { Bids, Commentators, Countdown, CurrentRunDelay, DonationReader, DonationsToRead, DonationTotal, DonationTotalMilestones, GameLayouts, ObsData, OmnibarPin, ServerTimestamp, StreamDeckData, UpcomingRunID, VideoPlayer } from '@esa-layouts/types/schemas';
import clone from 'clone';
import type { ReplicantBrowser } from 'nodecg/types/browser';
import { RunDataArray } from 'speedcontrol-util/types';
import Vue from 'vue';
import type { Store } from 'vuex';
import { namespace } from 'vuex-class';
import { getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';

// Declaring replicants.
export const reps: {
  bids: ReplicantBrowser<Bids>;
  commentators: ReplicantBrowser<Commentators>;
  countdown: ReplicantBrowser<Countdown>;
  currentRunDelay: ReplicantBrowser<CurrentRunDelay>;
  donationReader: ReplicantBrowser<DonationReader>;
  donationsToRead: ReplicantBrowser<DonationsToRead>;
  donationTotal: ReplicantBrowser<DonationTotal>;
  donationTotalMilestones: ReplicantBrowser<DonationTotalMilestones>;
  gameLayouts: ReplicantBrowser<GameLayouts>;
  obsData: ReplicantBrowser<ObsData>;
  omnibarPin: ReplicantBrowser<OmnibarPin>;
  runDataArray: ReplicantBrowser<RunDataArray>;
  serverTimestamp: ReplicantBrowser<ServerTimestamp>;
  streamDeckData: ReplicantBrowser<StreamDeckData>;
  upcomingRunID: ReplicantBrowser<UpcomingRunID>;
  videoPlayer: ReplicantBrowser<VideoPlayer>;
  [k: string]: ReplicantBrowser<unknown>;
} = {
  bids: nodecg.Replicant('bids'),
  commentators: nodecg.Replicant('commentators'),
  countdown: nodecg.Replicant('countdown'),
  currentRunDelay: nodecg.Replicant('currentRunDelay'),
  donationReader: nodecg.Replicant('donationReader'),
  donationsToRead: nodecg.Replicant('donationsToRead'),
  donationTotal: nodecg.Replicant('donationTotal'),
  donationTotalMilestones: nodecg.Replicant('donationTotalMilestones'),
  gameLayouts: nodecg.Replicant('gameLayouts'),
  obsData: nodecg.Replicant('obsData'),
  omnibarPin: nodecg.Replicant('omnibarPin'),
  runDataArray: nodecg.Replicant('runDataArray', 'nodecg-speedcontrol'),
  serverTimestamp: nodecg.Replicant('serverTimestamp'),
  streamDeckData: nodecg.Replicant('streamDeckData'),
  upcomingRunID: nodecg.Replicant('upcomingRunID'),
  videoPlayer: nodecg.Replicant('videoPlayer'),
};

// All the replicant types.
export interface ReplicantTypes {
  bids: Bids;
  commentators: Commentators;
  countdown: Countdown;
  currentRunDelay: CurrentRunDelay;
  donationReader: DonationReader;
  donationsToRead: DonationsToRead;
  donationTotal: DonationTotal;
  donationTotalMilestones: DonationTotalMilestones;
  gameLayouts: GameLayouts;
  obsData: ObsData;
  omnibarPin: OmnibarPin;
  runDataArray: RunDataArray;
  serverTimestamp: ServerTimestamp;
  streamDeckData: StreamDeckData;
  upcomingRunID: UpcomingRunID;
  videoPlayer: VideoPlayer;
}

@Module({ name: 'ReplicantModule', namespaced: true })
export class ReplicantModule extends VuexModule {
  // Replicant values are stored here.
  reps: { [k: string]: unknown } = {};

  get repsTyped(): ReplicantTypes {
    return this.reps as unknown as ReplicantTypes;
  }

  // This sets the state object above when a replicant sends an update.
  @Mutation
  setState({ name, val }: { name: string, val: unknown }): void {
    Vue.set(this.reps, name, clone(val));
  }

  // This is a generic mutation to update a named replicant.
  @Mutation
  setReplicant<K>({ name, val }: { name: string, val: K }): void {
    Vue.set(this.reps, name, clone(val)); // Also update local copy, although no schema validation!
    reps[name].value = clone(val);
  }
}

// eslint-disable-next-line import/no-mutable-exports
export let replicantModule!: ReplicantModule;
export const replicantNS = namespace('ReplicantModule');

export async function setUpReplicants(store: Store<unknown>): Promise<void> {
  // Listens for each declared replicants "change" event, and updates the state.
  Object.keys(reps).forEach((name) => {
    reps[name].on('change', (val) => {
      store.commit('ReplicantModule/setState', { name, val });
    });
  });
  // We should make sure the replicant are ready to be read, needs to be done in browser context.
  await NodeCG.waitForReplicants(...Object.keys(reps).map((key) => reps[key]));
  replicantModule = getModule(ReplicantModule, store);
}
