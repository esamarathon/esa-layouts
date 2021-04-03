/* eslint-disable max-len */

import type { Bids, CapturePositions, Commentators, Countdown, CurrentRunDelay, DelayedTimer, DonationReader, DonationsToRead, DonationTotal, GameLayouts, MediaBox, MusicData, NameCycle, NotableDonations, ObsData, OtherStreamData, Prizes, StreamDeckData, TtsVoices, TwitchSubscribers, UpcomingRunID, VideoPlayer } from '@esa-layouts/types/schemas';
import type { Asset } from '@esamarathon/esa-layouts-shared/types';
import type { TwitchAPIData } from 'speedcontrol-util/schemas';
import { get as nodecg } from './nodecg';

/**
 * This is where you can declare all your replicant to import easily into other files,
 * and to make sure they have any correct settings on startup.
 */
export const assetsIntermissionSlides = nodecg().Replicant<Asset[]>('assets:intermission-slides');
export const assetsMediaBoxImages = nodecg().Replicant<Asset[]>('assets:media-box-images');
export const assetsMusic = nodecg().Replicant<Asset[]>('assets:music');
export const assetsVideos = nodecg().Replicant<Asset[]>('assets:videos');
export const bids = nodecg().Replicant<Bids>('bids', { persistent: false });
export const capturePositions = nodecg().Replicant<CapturePositions>('capturePositions');
export const commentators = nodecg().Replicant<Commentators>('commentators');
export const countdown = nodecg().Replicant<Countdown>('countdown');
export const currentRunDelay = nodecg().Replicant<CurrentRunDelay>('currentRunDelay');
export const delayedTimer = nodecg().Replicant<DelayedTimer>('delayedTimer');
export const donationReader = nodecg().Replicant<DonationReader>('donationReader');
export const donationsToRead = nodecg().Replicant<DonationsToRead>('donationsToRead', { persistent: false });
export const donationTotal = nodecg().Replicant<DonationTotal>('donationTotal');
export const gameLayouts = nodecg().Replicant<GameLayouts>('gameLayouts');
export const mediaBox = nodecg().Replicant<MediaBox>('mediaBox'); // try to remove and use esa-layout-shared only
export const musicData = nodecg().Replicant<MusicData>('musicData');
export const nameCycle = nodecg().Replicant<NameCycle>('nameCycle', { persistent: false });
export const notableDonations = nodecg().Replicant<NotableDonations>('notableDonations');
export const obsData = nodecg().Replicant<ObsData>('obsData', { persistent: false });
export const otherStreamData = nodecg().Replicant<OtherStreamData>('otherStreamData');
export const prizes = nodecg().Replicant<Prizes>('prizes', { persistent: false });
export const streamDeckData = nodecg().Replicant<StreamDeckData>('streamDeckData');
export const ttsVoices = nodecg().Replicant<TtsVoices>('ttsVoices');
export const twitchSubscribers = nodecg().Replicant<TwitchSubscribers>('twitchSubscribers');
export const upcomingRunID = nodecg().Replicant<UpcomingRunID>('upcomingRunID');
export const videoPlayer = nodecg().Replicant<VideoPlayer>('videoPlayer');

// nodecg-speedcontrol
export const twitchAPIData = nodecg().Replicant<TwitchAPIData>('twitchAPIData', 'nodecg-speedcontrol');
