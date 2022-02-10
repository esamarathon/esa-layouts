/**
 * Most commercials work is done in the "esa-commercials" bundle, but this code
 * runs alongside that to control certain functionality.
 */

import { padTimeNumber, wait } from './util/helpers';
import { get as nodecg } from './util/nodecg';
import offsite from './util/offsite';
import { sc } from './util/speedcontrol';
import sd from './util/streamdeck';

// Replicants only applicable to this file from another bundle.
const disabled = nodecg().Replicant<boolean>('disabled', 'esa-commercials');

/**
 * Generates the text needed to be displayed on the "Disable Twitch Commercial" button.
 * @param linebreaks If you wish to include linebreaks in the text for Stream Deck purposes.
 * @returns String with title to use.
 */
function generateDisableCommercialsTitle(linebreaks: boolean): string {
  let text = (() => {
    if (disabled.value && !['stopped', 'finished'].includes(sc.timer.value.state)) {
      return 'Ads\nDisabled\nfor Run';
    }
    if (sc.twitchCommercialTimer.value.secondsRemaining > 0) {
      const minutes = Math.floor(sc.twitchCommercialTimer.value.secondsRemaining / 60);
      const seconds = Math.floor(sc.twitchCommercialTimer.value.secondsRemaining - minutes * 60);
      return `Ads\nPlaying:\n${minutes}:${padTimeNumber(seconds)}`;
    }
    if (['stopped', 'finished'].includes(sc.timer.value.state)) {
      return '⚠\nCannot\nDisable\nAds';
    }
    return 'Disable\nAds for\nRun';
  })();
  if (!linebreaks) text = text.replace(/\n/g, ' ');
  return text;
}

/**
 * Correctly changes the title text on the Stream Deck "Disable Twitch Commercials" buttons.
 */
function changeDisableCommercialsSDTitle(): void {
  const text = generateDisableCommercialsTitle(true);
  sd.setTextOnAllButtonsWithAction('com.esamarathon.streamdeck.twitchads', text);
}

/**
 * Correctly changes the title text on the offsite "Disbale Twitch Commercials" buttons.
 */
function changeDisableCommercialsOffsiteTitle(): void {
  const title = generateDisableCommercialsTitle(false);
  offsite.emit('title', { name: 'commercialsDisable', title });
}

async function setup(): Promise<void> {
  // 10s check to see if esa-commercials is available alongside this bundle.
  // Doing it this way because we can't specificy both in bundleDependencies and need to check.
  for (let i = 0; i < 10; i += 1) {
    // If it's available, esa-commercials (as of writing) returns a pending promise.
    if (typeof nodecg().extensions['esa-commercials'] !== 'undefined') {
      break;
    }
    await wait(1000);
  }

  if (nodecg().extensions['esa-commercials']) {
    sc.timer.on('change', (newVal, oldVal) => {
      if (newVal.state !== oldVal?.state) {
        changeDisableCommercialsSDTitle();
        changeDisableCommercialsOffsiteTitle();
      }
    });
    disabled.on('change', () => {
      changeDisableCommercialsSDTitle();
      changeDisableCommercialsOffsiteTitle();
    });
    sc.twitchCommercialTimer.on('change', () => {
      changeDisableCommercialsSDTitle();
      changeDisableCommercialsOffsiteTitle();
    });

    // What to do once Stream Deck connection is initialised.
    sd.on('init', () => {
      changeDisableCommercialsSDTitle();
    });

    // What to do when a button "appears" in the Stream Deck software,
    // usually after dragging on a new instance.
    sd.on('willAppear', (data) => {
      if ((data.action as string).endsWith('twitchads')) {
        changeDisableCommercialsSDTitle();
      }
    });

    // What to do when any key is lifted on a connected Stream Deck.
    sd.on('keyUp', async (data) => {
      if (data.action.endsWith('twitchads') && !disabled.value
      && !['stopped', 'finished'].includes(sc.timer.value.state)) {
        // Sends a message to the esa-commercials bundle.
        // Because we are using server-to-server messages, no confirmation yet.
        nodecg().sendMessageToBundle('disable', 'esa-commercials');
        changeDisableCommercialsSDTitle();
        await wait(100); // Hopefully stop a race condition so below "OK" displays.
        sd.send({ event: 'showOk', context: data.context });
      }
    });

    offsite.on('authenticated', () => {
      changeDisableCommercialsOffsiteTitle();
    });

    offsite.on('commercialsDisable', () => {
      if (!disabled.value && !['stopped', 'finished'].includes(sc.timer.value.state)) {
        // Sends a message to the esa-commercials bundle.
        // Because we are using server-to-server messages, no confirmation yet.
        nodecg().sendMessageToBundle('disable', 'esa-commercials');
        offsite.emit('ack', {
          name: 'commercialsDisable',
          success: true,
          title: generateDisableCommercialsTitle(false),
        });
      }
    });
  }
}

setup();
