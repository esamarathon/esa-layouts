import clone from 'clone';
import needle from 'needle';
import * as nodecgApiContext from './util/nodecg-api-context';
import { bundleConfig } from './util/nodecg-bundleconfig';

if (!bundleConfig.tts.enable || !bundleConfig.tts.altVoiceAPI) {
  // @ts-ignore: Gonna do this anyway :)
  return;
}

const nodecg = nodecgApiContext.get();
const voices: any[] = [];
const availableVoices = nodecg.Replicant<any[]>('ttsVoices', { defaultValue: [] });
const chosenVoice = nodecg.Replicant<string>('ttsChosenVoice');

getAvailableVoices();
async function getAvailableVoices() {
  try {
    const resp = await needle('get', `${bundleConfig.tts.altVoiceAPI}/voices`);
    const voiceList = resp.body.voices;
    Object.keys(voiceList).forEach((code) => {
      // Only use voices using the Wavenet tech and that are English based.
      if (voiceList[code].languageCode.includes('en-') && code.includes('Wavenet')) {
        voices.push({
          code,
          // tslint:disable-next-line: max-line-length
          name: `${voiceList[code].name} (${voiceList[code].languageName}, ${voiceList[code].gender})`,
        });
      }
    });

    availableVoices.value = clone(voices);

    // Set the voice to a default if needed.
    if (!chosenVoice.value) {
      chosenVoice.value = 'en-US-Wavenet-A';
    }

    nodecg.listenFor('ttsSpeak', speak);
    nodecg.listenFor('ttsSpeakExample', async () => {
      console.log('we gonna play example')
      const amount = 100 * Math.random();

      try {
        const resp = await needle('get', 'https://taskinoz.com/gdq/api/');
        speak({
          name: 'Anonymous',
          amount,
          comment: resp.body,
        });
      } catch (err) {
        console.log(err);
        // silently drop for now
      }
    });
  } catch (err) {
    // silently drop for now
  }
}

async function speak(donation: any) {
  let text = `${donation.name} donated $${donation.amount.toFixed(2)}`;
  if (donation.comment) text += `: ${donation.comment}`;

  // tslint:disable-next-line: max-line-length
  const url = `${bundleConfig.tts.altVoiceAPI}?voice=${chosenVoice.value}&text=${encodeURIComponent(text)}`;
  nodecg.log.debug(url);
}
