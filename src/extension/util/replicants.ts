/* eslint-disable max-len */

import { Bids, Commentators, CurrentLayout, CurrentLayoutOverridden, CurrentSponsorLogo, CurrentVideoSum, DonationsToRead, DonationTotal, Layouts, NotableDonations, OtherStreamData, Prizes, SongData, SponsorLogoRotation, TtsVoices } from 'schemas'; // eslint-disable-line object-curly-newline
import { Asset } from 'types';
import { TwitchAPIData } from '../../../../nodecg-speedcontrol/schemas';
import { get as nodecg } from './nodecg';

export const assetsVideos = nodecg().Replicant<Asset[]>('assets:videos');
export const bids = nodecg().Replicant<Bids>('bids', { persistent: false });
export const commentators = nodecg().Replicant<Commentators>('commentators');
export const currentLayout = nodecg().Replicant<CurrentLayout>('currentLayout'); // DONE (?)
export const currentLayoutOverridden = nodecg().Replicant<CurrentLayoutOverridden>('currentLayoutOverridden'); // DONE (?)
export const currentOBSScene = nodecg().Replicant<string>('currentOBSScene'); // TODO
export const currentSponsorLogo = nodecg().Replicant<CurrentSponsorLogo>('currentSponsorLogo', { persistent: false }); // TODO
export const currentVideoObj = nodecg().Replicant<object | undefined>('currentVideoObj'); // TODO
export const currentVideoSum = nodecg().Replicant<CurrentVideoSum>('currentVideoSum'); // DONE (?)
export const donationsToRead = nodecg().Replicant<DonationsToRead>('donationsToRead', { persistent: false });
export const donationTotal = nodecg().Replicant<DonationTotal>('donationTotal');
export const layouts = nodecg().Replicant<Layouts>('layouts'); // DONE (?)
export const notableDonations = nodecg().Replicant<NotableDonations>('notableDonations'); // TODO
export const otherStreamData = nodecg().Replicant<OtherStreamData>('otherStreamData');
export const prizes = nodecg().Replicant<Prizes>('prizes', { persistent: false });
export const songData = nodecg().Replicant<SongData>('songData', { persistent: false }); // DONE (?)
export const sponsorLogoRotation = nodecg().Replicant<SponsorLogoRotation>('sponsorLogoRotation'); // TODO
export const ttsVoices = nodecg().Replicant<TtsVoices>('ttsVoices');

// nodecg-speedcontrol
export const twitchAPIData = nodecg().Replicant<TwitchAPIData>('twitchAPIData', 'nodecg-speedcontrol');
