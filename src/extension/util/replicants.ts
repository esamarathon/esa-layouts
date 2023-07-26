/* eslint-disable max-len */

import { Bids, BigbuttonPlayerMap, CapturePositions, Commentators, Countdown, CurrentRunDelay, DelayedTimer, DonationReader, DonationsToRead, DonationTotal, DonationTotalMilestones, GameLayouts, IntermissionSlides, MusicData, NameCycle, NotableDonations, ObsData, Omnibar, OtherStreamData, Prizes, ReaderIntroduction, ServerTimestamp, StreamDeckData, TaskmasterTimestamps, TtsVoices, UpcomingRunID, VideoPlayer } from '@esa-layouts/types/schemas';
import type NodeCGTypes from '@nodecg/types';
import { HoraroImportStatus, OengusImportStatus, TwitchAPIData, TwitchChannelInfo } from 'speedcontrol-util/types/schemas';
import { get as nodecg } from './nodecg';

/**
 * This is where you can declare all your replicant to import easily into other files,
 * and to make sure they have any correct settings on startup.
 */
export const assetsIntermissionSlides = nodecg().Replicant<NodeCGTypes.AssetFile[]>('assets:intermission-slides') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<NodeCGTypes.AssetFile[]>;
export const assetsMediaBoxImages = nodecg().Replicant<NodeCGTypes.AssetFile[]>('assets:media-box-images') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<NodeCGTypes.AssetFile[]>;
export const assetsReaderIntroductionImages = nodecg().Replicant<NodeCGTypes.AssetFile[]>('assets:reader-introduction-images') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<NodeCGTypes.AssetFile[]>;
export const assetsVideos = nodecg().Replicant<NodeCGTypes.AssetFile[]>('assets:videos') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<NodeCGTypes.AssetFile[]>;
export const bids = nodecg().Replicant<Bids>('bids', { persistent: false }) as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<Bids>;
export const bigbuttonPlayerMap = nodecg().Replicant<BigbuttonPlayerMap>('bigbuttonPlayerMap') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<BigbuttonPlayerMap>;
export const capturePositions = nodecg().Replicant<CapturePositions>('capturePositions') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<CapturePositions>;
export const commentators = nodecg().Replicant<Commentators>('commentators') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<Commentators>;
export const countdown = nodecg().Replicant<Countdown>('countdown') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<Countdown>;
export const currentRunDelay = nodecg().Replicant<CurrentRunDelay>('currentRunDelay') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<CurrentRunDelay>;
export const delayedTimer = nodecg().Replicant<DelayedTimer>('delayedTimer') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<DelayedTimer>;
export const donationReader = nodecg().Replicant<DonationReader>('donationReader') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<DonationReader>;
export const donationsToRead = nodecg().Replicant<DonationsToRead>('donationsToRead', { persistent: false }) as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<DonationsToRead>;
export const donationTotal = nodecg().Replicant<DonationTotal>('donationTotal') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<DonationTotal>;
export const donationTotalMilestones = nodecg().Replicant<DonationTotalMilestones>('donationTotalMilestones') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<DonationTotalMilestones>;
export const gameLayouts = nodecg().Replicant<GameLayouts>('gameLayouts') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<GameLayouts>;
export const horaroImportStatus = nodecg().Replicant<HoraroImportStatus>('horaroImportStatus', 'nodecg-speedcontrol') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<HoraroImportStatus>;
export const intermissionSlides = nodecg().Replicant<IntermissionSlides>('intermissionSlides') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<IntermissionSlides>;
export const musicData = nodecg().Replicant<MusicData>('musicData') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<MusicData>;
export const nameCycle = nodecg().Replicant<NameCycle>('nameCycle', { persistent: false }) as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<NameCycle>;
export const notableDonations = nodecg().Replicant<NotableDonations>('notableDonations') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<NotableDonations>;
export const obsData = nodecg().Replicant<ObsData>('obsData', { persistent: false }) as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<ObsData>;
export const oengusImportStatus = nodecg().Replicant<OengusImportStatus>('oengusImportStatus', 'nodecg-speedcontrol') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<OengusImportStatus>;
export const omnibar = nodecg().Replicant<Omnibar>('omnibar') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<Omnibar>;
export const otherStreamData = nodecg().Replicant<OtherStreamData>('otherStreamData') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<OtherStreamData>;
export const prizes = nodecg().Replicant<Prizes>('prizes', { persistent: false }) as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<Prizes>;
export const readerIntroduction = nodecg().Replicant<ReaderIntroduction>('readerIntroduction') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<ReaderIntroduction>;
export const serverTimestamp = nodecg().Replicant<ServerTimestamp>('serverTimestamp') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<ServerTimestamp>;
export const streamDeckData = nodecg().Replicant<StreamDeckData>('streamDeckData') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<StreamDeckData>;
export const taskmasterTimestamps = nodecg().Replicant<TaskmasterTimestamps>('taskmasterTimestamps') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<TaskmasterTimestamps>;
export const ttsVoices = nodecg().Replicant<TtsVoices>('ttsVoices') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<TtsVoices>;
export const twitchAPIData = nodecg().Replicant<TwitchAPIData>('twitchAPIData', 'nodecg-speedcontrol') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<TwitchAPIData>;
export const twitchChannelInfo = nodecg().Replicant<TwitchChannelInfo>('twitchChannelInfo', 'nodecg-speedcontrol') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<TwitchChannelInfo>;
export const upcomingRunID = nodecg().Replicant<UpcomingRunID>('upcomingRunID') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<UpcomingRunID>;
export const videoPlayer = nodecg().Replicant<VideoPlayer>('videoPlayer') as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<VideoPlayer>;
