import cheerio from 'cheerio';
import requestPromise from 'request-promise';
import * as nodecgApiContext from './util/nodecg-api-context';

const nodecg = nodecgApiContext.get();
requestPromise.defaults({ jar: true });
let isFirstLogin = true;

init();
async function init() {
  await loginToTracker();

  // Tracker logins expire every 2 hours. Re-login every 90 minutes.
  setInterval(loginToTracker, 90 * 60 * 1000);
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
