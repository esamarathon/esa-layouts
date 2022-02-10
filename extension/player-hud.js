"use strict";
/**
 * TODO: Transfer more to this file (mainly from streamdeck-buttons.ts).
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const offsite_1 = __importDefault(require("./util/offsite"));
const replicants_1 = require("./util/replicants");
/**
 * Generate the text needed to be displayed on the "Player HUD Trigger - Message" button.
 * @returns String with title to use.
 */
function generatePlayerHudTriggerMessageTitle() {
    if (replicants_1.streamDeckData.value.playerHUDTriggerType === 'message') {
        return '(ACTIVE) Message to Read';
    }
    return 'Message to Read';
}
/**
 * Correctly changes the title text on the offsite "Player HUD Trigger - Messagee" buttons.
 */
function changePlayerHudTriggerMessageOffsiteTitle() {
    const title = generatePlayerHudTriggerMessageTitle();
    offsite_1.default.emit('title', { name: 'playerHudTriggerMessage', title });
}
offsite_1.default.on('authenticated', () => {
    changePlayerHudTriggerMessageOffsiteTitle();
});
offsite_1.default.on('playerHudTriggerMessage', () => {
    if (replicants_1.streamDeckData.value.playerHUDTriggerType === 'message') {
        delete replicants_1.streamDeckData.value.playerHUDTriggerType;
    }
    else {
        replicants_1.streamDeckData.value.playerHUDTriggerType = 'message';
    }
    offsite_1.default.emit('ack', {
        name: 'playerHudTriggerMessage',
        success: true,
        title: generatePlayerHudTriggerMessageTitle(),
    });
});
