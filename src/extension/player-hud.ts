/**
 * TODO: Transfer more to this file (mainly from streamdeck-buttons.ts).
 */

import offsite from './util/offsite';
import { streamDeckData } from './util/replicants';

/**
 * Generate the text needed to be displayed on the "Player HUD Trigger - Message" button.
 * @returns String with title to use.
 */
function generatePlayerHudTriggerMessageTitle(): string {
  if (streamDeckData.value.playerHUDTriggerType === 'message') {
    return '(ACTIVE) Message to Read';
  }
  return 'Message to Read';
}

/**
 * Correctly changes the title text on the offsite "Player HUD Trigger - Messagee" buttons.
 */
function changePlayerHudTriggerMessageOffsiteTitle(): void {
  const title = generatePlayerHudTriggerMessageTitle();
  offsite.emit('title', { name: 'playerHudTriggerMessage', title });
}

offsite.on('authenticated', () => {
  changePlayerHudTriggerMessageOffsiteTitle();
});

offsite.on('playerHudTriggerMessage', () => {
  if (streamDeckData.value.playerHUDTriggerType === 'message') {
    delete streamDeckData.value.playerHUDTriggerType;
  } else {
    streamDeckData.value.playerHUDTriggerType = 'message';
  }
  offsite.emit('ack', {
    name: 'playerHudTriggerMessage',
    success: true,
    title: generatePlayerHudTriggerMessageTitle(),
  });
});
