import needle from 'needle';
import { get as nodecg } from './util/nodecg';
import { donationTotal } from './util/replicants';

const config = nodecg().bundleConfig;

async function updateDonationTotalFromAPI(init = false): Promise<void> {
  try {
    let total = 0;
    const resp = await needle('get', config.streamlabsCharity.apiUrl);
    if (resp.statusCode === 200) {
      total = resp.body.amount_raised / 100;
    }
    if (init || donationTotal.value < total) {
      nodecg().log.info('[Streamlabs Charity] API donation total changed: $%s', total);
      donationTotal.value = total;
    }
  } catch (err) {
    nodecg().log.warn('[Streamlabs Charity] Error updating donation total from API');
    nodecg().log.debug('[Streamlabs Charity] Error updating donation total from API:', err);
  }
}

async function setup(): Promise<void> {
  nodecg().log.info('[Streamlabs Charity] Setting up');

  // Get initial total from API and set an interval.
  updateDonationTotalFromAPI(true);
  setInterval(updateDonationTotalFromAPI, 10 * 1000);
}

if (config.streamlabsCharity.enabled) {
  setup();
}
