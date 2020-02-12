/* eslint-disable max-len */

import { Bids, Commentators, CurrentLayout, CurrentLayoutOverridden, DonationsToRead, DonationTotal, Layouts, NotableDonations, ObsData, OtherStreamData, Prizes, SongData, SponsorLogos, TtsVoices, VideoPlayer } from 'schemas'; // eslint-disable-line object-curly-newline
import { Asset } from 'types';
import { TwitchAPIData } from '../../../../nodecg-speedcontrol/schemas';
import { get as nodecg } from './nodecg';

export const assetsIntermissionSlides = nodecg().Replicant<Asset[]>('assets:intermission-slides');
export const assetsSponsorLogos = nodecg().Replicant<Asset[]>('assets:sponsor-logos');
export const assetsVideos = nodecg().Replicant<Asset[]>('assets:videos');
export const bids = nodecg().Replicant<Bids>('bids', { persistent: false });
export const commentators = nodecg().Replicant<Commentators>('commentators');
export const currentLayout = nodecg().Replicant<CurrentLayout>('currentLayout'); // DONE (?)
export const currentLayoutOverridden = nodecg().Replicant<CurrentLayoutOverridden>('currentLayoutOverridden'); // DONE (?)
export const donationsToRead = nodecg().Replicant<DonationsToRead>('donationsToRead', { persistent: false });
export const donationTotal = nodecg().Replicant<DonationTotal>('donationTotal');
export const layouts = nodecg().Replicant<Layouts>('layouts'); // DONE (?)
export const notableDonations = nodecg().Replicant<NotableDonations>('notableDonations');
export const obsData = nodecg().Replicant<ObsData>('obsData', { persistent: false });
export const otherStreamData = nodecg().Replicant<OtherStreamData>('otherStreamData');
export const prizes = nodecg().Replicant<Prizes>('prizes', { persistent: false });
export const songData = nodecg().Replicant<SongData>('songData', { persistent: false }); // DONE (?)
export const sponsorLogos = nodecg().Replicant<SponsorLogos>('sponsorLogos');
export const ttsVoices = nodecg().Replicant<TtsVoices>('ttsVoices');
export const videoPlayer = nodecg().Replicant<VideoPlayer>('videoPlayer');

// nodecg-speedcontrol
export const twitchAPIData = nodecg().Replicant<TwitchAPIData>('twitchAPIData', 'nodecg-speedcontrol');
