/**
 * Most commercials work is done in the "esa-commercials" bundle, but this code
 * runs alongside that to control certain functionality.
 */

import { wait } from './util/helpers';
import { get as nodecg } from './util/nodecg';
import { sc } from './util/speedcontrol';
import sd from './util/streamdeck';

// Replicants only applicable to this file from another bundle.
const disabled = nodecg().Replicant<boolean>('disabled', 'esa-commercials');

/**
 * Correctly changes the title text on the Stream Deck "Disable Twitch Commercials" buttons.
 */
function changeDisableCommercialsSDTitle(): void {
  const text = (() => {
    if (['stopped', 'finished'].includes(sc.timer.value.state)) {
      return 'Cannot\nDisable\nAds\nCurrently';
    }
    if (disabled.value) return 'Ads\nDisabled\nfor Run';
    return 'Disable\nAds for\nRun';
  })();
  sd.setTextOnAllButtonsWithAction('com.esamarathon.streamdeck.disableads', text);
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
      }
    });
    disabled.on('change', () => {
      changeDisableCommercialsSDTitle();
    });

    // What to do once Stream Deck connection is initialised.
    sd.on('init', () => {
      changeDisableCommercialsSDTitle();
    });

    // What to do when any key is lifted on a connected Stream Deck.
    sd.on('keyUp', async (data) => {
      if (data.action.endsWith('disableads') && !disabled.value
      && !['stopped', 'finished'].includes(sc.timer.value.state)) {
        // Sends a message to the esa-commercials bundle.
        // Because we are using server-to-server messages, no confirmation yet.
        nodecg().sendMessageToBundle('disable', 'esa-commercials');
        changeDisableCommercialsSDTitle();
        await wait(100); // Hopefully stop a race condition so below "OK" displays.
        sd.send({ event: 'showOk', context: data.context });
      }
    });
  }
}

setup();
