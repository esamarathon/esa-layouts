import { createWriteStream } from 'fs';
import needle from 'needle';
import { join } from 'path';
import { sc } from './util/speedcontrol';

// Attempts to download boxart from the Twitch API when the run/game name changes.
// TODO: This will only work if the name is *exact*, need a backup in case it isn't.
//       We also need good error logging here too.
//       Also maybe one day integrate this into nodecg-speedcontrol?
let init = false;
sc.runDataActiveRun.on('change', async (newVal, oldVal) => {
  if (init && (newVal?.id !== oldVal?.id
  || (newVal?.game !== oldVal?.game && (newVal?.game || newVal?.gameTwitch)))) {
    try {
      const resp = await sc.sendMessage('twitchAPIRequest', {
        method: 'get',
        endpoint: `/games?name=${encodeURIComponent(newVal?.gameTwitch || newVal?.game || '')}`,
        newAPI: true,
      });
      if (resp.body.data[0]) {
        const url = (resp.body.data[0].box_art_url as string)
          .replace('{width}x{height}', '1080x1440');
        needle.get(url)
          .pipe(createWriteStream(join(__dirname, `../boxart/${newVal?.id}.jpg`)))
          .on('finish', () => { /* done */ })
          .on('error', (err) => { /* error */ });
      }
    } catch (err) { /* error */ }
  }
  init = true;
});
