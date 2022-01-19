import type { Configschema } from '@esa-layouts/types/schemas/configschema';
import { speak } from './text-to-speech';
import { markDonationAsRead } from './tracker/donations';
import { padTimeNumber } from './util/helpers';
import { get as nodecg } from './util/nodecg';
import obs from './util/obs';
import { donationsToRead, streamDeckData } from './util/replicants';
import { sc } from './util/speedcontrol';
import sd from './util/streamdeck';

const config = nodecg().bundleConfig as Configschema;
const defaultCommercialText = 'STEP 1\nTWITCH AD';
const defaultTimerText = 'Start\nTimer';
const defaultPlayerHudMsgText = 'Message\nTo Read';

// com.esamarathon.streamdeck.timer
// Controls the text on the buttons.
sc.timer.on('change', (val) => {
  const buttons = sd.findButtonsWithAction('com.esamarathon.streamdeck.timer');
  buttons.forEach((button) => {
    switch (val.state) {
      case 'running':
        sd.updateButtonText(button.context, 'Stop\nTimer');
        break;
      case 'paused':
        sd.updateButtonText(button.context, 'Resume\nTimer');
        break;
      case 'finished':
        sd.updateButtonText(button.context, 'Reset\nTimer');
        break;
      case 'stopped':
      default:
        sd.updateButtonText(button.context, defaultTimerText);
        break;
    }
  });
});

// com.esamarathon.streamdeck.twitchads
// Set text on commercial timer button depending on state.
sc.twitchCommercialTimer.on('change', (val) => {
  if (val.secondsRemaining > 0) {
    const minutes = Math.floor(val.secondsRemaining / 60);
    const seconds = Math.floor(val.secondsRemaining - minutes * 60);
    sd.setTextOnAllButtonsWithAction(
      'com.esamarathon.streamdeck.twitchads',
      `Twitch Ad\nPlaying:\n${minutes}:${padTimeNumber(seconds)}`,
    );
  } else {
    sd.setTextOnAllButtonsWithAction(
      'com.esamarathon.streamdeck.twitchads',
      defaultCommercialText,
    );
  }
});

sd.on('keyUp', async (data) => {
  // com.esamarathon.streamdeck.timer
  // Controls the nodecg-speedcontrol timer when the button is pressed.
  // Currently the "Stop Timer" state works if there's only 1 team.
  if (data.action === 'com.esamarathon.streamdeck.timer') {
    try {
      // Note: the nodecg-speedcontrol bundle will check if it *can* do these actions,
      // we do not need to check that here.
      switch (sc.timer.value.state) {
        case 'stopped':
        case 'paused':
          await sc.startTimer();
          break;
        case 'running':
          await sc.stopTimer();
          break;
        case 'finished':
          await sc.resetTimer();
          break;
        default:
          // Don't do anything
          break;
      }
    } catch (err) {
      // Drop for now
    }
  }

  // com.esamarathon.streamdeck.twitchads
  if (data.action === 'com.esamarathon.streamdeck.twitchads'
    && sc.twitchCommercialTimer.value.secondsRemaining <= 0) {
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      await obs.changeScene(config.obs.names.scenes.commercials);
    } catch (err) {
      nodecg().log.warn('[Stream Deck Buttons] Could not run Twitch commercials');
      nodecg().log.debug('[Stream Deck Buttons] Could not run Twitch commercials:', err);
    }
  }

  // com.esamarathon.streamdeck.ttsdonations
  if (data.action === 'com.esamarathon.streamdeck.ttsdonations') {
    const donationIndex = (
      data.payload.settings && data.payload.settings.slot
    ) ? data.payload.settings.slot as number : 0;
    const donation = donationsToRead.value[donationIndex];
    if (donation) {
      speak(donation);
      markDonationAsRead(donation.id);
    }
  }

  // com.esamarathon.streamdeck.donationread
  if (data.action === 'com.esamarathon.streamdeck.donationread') {
    const donationIndex = (
      data.payload.settings && data.payload.settings.slot
    ) ? data.payload.settings.slot as number : 0;
    const donation = donationsToRead.value[donationIndex];
    if (donation) {
      markDonationAsRead(donation.id);
    }
  }

  // com.esamarathon.streamdeck.playerhudtrigger-message
  if (data.action.startsWith('com.esamarathon.streamdeck.playerhudtrigger')) {
    const msgBtns = sd
      .findButtonsWithAction('com.esamarathon.streamdeck.playerhudtrigger-message');
    msgBtns.forEach((btn) => {
      sd.updateButtonText(btn.context, 'Message\nTo Read');
    });
    if (streamDeckData.value.playerHUDTriggerType
      && data.action.includes(streamDeckData.value.playerHUDTriggerType)) {
      delete streamDeckData.value.playerHUDTriggerType;
    } else if (data.action.includes('message')) {
      sd.updateButtonText(data.context, '(ACTIVE)\nMessage\nTo Read');
      streamDeckData.value.playerHUDTriggerType = 'message';
    }
  }
});

sd.on('willAppear', (data) => {
  // Set default text on buttons.
  // TODO: Make these check *what* text they should actually show!
  if (data.action === 'com.esamarathon.streamdeck.timer') {
    sd.updateButtonText(data.context as string, defaultTimerText);
  } else if (data.action === 'com.esamarathon.streamdeck.twitchads') {
    sd.updateButtonText(data.context as string, defaultCommercialText);
  } else if (data.action === 'com.esamarathon.streamdeck.playerhudtrigger-message') {
    sd.updateButtonText(data.context as string, defaultPlayerHudMsgText);
  }
});

sd.on('init', () => {
  // Set default text on buttons.
  // TODO: Make these check *what* text they should actually show!
  sd.setTextOnAllButtonsWithAction('com.esamarathon.streamdeck.timer', defaultTimerText);
  sd.setTextOnAllButtonsWithAction('com.esamarathon.streamdeck.twitchads', defaultCommercialText);
  sd.setTextOnAllButtonsWithAction(
    'com.esamarathon.streamdeck.playerhudtrigger-message',
    defaultPlayerHudMsgText,
  );

  // Clearing this on initial connection for now for simplicity.
  delete streamDeckData.value.playerHUDTriggerType;
});
