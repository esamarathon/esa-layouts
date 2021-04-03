import type { TextToSpeech } from '@esa-layouts/types';
import type { TtsVoices } from '@esa-layouts/types/schemas';
import type { Configschema } from '@esa-layouts/types/schemas/configschema';
import type { Tracker } from '@esamarathon/esa-layouts-shared/types';
import needle from 'needle';
import { get as nodecg } from './util/nodecg';
import { ttsVoices } from './util/replicants';

const config = (nodecg().bundleConfig as Configschema).tts;

/**
 * Will attempt to trigger speech for the supplied donation.
 * @param donation Donation object
 */
export async function speak(donation: Tracker.FormattedDonation): Promise<void> {
  const text = `${donation.name} donated $${donation.amount.toFixed(2)}`
    + `${donation.comment ? `: ${donation.comment}` : ''}`;
  const url = `${config.voiceAPI}?voice=${ttsVoices.value.selected}`
    + `&text=${encodeURIComponent(text)}`;
  nodecg().sendMessage('ttsToRead', url);
  nodecg().log.debug('[TTS] URL sent to overlay:', url);
}

/**
 * Plays an example donation message using the TTS.
 */
async function ttsExample(): Promise<void> {
  try {
    const resp = await needle('get', 'https://taskinoz.com/gdq/api/');
    speak({
      amount: 100 * Math.random(),
      name: 'Anonymous',
      comment: resp.body,
      id: 0, // Fake ID
      timestamp: 0, // Fake timestamp
    });
  } catch (err) {
    // Silently drop for this example
  }
}

async function init(): Promise<void> {
  try {
    nodecg().log.info('[TTS] Setting up');
    const resp = await needle('get', `${config.voiceAPI}/voices`);
    const list = resp.body.voices as TextToSpeech.Voices;
    ttsVoices.value.available = Object.keys(list).reduce((prev, code) => {
      // Only use voices using the Wavenet tech and that are English based.
      if (list[code].languageCode.includes('en-') && code.includes('Wavenet')) {
        prev.push({
          code,
          name: `${list[code].name} (${list[code].languageName}, ${list[code].gender})`,
        });
      }
      return prev;
    }, [] as TtsVoices['available']);

    // Set the voice to a default if needed.
    if (!ttsVoices.value.selected) {
      ttsVoices.value.selected = 'en-US-Wavenet-A';
    }

    nodecg().listenFor('ttsExample', ttsExample);
    nodecg().log.info('[TTS] Successfully set up');
  } catch (err) {
    nodecg().log.warn('[TTS] Error setting up');
    nodecg().log.debug('[TTS] Error setting up:', err);
  }
}

if (config.enable && config.voiceAPI) {
  init();
}
