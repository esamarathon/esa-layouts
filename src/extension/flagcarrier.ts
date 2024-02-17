import { BigbuttonPlayerMap, Configschema } from '@esa-layouts/types/schemas';
import { FlagCarrier } from '@esamarathon/mq-events/types';
import clone from 'clone';
import { differenceWith } from 'lodash';
import { RunData, RunDataPlayer, RunDataTeam } from 'speedcontrol-util/types';
import type { DeepWritable } from 'ts-essentials';
import { v4 as uuid } from 'uuid';
import { lookupUserByID, lookupUsersByStr } from './server';
import { logError } from './util/helpers';
import { get as nodecg } from './util/nodecg';
import { mq } from './util/rabbitmq';
import { bigbuttonPlayerMap, donationReader } from './util/replicants';
import { sc } from './util/speedcontrol';

const router = nodecg().Router();
const config = nodecg().bundleConfig;
const allowedDevices = (() => {
  const cfg = (config as DeepWritable<Configschema>).flagcarrier.allowedDevices;
  return !Array.isArray(cfg) && typeof cfg === 'string' ? [cfg] : cfg || [];
})();
const buttonIds = config.flagcarrier.availableButtons.map((b) => b.id);

async function lookupUser(userId: string, displayName: string): Promise<any> {
  try {
    let user = await lookupUserByID(Number(userId));
    if (!user) [user] = await lookupUsersByStr(displayName);
    return user;
  } catch (err) {
    return undefined;
  }
}

// Function used if all player tags have been scanned, or a tech has forced this to run.
function mapScannedPlayersToTeams(run: RunData): void {
  const teams = clone(run.teams);
  const newTeams: RunDataTeam[] = [];
  // Go through each button and sort the teams in the correct order.
  // This assumes the button IDs can be sorted alphabetically.
  Object.keys(bigbuttonPlayerMap.value).sort().forEach((id) => {
    if (teams.length) {
      // Find which team has a player in it from this button ID, if any.
      const teamIndex = teams.findIndex((t) => t.players
        .find((p) => bigbuttonPlayerMap.value[id]
          .find((u) => Number(u.raw.user_id) === Number(p.customData.id))));
      // If team found, remove from search array and push to new array.
      if (teamIndex >= 0) {
        newTeams.push(clone(teams[teamIndex]));
        teams.splice(teamIndex, 1);
      }
    }
  });
  // If any teams left over, fill in button mapping with fake data,
  // and just push their names in current order back into the run data.
  if (teams.length) {
    const newMap = clone(bigbuttonPlayerMap.value);
    teams.forEach((team) => {
      newTeams.push(team);
      buttonIds.some((id) => {
        if (!newMap[id]?.length) {
          newMap[id] = team.players.map((p) => ({
            flagcarrier: {
              id,
              group: config.flagcarrier.group,
              time: {
                iso: (new Date()).toISOString(),
                unix: Date.now() / 1000,
              },
              uid: uuid(),
            },
            user: {
              displayName: p.name,
            },
            raw: {
              pronouns: p.pronouns || '',
            },
          }));
          return true;
        }
        return false;
      });
    });
    bigbuttonPlayerMap.value = clone(newMap);
  }
  // Finally, set these teams to the currently active run.
  if (sc.runDataActiveRun.value) sc.runDataActiveRun.value.teams = newTeams;
  nodecg().log.debug('[FlagCarrier] All players from run scanned in and teams mapped');
}

async function onBigButtonTagScanned(data: FlagCarrier.TagScanned): Promise<void> {
  // Stores a state for messages sent out at the bottom.
  let scanState: 'success_comm' | 'success_player' | 'fail_player' | undefined;
  // str = await searchSrcomPronouns(str);

  // Get the original run from the array (before the teams were removed).
  const currentRunInRunArray = sc.runDataArray.value
    .find((r) => r.id === sc.runDataActiveRun.value?.id);

  // Compile raw arrays of all players on the run for easy checking later.
  const allPlayersRun = currentRunInRunArray?.teams
    .reduce<RunDataPlayer[]>((prev, t) => prev.concat(...t.players), []);
  const player = allPlayersRun
    ?.find((p) => Number(p.customData.id) === Number(data.raw.user_id));

  // Check if teams haven't been mapped yet and the user is a player in this run,
  // and that the timer is stopped.
  if (player && currentRunInRunArray && !sc.getCurrentRun()?.teams.length
    && sc.timer.value.state === 'stopped') {
    const playerTeam = currentRunInRunArray.teams.find((t) => t.id === player?.teamID);
    const otherPlayersOnBtn = bigbuttonPlayerMap.value[data.flagcarrier.id] || [];
    const otherTeamPlayersOnBtn = otherPlayersOnBtn.filter((u) => playerTeam
      ?.players.find((p) => Number(p.customData.id) === Number(u.raw.user_id)));

    if (otherPlayersOnBtn.length !== otherTeamPlayersOnBtn.length) {
      // Error, player scanning into a button another team is already on.
      nodecg().log.warn(
        '[FlagCarrier] Scanned in user was player '
          + 'but button already occupied by another team (ButtonID: %s, Name: %s)',
        data.flagcarrier.id,
        data.user.displayName,
      );
      scanState = 'fail_player';
    } else {
      const newMap = clone(bigbuttonPlayerMap.value);

      // Delete scanned user from big button player map if already in a slot.
      Object.entries(newMap).forEach(([key, value]) => {
        const index = value.findIndex((p) => p.raw.user_id === data.raw.user_id);
        if (index >= 0) {
          newMap[key].splice(index, 1);
        }
      });

      // Add the scanned user into the big button player map in the correct slot.
      if (!newMap[data.flagcarrier.id]) {
        newMap[data.flagcarrier.id] = [];
      }
      newMap[data.flagcarrier.id].push(data);
      bigbuttonPlayerMap.value = clone(newMap);
      nodecg().log.debug(
        '[FlagCarrier] Player successfully scanned in (ButtonID: %s, Name: %s)',
        data.flagcarrier.id,
        data.user.displayName,
      );
      scanState = 'success_player';

      // All players scanned in?
      const allScannedPlayers = Object.values(bigbuttonPlayerMap.value)
        .reduce<BigbuttonPlayerMap[0]>((prev, b) => prev.concat(...b), []);
      const leftToScan = differenceWith(
        allPlayersRun,
        allScannedPlayers,
        (x, y) => Number(x.customData.id) === Number(y.raw.user_id),
      );
      if (!leftToScan.length) {
        mapScannedPlayersToTeams(currentRunInRunArray);
      }
    }
  // If not a player in the run and not already a commentator, adds them as one.
  } else if (!player) {
    const user = await lookupUser(data.raw.user_id, data.user.displayName);
    let str = '';
    if (user) {
      str = user.pronouns ? `${user.name} (${user.pronouns})` : user.name;
    } else {
      str = data.user.displayName;
    }
    // We show a "success" message to users even if the tag was already scanned, for simplicity.
    scanState = 'success_comm';
    // TODO: RE-ENABLE!
    /* if (!commentators.value.includes(str)) {
      commentators.value.push(str);
      nodecg().log.debug(
        '[FlagCarrier] Commentator successfully scanned in (ButtonID: %s, Name: %s)',
        data.flagcarrier.id,
        data.user.displayName,
      );
    } */
  }
  nodecg().sendMessage('bigbuttonTagScanned', {
    state: scanState,
    data,
  });
}

function generateUserTagMsg(btn: string, userName: string, userId: string): FlagCarrier.TagScanned {
  return {
    flagcarrier: {
      id: btn,
      group: config.flagcarrier.group,
      time: {
        iso: (new Date()).toISOString(),
        unix: Date.now() / 1000,
      },
      uid: uuid(),
    },
    user: {
      displayName: userName,
    },
    raw: {
      user_id: userId,
    },
  };
}

function setup(): void {
  // RabbitMQ events from the "big red buttons", used for players/commentators.
  mq.evt.on('bigbuttonTagScanned', async (data) => {
    if (!config.event.online && data.flagcarrier.group === config.flagcarrier.group) {
      await onBigButtonTagScanned(data);
    }
  });

  // Clears/resets big button player mapping and removes teams from active run.
  // This mimics what happens when a run is changed, as a backup for tech.
  nodecg().listenFor('bigbuttonResetPlayers', () => {
    if (sc.timer.value.state !== 'stopped') return; // Cannot make changes if timer is running.
    bigbuttonPlayerMap.value = {};
    if (!config.event.online && sc.runDataActiveRun.value) {
      sc.runDataActiveRun.value.teams = [];
    }
  });

  nodecg().listenFor(
    'bigButtonManualAssign',
    async ({ btn, player }: { btn: string, player: RunDataPlayer }) => {
      const data = generateUserTagMsg(btn, player.name, player.customData.id);
      await onBigButtonTagScanned(data);
    },
  );

  // Triggered via the dashboard to manually "finish" the scanning process,
  // which will fill in missing players/teams if needed.
  nodecg().listenFor('bigbuttonForceFillPlayers', () => {
    // Get the original run from the array (before the teams were removed).
    const currentRunInRunArray = sc.runDataArray.value
      .find((r) => r.id === sc.runDataActiveRun.value?.id);
    if (currentRunInRunArray) {
      mapScannedPlayersToTeams(currentRunInRunArray);
    }
  });

  // HTTP endpoint, used for donation readers.
  router.post('/flagcarrier', async (req, res) => {
    const device = req.body.device_id as string;
    const action = req.body.action as string;
    if (allowedDevices.length && !allowedDevices.includes(device)) {
      logError(
        '[FlagCarrier] Device ID "%s" tried to change users but was denied',
        req.body,
        device,
      );
      return res.status(403).send('Device ID is not allowed to make changes.');
    }
    if (req.body.group_id !== config.flagcarrier.group) {
      return res.status(400).send('Group ID supplied not used on this endpoint.');
    }

    // clear, login_clear
    // Unfortunately currently flagcarrier's "clear" command is for an entire group,
    // but because we only serve donation reader here, we're OK.
    if (action.endsWith('clear')) {
      donationReader.value = null;
      nodecg().log.info('[FlagCarrier] Donation reader was cleared (DeviceID: %s)', device);
      // If not also a login command, will respond with this message.
      if (action !== 'login_clear') {
        return res.send('Donation reader has been cleared.');
      }
    }

    // Donation Reader: login, login_clear
    if (req.body.position === 'reader' && action.startsWith('login')) {
      try {
        const data = req.body.tag_data;
        const user = await lookupUser(data.user_id, data.display_name);
        let str = '';
        if (user) str = user.pronouns ? `${user.name} (${user.pronouns})` : user.name;
        else str = data.user.displayName;
        // donationReader.value = await searchSrcomPronouns(str);
        // donationReader.value = str; // TODO: RE-ENABLE!
        nodecg().log.info(
          '[FlagCarrier] Donation reader was updated (Name: %s, DeviceID: %s)',
          str,
          device,
        );
        return res.send('You\'ve been logged in.');
      } catch (err) {
        return res.send('Error logging in.');
      }
    }
    // Reject other positions.
    if (req.body.position !== 'reader') {
      return res.status(400).send('Position not used on this endpoint.');
    }

    // Reject anything else.
    return res.status(400).send('Request not applicable to this endpoint.');
  });

  nodecg().mount(`/${nodecg().bundleName}`, router);
}

if (config.flagcarrier.enabled) {
  setup();
  nodecg().log.info(
    '[FlagCarrier] Integration enabled (target URL: %s://%s/%s/flagcarrier)',
    nodecg().config.ssl?.enabled ? 'https' : 'http',
    nodecg().config.baseURL,
    nodecg().bundleName,
  );
}
