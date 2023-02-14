/* eslint-disable max-len */

import type NodeCGTypes from '@alvancamp/test-nodecg-types';
import { Bids, BigbuttonPlayerMap, CapturePositions, Commentators, Countdown, CurrentRunDelay, DelayedTimer, DonationReader, DonationsToRead, DonationTotal, DonationTotalMilestones, GameLayouts, IntermissionSlides, MusicData, NameCycle, NotableDonations, ObsData, Omnibar, OtherStreamData, Prizes, ReaderIntroduction, ServerTimestamp, StreamDeckData, TtsVoices, UpcomingRunID, VideoPlayer } from '@esa-layouts/types/schemas';
import { HoraroImportStatus, OengusImportStatus, TwitchAPIData, TwitchChannelInfo } from 'speedcontrol-util/types/schemas';
import { get as nodecg } from './nodecg';

/**
 * This is where you can declare all your replicant to import easily into other files,
 * and to make sure they have any correct settings on startup.
 */
export const assetsIntermissionSlides = nodecg().Replicant<NodeCGTypes.AssetFile[]>('assets:intermission-slides');
export const assetsMediaBoxImages = nodecg().Replicant<NodeCGTypes.AssetFile[]>('assets:media-box-images');
export const assetsReaderIntroductionImages = nodecg().Replicant<NodeCGTypes.AssetFile[]>('assets:reader-introduction-images');
export const assetsVideos = nodecg().Replicant<NodeCGTypes.AssetFile[]>('assets:videos');
export const bids = nodecg().Replicant<Bids>('bids', { persistent: false }) as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<Bids>;
export const bigbuttonPlayerMap = nodecg().Replicant<BigbuttonPlayerMap>('bigbuttonPlayerMap');
export const capturePositions = nodecg().Replicant<CapturePositions>('capturePositions');
export const commentators = nodecg().Replicant<Commentators>('commentators');
export const countdown = nodecg().Replicant<Countdown>('countdown');
export const currentRunDelay = nodecg().Replicant<CurrentRunDelay>('currentRunDelay');
export const delayedTimer = nodecg().Replicant<DelayedTimer>('delayedTimer');
export const donationReader = nodecg().Replicant<DonationReader>('donationReader');
export const donationsToRead = nodecg().Replicant<DonationsToRead>('donationsToRead', { persistent: false }) as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<DonationsToRead>;
export const donationTotal = nodecg().Replicant<DonationTotal>('donationTotal');
export const donationTotalMilestones = nodecg().Replicant<DonationTotalMilestones>('donationTotalMilestones');
export const gameLayouts = nodecg().Replicant<GameLayouts>('gameLayouts');
export const horaroImportStatus = nodecg().Replicant<HoraroImportStatus>('horaroImportStatus', 'nodecg-speedcontrol');
export const intermissionSlides = nodecg().Replicant<IntermissionSlides>('intermissionSlides');
export const musicData = nodecg().Replicant<MusicData>('musicData');
export const nameCycle = nodecg().Replicant<NameCycle>('nameCycle', { persistent: false }) as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<NameCycle>;
export const notableDonations = nodecg().Replicant<NotableDonations>('notableDonations');
export const obsData = nodecg().Replicant<ObsData>('obsData', { persistent: false }) as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<ObsData>;
export const oengusImportStatus = nodecg().Replicant<OengusImportStatus>('oengusImportStatus', 'nodecg-speedcontrol');
export const omnibar = nodecg().Replicant<Omnibar>('omnibar');
export const otherStreamData = nodecg().Replicant<OtherStreamData>('otherStreamData');
export const prizes = nodecg().Replicant<Prizes>('prizes', { persistent: false }) as unknown as NodeCGTypes.ServerReplicantWithSchemaDefault<Prizes>;
export const readerIntroduction = nodecg().Replicant<ReaderIntroduction>('readerIntroduction');
export const serverTimestamp = nodecg().Replicant<ServerTimestamp>('serverTimestamp');
export const streamDeckData = nodecg().Replicant<StreamDeckData>('streamDeckData');
export const ttsVoices = nodecg().Replicant<TtsVoices>('ttsVoices');
export const twitchAPIData = nodecg().Replicant<TwitchAPIData>('twitchAPIData', 'nodecg-speedcontrol');
export const twitchChannelInfo = nodecg().Replicant<TwitchChannelInfo>('twitchChannelInfo', 'nodecg-speedcontrol');
export const upcomingRunID = nodecg().Replicant<UpcomingRunID>('upcomingRunID');
export const videoPlayer = nodecg().Replicant<VideoPlayer>('videoPlayer');
