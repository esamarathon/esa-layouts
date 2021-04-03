import type { Configschema } from '@esa-layouts/types/schemas/configschema';
import StreamdeckUtil from 'streamdeck-util';
import { get as nodecg } from './nodecg';

const config = (nodecg().bundleConfig as Configschema).streamdeck;
const sd = new StreamdeckUtil();

if (config.enable) {
  sd.listen({
    key: config.key,
    port: config.port,
    debug: config.debug,
  });
  nodecg().log.info('[Stream Deck] Listening for connections');

  sd.on('open', () => {
    nodecg().log.info('[Stream Deck] Connection successful');
  });
  sd.on('close', (code) => {
    nodecg().log.warn('[Stream Deck] Connection lost (%s)', code);
  });
  sd.on('error', (err) => {
    nodecg().log.warn('[Stream Deck] Connection error');
    nodecg().log.debug('[Stream Deck] Connection error:', err);
  });
}

export default sd;
