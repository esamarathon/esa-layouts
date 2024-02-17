import AudioNormaliser from '@shared/extension/audio-normaliser';
import type { RunData } from 'speedcontrol-util/types';
import { lookupUsersByStr } from './server';
import { formatSrcomPronouns, formatUSD, getOtherStreamEventShort, logError } from './util/helpers';
import * as mqLogging from './util/mq-logging';
import { get as nodecg } from './util/nodecg';
import obs from './util/obs';
import { mq } from './util/rabbitmq';
import { bigbuttonPlayerMap, commentators, commentatorsNew, donationReader, donationReaderNew, donationTotal, horaroImportStatus, oengusImportStatus, otherStreamData, serverTimestamp, twitchAPIData, twitchChannelInfo, upcomingRunID } from './util/replicants';
import { sc } from './util/speedcontrol';

const config = nodecg().bundleConfig;
new AudioNormaliser(nodecg()); // eslint-disable-line no-new

// Increase max listeners on the nodecg-speedcontrol timer a bit to stop errors.
// This may want to be moved to that bundle directly in the future? It impacts all bundles!
sc.timer.setMaxListeners(20);

serverTimestamp.value = Date.now();
setInterval(() => { serverTimestamp.value = Date.now(); }, 100);

// Screened data from our moderation tool.
mq.evt.on('newScreenedSub', (data) => {
  nodecg().log.debug('[Misc] Received new subscription');
  nodecg().sendMessage('newSub', data);
});
mq.evt.on('newScreenedCheer', (data) => {
  nodecg().log.debug('[Misc] Received new cheer');
  nodecg().sendMessage('newCheer', data);
});

// Information that should come from our 2nd stream.
mq.evt.on('runChanged', (data) => {
  if (getOtherStreamEventShort() === data.event) {
    otherStreamData.value.runData = (data.run as RunData | undefined) || null;
    nodecg().log.debug('[Misc] Received modified run data from other stream');
  }
});
mq.evt.on('gameSceneChanged', (data) => {
  if (getOtherStreamEventShort() === data.event) {
    nodecg().log.debug('[Misc] Received game scene change from other stream:', data.action);
    if (data.action === 'start') {
      otherStreamData.value.show = true;
    } else if (data.action === 'end') {
      otherStreamData.value.show = false;
    }
  }
});

let init = false;
sc.runDataActiveRun.on('change', (newVal, oldVal) => {
  // Do some stuff when the run changes and not on the game layout scene (if OBS is connected).
  if (oldVal?.id !== newVal?.id
  && ((!obs.connected && init)
  || (obs.connected && !obs.isCurrentScene(config.obs.names.scenes.gameLayout)))) {
    // Only trigger these changes if the new run has a scheduled time, which means it was
    // imported from an external schedule. This stops manually added runs (like bonus runs)
    // Having things erased.
    if (sc.runDataActiveRun.value && newVal && newVal.scheduled) {
      if (config.event.shorts !== 'swcf') commentators.value.length = 0;
      // If not online and flagcarrier is enabled,
      // we also clear the teams and big button player map.
      if (!config.event.online && config.flagcarrier.enabled) {
        bigbuttonPlayerMap.value = {};
        // TODO: Reselecting the current run would overwrite these, but not much I can do right now!
        sc.runDataActiveRun.value.teams = [];
        nodecg().log.debug('[Misc] Removed active run teams on run change');
      }
      nodecg().log.debug('[Misc] Cleared commentators and big button player mapping');
    }
  }

  // This will also be triggered on server start up.
  // TODO: Move this to the start,
  //       so changes are not taken into account (if that is actually happening)?
  mqLogging.logRunChange(newVal);

  init = true;
});

// Update replicant that stores the ID of the upcoming run,
// both on timer stopping, if you somehow have no current run
// (usually if you're at the start of the run list),
// and also via a "force" button on the dashboard.
sc.on('timerStopped', () => {
  upcomingRunID.value = sc.runDataActiveRunSurrounding.value.next || null;
});
sc.runDataActiveRunSurrounding.on('change', (newVal) => {
  if (!newVal.current) {
    upcomingRunID.value = newVal.next || null;
  }
});
nodecg().listenFor('forceUpcomingRun', (id?: string) => {
  // Check supplied run ID exists in our array.
  const run = sc.runDataArray.value.find((r) => r.id === id);
  upcomingRunID.value = run?.id || null;
});

// Helper function to get pronouns of a specified user name from speedrun.com
// eslint-disable-next-line import/prefer-default-export
export async function searchSrcomPronouns(val: string): Promise<string> {
  const name = val.replace(/\((.*?)\)/g, '').trim();
  let pronouns = (val.match(/\((.*?)\)/g) || [])[0]?.replace(/[()]/g, '');
  if (!pronouns) {
    const data = await sc.sendMessage('srcomSearchForUserDataMultiple', [
      { type: 'twitch', val: name },
      { type: 'name', val: name },
    ]);
    pronouns = formatSrcomPronouns(data?.pronouns || '') || '';
  }
  // Allows the user to specify "(none)" and bypass a look-up.
  if (pronouns.toLowerCase().includes('none')) pronouns = '';
  return pronouns ? `${name} (${pronouns})` : name;
}

// Processes adding commentators from the dashboard panel.
nodecg().listenFor('commentatorAdd', async (val: string | null | undefined, ack) => {
  if (val) {
    if (config.server.enabled) {
      let user;
      try {
        [user] = (await lookupUsersByStr(val));
      } catch (err) {
        // catch
      }
      if (user) {
        // TODO: ALLOW PRONOUNS TO BE OVERRIDDEN!
        // TODO: Stop someone adding the same person twice.
        // Fix some flags which use a different format (mostly GB).
        let { country } = user;
        if (country && country.includes('-')) country = country.replace('-', '/');
        commentatorsNew.value.push({
          name: user.name,
          country: user.country || undefined,
          pronouns: user.pronouns || undefined,
        });
        // Old way for backwards compatibility.
        commentators.value.push(user.pronouns ? `${user.name} (${user.pronouns})` : user.name);
      } else {
        // TODO: user not found, process string as is!
        // str = val;
        // Old way for backwards compatibility.
        // commentators.value.push(val);
      }
    } else {
      // TODO: IMPLEMENT WITH NEW CHANGES!
      /* const str = await searchSrcomPronouns(val);
      if (!commentators.value.includes(str)) {
        commentators.value.push(str);
      } */
    }
  }
  if (ack && !ack.handled) {
    ack(null);
  }
});

nodecg().listenFor('commentatorRemove', (val: number, ack) => {
  commentatorsNew.value.splice(val, 1);
  commentators.value.splice(val, 1);
  if (ack && !ack.handled) {
    ack(null);
  }
});

// Processes modifying the reader from the dasboard panel.
nodecg().listenFor('readerModify', async (val: string | null | undefined, ack) => {
  if (!val) {
    donationReaderNew.value = null;
    donationReader.value = null;
  } else if (config.server.enabled) {
    let user;
    try {
      [user] = (await lookupUsersByStr(val));
    } catch (err) {
      // catch
    }
    if (user) {
      // TODO: ALLOW PRONOUNS TO BE OVERRIDDEN!
      // Fix some flags which use a different format (mostly GB).
      let { country } = user;
      if (country && country.includes('-')) country = country.replace('-', '/');
      donationReaderNew.value = {
        name: user.name,
        country: user.country || undefined,
        pronouns: user.pronouns || undefined,
      };
      // Old way for backwards compatibility.
      donationReader.value = user.pronouns ? `${user.name} (${user.pronouns})` : user.name;
    } else {
      // TODO: user not found, process string as is!
      // str = val;
      // Old way for backwards compatibility.
      // donationReader.value = val;
    }
  } else {
    // TODO: IMPLEMENT WITH NEW CHANGES!
    // donationReader.value = await searchSrcomPronouns(val);
  }
  if (ack && !ack.handled) {
    ack(null);
  }
});

async function changeTwitchMetadata(title?: string, gameId?: string): Promise<void> {
  try {
    let t = title || config.event.fallbackTwitchTitle;
    if (t) {
      // Lots below copied from nodecg-speedcontrol (with some minor modifications).
      // TODO: Expose a helper in that bundle to do this stuff instead.
      const runData = sc.getCurrentRun();
      const mentionChannels = true;
      const players = runData?.teams.map((team) => (
        team.players.map((player) => (mentionChannels && player.social.twitch
          ? `@${player.social.twitch}` : player.name)).join(', ')
      )).join(' vs. ') || 'Runs coming up!'; // "Fake" string to show when no runners active
      t = t
        .replace(/{{game}}/g, runData?.game || '') // Copied from SC
        .replace(/{{players}}/g, players) // Copied from SC
        .replace(/{{category}}/g, runData?.category || '') // Copied from SC
        .replace(/{{total}}/g, formatUSD(donationTotal.value, true)); // Original to this bundle
    } else {
      throw new Error('no title found to update to');
    }
    nodecg().log.debug('[Misc] Decided Twitch title is: %s - Decided game ID is %s', t, gameId);
    if (config.event.shorts === 'swcf') {
      nodecg().sendMessageToBundle(
        'twitchExternalMetadataAltMode',
        'esa-commercials',
        { title: (t as string)?.slice(0, 140), gameId },
      );
    } else {
      const data: { title: string, game_id?: string } = { title: (t as string)?.slice(0, 140) };
      if (gameId) data.game_id = gameId;
      const resp = await sc.sendMessage('twitchAPIRequest', {
        method: 'patch',
        endpoint: `/channels?broadcaster_id=${twitchAPIData.value.channelID}`,
        data,
        newAPI: true,
      });
      if (resp.statusCode !== 204) {
        throw new Error(JSON.stringify(resp.body));
      }
      // "New" API doesn't return anything so update the data with what we've got.
      twitchChannelInfo.value.title = (t as string)?.slice(0, 140) || '';
      if (gameId) twitchChannelInfo.value.game_id = gameId;
      // twitchChannelInfo.value.game_name = dir?.name || '';
    }
    nodecg().log.debug('[Misc] Twitch title/game updated');
  } catch (err) {
    logError('[Misc] Error updating Twitch channel information:', err);
  }
}

if (config.tracker.donationTotalInTitle) {
  // Used to change the Twitch title when requested by nodecg-speedcontrol.
  nodecg().listenFor('twitchExternalMetadata', 'nodecg-speedcontrol', async ({ title, gameID }: {
    channelID?: string,
    title?: string,
    gameID: string,
  }) => {
    nodecg().log.debug(
      '[Misc] Message received to change title/game, will attempt (title: %s, game id: %s)',
      title,
      gameID,
    );
    await changeTwitchMetadata(title, gameID);
  });

  // Used to change the Twitch title when the donation total updates.
  let donationTotalInit = false;
  donationTotal.on('change', async (val) => {
    if (donationTotalInit) {
      nodecg().log.debug('[Misc] Donation total updated to %s, will attempt to set title', val);
      await changeTwitchMetadata();
    }
    donationTotalInit = true;
  });
}

async function formatScheduleImportedPronouns(): Promise<void> {
  nodecg().log.info('[Misc] Schedule reimported, formatting pronouns');
  const runs = sc.getRunDataArray();
  for (const run of runs) {
    const { teams } = run;
    teams.forEach((team, x) => {
      team.players.forEach((player, y) => {
        // Even though the function is named "Srcom", this should also work
        // fine with those from Oengus imports as well.
        teams[x].players[y].pronouns = formatSrcomPronouns(player.pronouns);
      });
    });
    await sc.sendMessage('modifyRun', {
      runData: {
        ...run,
        teams,
      },
    });
  }
  nodecg().log.info('[Music] Schedule reimport pronoun formatting complete');
}

if (!config.server.enabled) {
  // If server integration is disabled, checks pronouns formatting on every schedule (re)import.
  horaroImportStatus.on('change', async (newVal, oldVal) => {
    if (oldVal && oldVal.importing && !newVal.importing) {
      await formatScheduleImportedPronouns();
    }
  });
  oengusImportStatus.on('change', async (newVal, oldVal) => {
    if (oldVal && oldVal.importing && !newVal.importing) {
      await formatScheduleImportedPronouns();
    }
  });
}
