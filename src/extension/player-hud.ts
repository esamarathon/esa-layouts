/**
 * TODO: Transfer more to this file (mainly from streamdeck-buttons.ts).
 */

import offsite from './util/offsite';
import { streamDeckData } from './util/replicants';

offsite.on('playerHudTriggerMessage', () => {
  if (streamDeckData.value.playerHUDTriggerType === 'message') {
    delete streamDeckData.value.playerHUDTriggerType;
  } else {
    streamDeckData.value.playerHUDTriggerType = 'message';
    // TODO: Send success.
  }
});
