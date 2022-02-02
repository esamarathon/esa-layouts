import type { Bids, BigbuttonPlayerMap, Commentators, Countdown, CurrentRunDelay, DonationReader, DonationsToRead, DonationTotal, DonationTotalMilestones, GameLayouts, ObsData, Omnibar, OtherStreamData, Prizes, ReaderIntroduction, ServerTimestamp, StreamDeckData, TtsVoices, UpcomingRunID, VideoPlayer } from '@esa-layouts/types/schemas';
import { Asset } from '@shared/types';
import clone from 'clone';
import type { ReplicantBrowser } from 'nodecg/types/browser';
import { SpeedcontrolUtilBrowser } from 'speedcontrol-util';
import { RunDataActiveRun, RunDataArray, Timer } from 'speedcontrol-util/types';
import { RunDataActiveRunSurrounding } from 'speedcontrol-util/types/speedcontrol/schemas';
import Vue from 'vue';
import type { Store } from 'vuex';
import { namespace } from 'vuex-class';
import { getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';

const sc = new SpeedcontrolUtilBrowser(nodecg);

// Declaring replicants.
export const reps: {
  assetsReaderIntroductionImages: ReplicantBrowser<Asset[]>;
  bids: ReplicantBrowser<Bids>;
  bigbuttonPlayerMap: ReplicantBrowser<BigbuttonPlayerMap>;
  commentators: ReplicantBrowser<Commentators>;
  countdown: ReplicantBrowser<Countdown>;
  currentRunDelay: ReplicantBrowser<CurrentRunDelay>;
  donationReader: ReplicantBrowser<DonationReader>;
  donationsToRead: ReplicantBrowser<DonationsToRead>;
  donationTotal: ReplicantBrowser<DonationTotal>;
  donationTotalMilestones: ReplicantBrowser<DonationTotalMilestones>;
  gameLayouts: ReplicantBrowser<GameLayouts>;
  obsData: ReplicantBrowser<ObsData>;
  omnibar: ReplicantBrowser<Omnibar>;
  otherStreamData: ReplicantBrowser<OtherStreamData>;
  prizes: ReplicantBrowser<Prizes>;
  readerIntroduction: ReplicantBrowser<ReaderIntroduction>;
  runDataActiveRun: ReplicantBrowser<RunDataActiveRun>;
  runDataActiveRunSurrounding: ReplicantBrowser<RunDataActiveRunSurrounding>;
  runDataArray: ReplicantBrowser<RunDataArray>;
  serverTimestamp: ReplicantBrowser<ServerTimestamp>;
  streamDeckData: ReplicantBrowser<StreamDeckData>;
  timer: ReplicantBrowser<Timer>;
  ttsVoices: ReplicantBrowser<TtsVoices>;
  upcomingRunID: ReplicantBrowser<UpcomingRunID>;
  videoPlayer: ReplicantBrowser<VideoPlayer>;
  [k: string]: ReplicantBrowser<unknown>;
} = {
  assetsReaderIntroductionImages: nodecg.Replicant('assets:reader-introduction-images'),
  bids: nodecg.Replicant('bids'),
  bigbuttonPlayerMap: nodecg.Replicant('bigbuttonPlayerMap'),
  commentators: nodecg.Replicant('commentators'),
  countdown: nodecg.Replicant('countdown'),
  currentRunDelay: nodecg.Replicant('currentRunDelay'),
  donationReader: nodecg.Replicant('donationReader'),
  donationsToRead: nodecg.Replicant('donationsToRead'),
  donationTotal: nodecg.Replicant('donationTotal'),
  donationTotalMilestones: nodecg.Replicant('donationTotalMilestones'),
  gameLayouts: nodecg.Replicant('gameLayouts'),
  obsData: nodecg.Replicant('obsData'),
  omnibar: nodecg.Replicant('omnibar'),
  otherStreamData: nodecg.Replicant('otherStreamData'),
  prizes: nodecg.Replicant('prizes'),
  readerIntroduction: nodecg.Replicant('readerIntroduction'),
  runDataActiveRun: sc.runDataActiveRun,
  runDataActiveRunSurrounding: sc.runDataActiveRunSurrounding,
  runDataArray: sc.runDataArray,
  serverTimestamp: nodecg.Replicant('serverTimestamp'),
  streamDeckData: nodecg.Replicant('streamDeckData'),
  timer: sc.timer,
  ttsVoices: nodecg.Replicant('ttsVoices'),
  upcomingRunID: nodecg.Replicant('upcomingRunID'),
  videoPlayer: nodecg.Replicant('videoPlayer'),
};

// All the replicant types.
export interface ReplicantTypes {
  assetsReaderIntroductionImages: Asset[];
  bids: Bids;
  bigbuttonPlayerMap: BigbuttonPlayerMap;
  commentators: Commentators;
  countdown: Countdown;
  currentRunDelay: CurrentRunDelay;
  donationReader: DonationReader;
  donationsToRead: DonationsToRead;
  donationTotal: DonationTotal;
  donationTotalMilestones: DonationTotalMilestones;
  gameLayouts: GameLayouts;
  obsData: ObsData;
  omnibar: Omnibar;
  otherStreamData: OtherStreamData;
  prizes: Prizes;
  readerIntroduction: ReaderIntroduction;
  runDataActiveRun: RunDataActiveRun;
  runDataActiveRunSurrounding: RunDataActiveRunSurrounding;
  runDataArray: RunDataArray;
  serverTimestamp: ServerTimestamp;
  streamDeckData: StreamDeckData;
  timer: Timer;
  ttsVoices: TtsVoices;
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
