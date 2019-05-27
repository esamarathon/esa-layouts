import cheerio from 'cheerio';
import needle from 'needle';
import requestPromise from 'request-promise';
import { DonationTotal } from '../../schemas';
import { bundleConfig, getCtx } from './util/nodecg';

const nodecg = getCtx();
requestPromise.defaults({ jar: true });
let isFirstLogin = true;
const eventShort = 'uksgsu19';
const statsURL = 'https://donations.esamarathon.com/14?json';
const donationTotal = nodecg.Replicant<DonationTotal>('donationTotal');

init();
async function init() {
  // Get initial total from API and set an interval as a fallback.
  updateDonationTotalFromAPI();
  setInterval(updateDonationTotalFromAPI, 60000);

  await loginToTracker();
  require('./tracker-bids');
  require('./tracker-prizes');

  // Tracker logins expire every 2 hours. Re-login every 90 minutes.
  setInterval(loginToTracker, 90 * 60 * 1000);
}

async function updateDonationTotalFromAPI() {
  const resp = await needle('get', statsURL);
  if (resp.statusCode === 200) {
    const total = resp.body.agg.amount ? parseFloat(resp.body.agg.amount) : 0;
    if (donationTotal.value > total) {
      return;
    }

    if (donationTotal.value !== total) {
      nodecg.log.info('API donation total changed: $%s', total);
      donationTotal.value = total;
    }
  }
}

if (bundleConfig.fcb && bundleConfig.fcb.postKey) {
  nodecg.listenFor('updateFFZFollowing', 'nodecg-speedcontrol', updateFeaturedChannels);
}

async function updateFeaturedChannels(usernames: string[]) {
  const postKey = bundleConfig.fcb ? bundleConfig.fcb.postKey : '';
  const resp = await needle(
    'post',
    `https://fcb.esamarathon.com/featured_channels?key=${postKey}`,
    {
      channels: usernames,
    },
  );

  if (resp.statusCode === 200) {
    nodecg.log.info('Successfully sent featured channels to FCB server.');
  } else {
    nodecg.log.warn('Failed to send featured channels to FCB server.');
  }
}

// Fetch the login page, and run the response body through cheerio
// so we can extract the CSRF token from the hidden input field.
// Then, POST with our username, password, and the csrfmiddlewaretoken.
async function loginToTracker() {
  if (isFirstLogin) {
    nodecg.log.info('Logging into the tracker as %s.', nodecg.bundleConfig.tracker.username);
  } else {
    // tslint:disable-next-line: max-line-length
    nodecg.log.info('Refreshing tracker login session as %s.', nodecg.bundleConfig.tracker.username);
  }

  const loginURL = 'https://donations.esamarathon.com/admin/login/';
  try {
    const $ = await requestPromise({
      uri: loginURL,
      transform(body) {
        return cheerio.load(body);
      },
    });
    await requestPromise({
      method: 'POST',
      uri: loginURL,
      form: {
        username: nodecg.bundleConfig.tracker.username,
        password: nodecg.bundleConfig.tracker.password,
        csrfmiddlewaretoken: $('#login-form > input[name="csrfmiddlewaretoken"]').val(),
      },
      headers: {
        Referer: loginURL,
      },
      resolveWithFullResponse: true,
      simple: false,
    });
    if (isFirstLogin) {
      isFirstLogin = false;
      nodecg.log.info('Logged into the tracker as %s.', nodecg.bundleConfig.tracker.username);
    } else {
      nodecg.log.info('Refreshed tracker session as %s.', nodecg.bundleConfig.tracker.username);
    }
  } catch (err) {
    nodecg.log.warn('Error authenticating!\n', err);
  }
}
