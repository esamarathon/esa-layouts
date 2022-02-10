import { Configschema } from '@esa-layouts/types/schemas';
import { Asset } from '@shared/types';
import clone from 'clone';
import { writeFile } from 'fs/promises';
import { orderBy } from 'lodash';
import needle from 'needle';
import { join } from 'path';
import { get as nodecg } from './util/nodecg';
import obs from './util/obs';
import offsite from './util/offsite';
import { assetsReaderIntroductionImages, obsData, readerIntroduction } from './util/replicants';
import { sc } from './util/speedcontrol';
import sd from './util/streamdeck';

const config = (nodecg().bundleConfig as Configschema);
let assetsTemp: Asset[] = [];
const sdButtonUUIDMap = {
  advanceSlide: 'com.esamarathon.streamdeck.readerintroduction-advanceslide',
  resetSlides: 'com.esamarathon.streamdeck.readerintroduction-resetslides',
};

/**
 * Returns images sorted by name ascending.
 * Name should start with a number to get these in the correct order!
 */
function assetsSorted(): Asset[] {
  return orderBy(clone(assetsReaderIntroductionImages.value), 'name', 'asc');
}

/**
 * Actually does the Twitch API query for finding boxart URLs.
 * @param endpoint Endpoint for Twitch API.
 * @returns Game/category object.
 */
// TODO: Needs some error logging?
async function boxartRequest(endpoint: string): Promise<{ 'box_art_url': string } | undefined> {
  try {
    const resp = await sc.sendMessage('twitchAPIRequest', {
      method: 'get',
      endpoint,
      newAPI: true,
    });
    if (resp.body.data[0]) return resp.body.data[0];
  } catch (err) {
    nodecg().log.debug('[Reader Introduction] Error requested boxart from Twitch API:', err);
  }
  return undefined;
}

/**
 * Looks up and saves the boxart based on a run ID.
 * @param id ID of the run in the "runDataArray".
 */
// TODO: Sometimes the first result of `/search/categories` is bad.
async function downloadBoxart(id: string): Promise<void> {
  try {
    const run = sc.getRunDataArray().find((r) => r.id === id);
    if (run) {
      // First, check the exact Twitch game if we have it on file.
      let resp = run.gameTwitch
        ? await boxartRequest(`/games?name=${encodeURIComponent(run.gameTwitch)}`)
        : undefined;
      // If the above fails, do a general search for the normal name.
      if (!resp) {
        resp = run.game
          ? await boxartRequest(`/search/categories?query=${encodeURIComponent(run.game)}`)
          : undefined;
      }
      if (resp) {
        // Replace the template resolution with our own. Sometimes the "template" is actually 52x72.
        const url = resp.box_art_url
          .replace('{width}x{height}', '1080x1440').replace('52x72', '1080x1440');
        // Download and save the actual file.
        const data = await needle('get', url);
        await writeFile(join(__dirname, `../boxart/${id}.jpg`), data.body, 'binary');
      } else if (!resp) {
        nodecg().log.debug('[Reader Introduction] Could not find this game on the Twitch API');
      }
    }
  } catch (err) {
    // Could not fully get boxart for some reason.
    nodecg().log.debug('[Reader Introduction] Could not fully download boxart:', err);
  }
}

/**
 * Generate the text needed to be displayed on the "Advance Slide" button.
 * @param linebreaks If you wish to include linebreaks in the text for Stream Deck purposes.
 * @param i The index you wish to force this to display, 0-based.
 * @returns String with title to use.
 */
function generateAdvanceSlideTitle(linebreaks: boolean, i?: number): string {
  let index = typeof i === 'number'
    ? i
    : assetsTemp.findIndex((a) => a.sum === readerIntroduction.value.current);
  if (readerIntroduction.value.current === 'RunInfo') {
    index = assetsTemp.length;
  }
  const prependText = (() => {
    if (!obs.isCurrentScene(config.obs.names.scenes.readerIntroduction)) {
      return '⚠\nCannot\nAdvance\nSlide';
    }
    if (index < assetsTemp.length) return 'Advance\nSlide';
    return 'Slides\nComplete!';
  })();
  let text = `${prependText}\n(${index >= 0 ? (index + 1) : '?'}/${assetsTemp.length + 1})`;
  if (!linebreaks) text = text.replace(/\n/g, ' ');
  return text;
}

/**
 * Correctly changes the title text on the Stream Deck "Advance Slide" buttons.
 * @param i The index you wish to force this to display, 0-based.
 */
function changeAdvanceSlideSDTitle(i?: number): void {
  const text = generateAdvanceSlideTitle(true, i);
  sd.setTextOnAllButtonsWithAction(sdButtonUUIDMap.advanceSlide, text);
}

/**
 * Correctly changes the title text on the offsite "Advance Slide" buttons.
 * @param i The index you wish to force this to display, 0-based.
 */
function changeAdvanceSlideOffsiteTitle(i?: number): void {
  const title = generateAdvanceSlideTitle(false, i);
  offsite.emit('title', { name: 'slidesAdvance', title });
}

/**
 * Resets the temporarily stored assets ands the current slide value.
 */
function reset(): void {
  assetsTemp = assetsSorted();
  readerIntroduction.value.current = assetsTemp[0]?.sum || 'RunInfo';
  changeAdvanceSlideSDTitle();
  changeAdvanceSlideOffsiteTitle();
}

/**
 * Shows the next slide, either one of the images or if all done, the run information.
 */
function showNext(): boolean {
  if (!obs.isCurrentScene(config.obs.names.scenes.readerIntroduction)) {
    return false;
  }
  if (readerIntroduction.value.current !== 'RunInfo') {
    const index = assetsTemp.findIndex((a) => a.sum === readerIntroduction.value.current);
    if (index >= 0 && assetsTemp.length > (index + 1)) {
      readerIntroduction.value.current = assetsTemp[index + 1].sum;
    } else {
      readerIntroduction.value.current = 'RunInfo';
    }
    changeAdvanceSlideSDTitle(index + 1);
    changeAdvanceSlideOffsiteTitle();
    return true;
  }
  return false;
}

// Listens for current/next run ID changes and executes a boxart lookup/download.
// Also resets the temporary assets array and current ID that should be shown on the graphic.
// TODO: Should also do this if the game name in the run data is changed?
//       Also maybe one day integrate the download into nodecg-speedcontrol?
let init = false;
sc.runDataActiveRunSurrounding.on('change', async (newVal, oldVal) => {
  if (!init && newVal.current) await downloadBoxart(newVal.current);
  if (init) {
    if (newVal.current !== oldVal?.current) reset();
    if (newVal.next && newVal.next !== oldVal?.next) await downloadBoxart(newVal.next);
  }
  init = true;
});
assetsReaderIntroductionImages.on('change', (newVal) => {
  if (!assetsTemp.length && newVal.length > 0) reset();
});

// Triggers a Stream Deck title text update when scene changes.
obsData.on('change', (newVal, oldVal) => {
  if (newVal.scene !== oldVal?.scene) {
    changeAdvanceSlideSDTitle();
    changeAdvanceSlideOffsiteTitle();
  }
});

// What to do once Stream Deck connection is initialised.
sd.on('init', () => {
  changeAdvanceSlideSDTitle();
});

// What to do when a button "appears" in the Stream Deck software,
// usually after dragging on a new instance.
sd.on('willAppear', (data) => {
  if ((data.action as string) === sdButtonUUIDMap.advanceSlide) {
    changeAdvanceSlideSDTitle();
  }
});

// What to do when any key is lifted on a connected Stream Deck.
sd.on('keyUp', (data) => {
  if (data.action === sdButtonUUIDMap.advanceSlide) {
    const success = showNext();
    if (success) sd.send({ event: 'showOk', context: data.context });
  } else if (data.action === sdButtonUUIDMap.resetSlides) {
    reset();
    sd.send({ event: 'showOk', context: data.context });
  }
});

offsite.on('authenticated', () => {
  changeAdvanceSlideOffsiteTitle();
});

// Offsite reader controls.
offsite.on('slidesAdvance', () => {
  const success = showNext();
  offsite.emit('ack', {
    name: 'slidesAdvance',
    success,
    title: generateAdvanceSlideTitle(false),
  });
});
offsite.on('slidesReset', () => {
  reset();
  offsite.emit('ack', { name: 'slidesReset', success: true });
});
