import { speak } from './text-to-speech';
import { markDonationAsRead } from './tracker/donations';
import { donationsToRead, streamDeckData } from './util/replicants';
import { sc } from './util/speedcontrol';
import sd from './util/streamdeck';
import x32 from './util/x32';

const defaultTimerText = 'Start\nTimer';
const defaultPlayerHudMsgText = 'Message\nTo Read';

const muteToggleState: { [k: string]: boolean } = {};

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

  // com.esamarathon.streamdeck.mixermutetoggle
  if (data.action === 'com.esamarathon.streamdeck.mixermutetoggle') {
    if ((data.payload as any).settings.address) {
      const toggle = muteToggleState[(data.payload as any).settings.address] ?? true;
      x32.conn?.send({
        address: (data.payload as any).settings.address,
        args: [{ type: 'i', value: toggle ? 0 : 1 }],
      });
      muteToggleState[(data.payload as any).settings.address] = !toggle;
      sd.updateButtonText(data.context as string, !toggle ? '🔊\nUnmuted' : '🔇\nMuted');
    }
  }
});

sd.on('willAppear', (data) => {
  // Set default text on buttons.
  // TODO: Make these check *what* text they should actually show!
  if (data.action === 'com.esamarathon.streamdeck.timer') {
    sd.updateButtonText(data.context as string, defaultTimerText);
  } else if (data.action === 'com.esamarathon.streamdeck.playerhudtrigger-message') {
    sd.updateButtonText(data.context as string, defaultPlayerHudMsgText);
  } else if (data.action === 'com.esamarathon.streamdeck.mixermutetoggle') {
    if ((data.payload as any).settings.address) {
      const toggle = muteToggleState[(data.payload as any).settings.address];
      sd.updateButtonText(
        data.context as string,
        typeof toggle !== 'undefined'
          ? `${toggle ? '🔊\nUnmuted' : '🔇\nMuted'}`
          : 'Press\nto\nactivate',
      );
    }
  }
});

sd.on('init', () => {
  // Set default text on buttons.
  // TODO: Make these check *what* text they should actually show!
  sd.setTextOnAllButtonsWithAction('com.esamarathon.streamdeck.timer', defaultTimerText);
  sd.setTextOnAllButtonsWithAction(
    'com.esamarathon.streamdeck.playerhudtrigger-message',
    defaultPlayerHudMsgText,
  );
  sd.setTextOnAllButtonsWithAction(
    'com.esamarathon.streamdeck.mixermutetoggle',
    'Press\nto\nactivate',
  );

  // Clearing this on initial connection for now for simplicity.
  delete streamDeckData.value.playerHUDTriggerType;
});
