import type { Configschema } from '@esa-layouts/types/schemas/configschema';
import { Client, Intents } from 'discord.js';
import mb from './util/mediabox';
import * as mqLogging from './util/mq-logging';
import { get as nodecg } from './util/nodecg';
import obs from './util/obs';

/**
 * Lots of stuff in this file right now is related to RabbitMQ.
 * TODO: Should this be moved somewhere else?
 */

const config = nodecg().bundleConfig as Configschema;
const discord = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

// Discord integration, used to listen for speedrunstore.com purchase notifications.
if (config.discord.enabled) {
  nodecg().log.info('[Media Box] Discord integration enabled');
  discord.on('ready', async () => {
    nodecg().log.info('[Media Box] Discord bot connection ready');
  });
  discord.on('error', () => {
    nodecg().log.warn('[Media Box] Discord bot connection error');
  });
  discord.on('disconnect', () => {
    nodecg().log.warn('[Media Box] Discord bot disconnected, will reconnect');
    setTimeout(() => {
      discord.login(config.discord.token);
    }, 10 * 1000);
  });
  discord.on('messageCreate', (msg) => {
    nodecg().log.debug(
      '[Media Box] Received Discord "messageCreate" event, '
        + 'id: %s - textChannelId: %s - webhookId: %s - content: %s',
      msg.id,
      msg.channelId,
      msg.webhookId,
      msg.content,
    );
    // if (msg.channelId === config.discord.textChannelId && msg.webhookId !== null) {
    if (msg.channelId === config.discord.textChannelId) {
      nodecg().log.debug(
        '[Media Box] Discord message with ID %s came from the correct channel',
        msg.id,
      );
      const user = msg.content.match(/\*(.*?)\*/g)?.[0].replace(/\*/g, '');
      const productName = msg.embeds?.[0]?.fields?.[0]?.name;
      const imgURL = msg.embeds?.[0]?.image?.url;
      nodecg().log.debug(
        '[Media Box] Information parsed from Discord message, '
          + 'user: %s - productName: %s - imgURL: %s',
        user,
        productName,
        imgURL,
      );
      if (user && productName && imgURL) {
        nodecg().log.debug('[Media Box] Discord message contained all correct info');
        mb.pushMerchPurchase({ user, productName, imgURL });
      }
    }
  });
  discord.login(config.discord.token);
}

/**
 * Check to know if a specified scene has sponsor logos in it or not.
 * @param name Name of scene to check; will be fully confirmed with OBS.
 */
function doesSceneHaveSponsorLogos(name?: string): boolean {
  if (!name) {
    return false;
  }
  // Hardcoded scenes that have sponsor logos on them as of "now".
  const scenes = [
    obs.findScene(config.obs.names.scenes.gameLayout),
    obs.findScene(config.obs.names.scenes.intermission),
    obs.findScene(config.obs.names.scenes.commercials),
  ];
  const namedScene = obs.findScene(name);
  return scenes.includes(namedScene);
}

// Will log sponsors changing when going live/going offline if needed.
obs.on('streamingStatusChanged', (streaming, old) => {
  if (doesSceneHaveSponsorLogos(obs.currentScene)
    && mb.mediaBox.value.current && typeof old === 'boolean') {
    if (streaming) {
      mqLogging.logSponsorLogoChange(mb.mediaBox.value.current);
    } else {
      mqLogging.logSponsorLogoChange();
    }
  }
});

// Will log sponsors changing when the scene changes if needed.
obs.on('currentSceneChanged', (current, last) => {
  if (obs.streaming && mb.mediaBox.value.current && last) {
    const currentHas = doesSceneHaveSponsorLogos(current);
    const lastHas = doesSceneHaveSponsorLogos(last);
    if (currentHas && !lastHas) {
      mqLogging.logSponsorLogoChange(mb.mediaBox.value.current);
    } else if (!currentHas && lastHas) {
      mqLogging.logSponsorLogoChange();
    }
  }
});

mb.mediaBox.on('change', (newVal, oldVal) => {
  if (newVal.current?.id !== oldVal?.current?.id
    && obs.streaming && doesSceneHaveSponsorLogos(obs.currentScene)) {
    mqLogging.logSponsorLogoChange(newVal.current);
  }
});
