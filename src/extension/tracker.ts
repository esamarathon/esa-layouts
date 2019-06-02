import cheerio from 'cheerio';
import needle from 'needle';
import requestPromise from 'request-promise';
import { DonationTotal } from '../../schemas';
import { bundleConfig, getCtx } from './util/nodecg';
import { mq } from './util/rabbitmq';

const nodecg = getCtx();
requestPromise.defaults({ jar: true });
let isFirstLogin = true;
const eventShort = 'uksgsu19';
const statsURL = 'https://donations.esamarathon.com/14?json';
const donationTotal = nodecg.Replicant<DonationTotal>('donationTotal');

init();
async function init() {
  try {
    await loginToTracker();

    // Get initial total from API and set an interval as a fallback.
    updateDonationTotalFromAPI();
    setInterval(updateDonationTotalFromAPI, 60000);

    require('./tracker-bids');
    require('./tracker-prizes');

    // Tracker logins expire every 2 hours. Re-login every 90 minutes.
    setInterval(loginToTracker, 90 * 60 * 1000);
  } catch (err) {
    nodecg.log.warn('Error logging into tracker, retrying in 60 seconds.\n');
    setTimeout(init, 60000);
  }
}

async function updateDonationTotalFromAPI() {
  try {
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
  } catch (err) {
    // silently drop it for now
  }
}

if (bundleConfig.fcb && bundleConfig.fcb.postKey) {
  nodecg.listenFor('updateFFZFollowing', 'nodecg-speedcontrol', updateFeaturedChannels);
}

async function updateFeaturedChannels(usernames: string[]) {
  const postKey = bundleConfig.fcb ? bundleConfig.fcb.postKey : '';
  try {
    const resp = await needle(
      'post',
      `https://fcb.esamarathon.com/featured_channels?key=${postKey}`,
      JSON.stringify({
        channels: usernames,
      }),
      {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      },
    );

    if (resp.statusCode === 200) {
      nodecg.log.info('Successfully sent featured channels to FCB server.');
    } else {
      nodecg.log.warn('Failed to send featured channels to FCB server.');
    }
  } catch (err) {
    nodecg.log.warn('Failed to send featured channels to FCB server.', err);
  }
}

mq.on('evt-donation-total', (data) => {
  if (data.event === eventShort) {
    donationTotal.value = data.new_total;
    nodecg.log.info('Updated donation total received: $%s', data.new_total.toFixed(2));
  }
});

mq.on('donation-fully-processed', (data) => {
  if (data.event === eventShort) {
    nodecg.log.info('Received new donation with ID %s.', data._id);
    nodecg.sendMessage('newDonation', data);
  }
});

mq.on('new-screened-sub', data => nodecg.sendMessage('newSub', data));
mq.on('new-screened-tweet', data => nodecg.sendMessage('newTweet', data));

// Fetch the login page, and run the response body through cheerio
// so we can extract the CSRF token from the hidden input field.
// Then, POST with our username, password, and the csrfmiddlewaretoken.
function loginToTracker(): Promise<any> {
  return new Promise(async (resolve, reject) => {
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
      resolve();
    } catch (err) {
      nodecg.log.warn('Error authenticating!\n', err);
      reject(err);
    }
  });
}
