import needle from 'needle';
import { DonationTotal, OtherStreamInfo, RecentDonations } from '../../schemas';
import * as nodecgApiContext from './util/nodecg-api-context';
import { bundleConfig } from './util/nodecg-bundleconfig';
import { mq } from './util/rabbitmq';

if (!bundleConfig.tracker.enable) {
  // @ts-ignore: Gonna do this anyway :)
  return;
}

interface EventInfo {
  id: number;
  short: string;
  total: number;
}

const nodecg = nodecgApiContext.get();
let isFirstLogin = true;
export let cookies: needle.NeedleResponse['cookies'];
export const eventInfo: EventInfo[] = [];
export const streamEvtNumber = bundleConfig.tracker.streamEvent - 1;
const donationTotal = nodecg.Replicant<DonationTotal>('donationTotal');
const recentDonations = nodecg.Replicant<RecentDonations>('recentDonations');
const evtShortRep = nodecg.Replicant<string>('evtShort');
const otherStreamInfo = nodecg.Replicant<OtherStreamInfo>('otherStreamInfo');

init();
async function init() {
  try {
    // Go through all events and compile the important info for them.
    const events = (
      Array.isArray(bundleConfig.tracker.events)
    ) ? bundleConfig.tracker.events : [bundleConfig.tracker.events];
    for await (const short of events) {
      try {
        const id = await getEventIDFromShort(short);
        eventInfo.push({
          id,
          short,
          total: 0,
        });
      } catch (err) {
        // silently drop it for now
      }
    }

    if (!eventInfo.length) {
      nodecg.log.warn('No events found to query the tracker for.');
      throw new Error('');
    }

    await loginToTracker();

    // Get initial total from API and set an interval as a fallback.
    updateDonationTotalFromAPI();
    setInterval(updateDonationTotalFromAPI, 60000);
    evtShortRep.value = eventInfo[streamEvtNumber].short;

    require('./tracker-bids');
    require('./tracker-prizes');
  } catch (err) {
    nodecg.log.warn('Error setting up tracker, retrying in 60 seconds.');
    setTimeout(init, 60000);
  }
}

function getEventIDFromShort(short: string): Promise<number> {
  return new Promise(async (resolve, reject) => {
    try {
      const resp = await needle(
        'get',
        `https://${nodecg.bundleConfig.tracker.address}/search/?short=${short}&type=event`,
        cookies,
      );

      if (!resp.body.length) {
        throw new Error(`Event ${short} does not exist on the tracker.`);
      }

      resolve(resp.body[0].pk);
    } catch (err) {
      reject(err);
    }
  });
}

async function updateDonationTotalFromAPI() {
  let total = 0;
  for await (const event of eventInfo) {
    try {
      const resp = await needle(
        'get',
        `https://${nodecg.bundleConfig.tracker.address}/${event.id}?json`,
      );
      if (resp.statusCode === 200) {
        const evtTotal = resp.body.agg.amount ? parseFloat(resp.body.agg.amount) : 0;
        event.total = evtTotal;
        total += evtTotal;
      }
    } catch (err) {
      // silently drop it for now
    }
  }

  if (donationTotal.value !== total) {
    nodecg.log.info('API donation total changed: $%s', total);
    donationTotal.value = total;
  }
}

if (nodecg.bundleConfig.fcb && nodecg.bundleConfig.fcb.postKey) {
  nodecg.listenFor('updateFFZFollowing', 'nodecg-speedcontrol', updateFeaturedChannels);
}

// Used to update the featured channels on the bridge running on an external server.
async function updateFeaturedChannels(usernames: string[]) {
  const postKey = nodecg.bundleConfig.fcb.postKey;
  try {
    const resp = await needle(
      'post',
      `https://${nodecg.bundleConfig.fcb.address}/featured_channels?key=${postKey}`,
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
      nodecg.log.warn('Failed to send featured channels to FCB server (%s).', resp.statusCode);
    }
  } catch (err) {
    nodecg.log.warn('Failed to send featured channels to FCB server.');
    nodecg.log.debug('Failed to send featured channels to FCB server:', err);
  }
}

// When the donation total is updated, this is fired.
mq.on('evt-donation-total', (data) => {
  let total = 0;

  for (const event of eventInfo) {
    if (data.event === event.short) {
      event.total = data.new_total;
    }

    total += event.total;
  }

  if (donationTotal.value !== total) {
    donationTotal.value = total;
    nodecg.log.info('Updated donation total received: $%s', total.toFixed(2));
  }
});

// When a new donation is fully processed on the tracker, this is fired.
mq.on('donation-fully-processed', (data) => {
  nodecg.log.info('Received new donation with ID %s.', data._id);
  nodecg.sendMessage('newDonation', data);
  if (data.amount >= 20) {
    recentDonations.value.unshift(data);
    recentDonations.value.length = Math.min(recentDonations.value.length, 20);
  }
});

// Is this tracker stuff? Living here for now.
mq.on('new-screened-sub', data => nodecg.sendMessage('newSub', data));
mq.on('new-screened-tweet', data => nodecg.sendMessage('newTweet', data));
mq.on('run-changed', (data) => { otherStreamInfo.value = data.run; });

function loginToTracker():Promise<any> {
  return new Promise(async (resolve, reject) => {
    if (isFirstLogin) {
      nodecg.log.info('Logging into the tracker as %s.', nodecg.bundleConfig.tracker.username);
    } else {
      // tslint:disable-next-line: max-line-length
      nodecg.log.info('Refreshing tracker login session as %s.', nodecg.bundleConfig.tracker.username);
    }

    const loginURL = `https://${nodecg.bundleConfig.tracker.address}/admin/login/`;
    try {
      // Access login page to get CSRF token.
      const resp1 = await needle('get', loginURL);
      if (resp1.statusCode !== 200) {
        throw new Error('Could not access the tracker log in page.');
      }

      // POST using the CSRF token alongside the username/password.
      const resp2 = await needle(
        'post',
        loginURL,
        {
          username: nodecg.bundleConfig.tracker.username,
          password: nodecg.bundleConfig.tracker.password,
          csrfmiddlewaretoken: (resp1.cookies) ? resp1.cookies.csrftoken : undefined,
        },
        {
          cookies: resp1.cookies,
          headers: {
            referer: loginURL,
          },
        },
      );

      // If we're not being redirected or there's no session token, the login failed.
      if (resp2.statusCode !== 302 || (resp2.cookies && !resp2.cookies.tracker_session)) {
        throw new Error('Log in to the tracker was unsuccessful, is your user/pass correct?');
      }

      // Store cookie for later use.
      cookies = resp2.cookies;

      if (isFirstLogin) {
        isFirstLogin = false;
        nodecg.log.info('Logged into the tracker as %s.', nodecg.bundleConfig.tracker.username);
      } else {
        nodecg.log.info('Refreshed tracker session as %s.', nodecg.bundleConfig.tracker.username);
      }

      // Tracker logins expire every 2 hours. Re-login every 90 minutes.
      setTimeout(loginToTracker, 90 * 60 * 1000);
      resolve();
    } catch (err) {
      nodecg.log.warn('Error authenticating with the tracker.');
      nodecg.log.debug('Error authenticating with the tracker:', err);
      if (!isFirstLogin) {
        setTimeout(loginToTracker, 60000);
      }
      reject();
    }
  });
}
