// eslint-disable-next-line max-len, object-curly-newline
import { Bids, Commentators, CurrentSponsorLogo, DonationsToRead, DonationTotal, NotableDonations, OtherStreamData, Prizes, SponsorLogoRotation } from 'schemas';
import { TwitchAPIData } from '../../../../nodecg-speedcontrol/schemas';
import { get as nodecg } from './nodecg';

const rep = nodecg().Replicant;
const noPer = { persistent: false };
const sc = 'nodecg-speedcontrol';

export const currentOBSScene = rep<string>('currentOBSScene');
export const currentLayout = rep<string>('currentLayout');
export const currentLayoutOverridden = rep<boolean>('currentLayoutOverridden');
export const commentators = rep<Commentators>('commentators');
export const currentSponsorLogo = rep<CurrentSponsorLogo>('currentSponsorLogo', noPer);
export const otherStreamData = rep<OtherStreamData>('otherStreamData');
export const songData = rep('songData', noPer);
export const sponsorLogoRotation = rep<SponsorLogoRotation>('sponsorLogoRotation');
export const donationsToRead = rep<DonationsToRead>('donationsToRead', noPer);
export const bids = rep<Bids>('bids', noPer);
export const prizes = rep<Prizes>('prizes', noPer);
export const donationTotal = rep<DonationTotal>('donationTotal');
export const notableDonations = rep<NotableDonations>('notableDonations');
export const ttsVoices = rep<any[]>('ttsVoices', { defaultValue: [] });
export const ttsChosenVoice = rep<string>('ttsChosenVoice');
export const assetsVideos = rep<any[]>('assets:videos');
export const currentVideoSum = rep<string | undefined>('currentVideoSum');
export const currentVideoObj = rep<object | undefined>('currentVideoObj');

// nodecg-speedcontrol
export const twitchAPIData = rep<TwitchAPIData>('twitchAPIData', sc);
