import { BigbuttonPlayerMap, Configschema } from '@esa-layouts/types/schemas';
import clone from 'clone';
import { differenceWith } from 'lodash';
import { RunDataPlayer, RunDataTeam } from 'speedcontrol-util/types';
import { logError } from './util/helpers';
import { get as nodecg } from './util/nodecg';
import { mq } from './util/rabbitmq';
import { bigbuttonPlayerMap, commentators, donationReader } from './util/replicants';
import { sc } from './util/speedcontrol';

const router = nodecg().Router();
const config = nodecg().bundleConfig as Configschema;
const allowedDevices = !Array.isArray(config.flagcarrier.allowedDevices)
  && typeof config.flagcarrier.allowedDevices === 'string'
  ? [config.flagcarrier.allowedDevices]
  : config.flagcarrier.allowedDevices || [];

function setup(): void {
  // RabbitMQ events from the "big red buttons", used for players/commentators.
  mq.evt.on('bigbuttonTagScanned', async (data) => {
    if (config.event.thisEvent === 1 && data.flagcarrier.group === 'stream1') {
      const name = data.user.displayName;
      const pronouns = data.raw.pronouns as string | undefined;
      const str = pronouns ? `${name} (${pronouns})` : name;
      // str = await searchSrcomPronouns(str);
      nodecg().sendMessage('bigbuttonTagScanned', { id: data.flagcarrier.id, str });

      // Get the original run from the array (before the teams were removed).
      const currentRunInRunArray = sc.runDataArray.value
        .find((r) => r.id === sc.runDataActiveRunSurrounding.value.current);

      // Delete scanned user from big button player map if already in a slot.
      Object.entries(bigbuttonPlayerMap.value).forEach(([key, value]) => {
        const index = value.findIndex((p) => p.user.displayName === data.user.displayName);
        if (index >= 0) {
          bigbuttonPlayerMap.value[key].splice(index, 1);
        }
      });
      // Check if scanned in user is a player in the active run.
      const player = currentRunInRunArray?.teams.find((t) => t.players
        .find((p) => p.name.toLowerCase() === data.user.displayName.toLowerCase()));
      // If a player is in the active run and the teams haven't been mapped yet.
      if (currentRunInRunArray && player && !sc.getCurrentRun()?.teams.length) {
        // Add the scanned user into the big button player map in the correct slot.
        if (!bigbuttonPlayerMap.value[data.flagcarrier.id]) {
          bigbuttonPlayerMap.value[data.flagcarrier.id] = [];
        }
        bigbuttonPlayerMap.value[data.flagcarrier.id].push(data);

        // See if all players have been scanned in yet.
        const allPlayersRun = currentRunInRunArray.teams
          .reduce<RunDataPlayer[]>((prev, team) => prev.concat(...team.players), []);
        const allScannedPlayers = Object.values(bigbuttonPlayerMap.value)
          .reduce<BigbuttonPlayerMap[0]>((prev, button) => prev.concat(...button), []);
        // All players scanned in?
        const leftToScan = differenceWith(allPlayersRun, allScannedPlayers, (x, y) => x.name
          .toLowerCase() === y.user.displayName.toLowerCase());
        if (!leftToScan.length) {
          const teams = clone(currentRunInRunArray.teams);
          let newTeams: RunDataTeam[] = [];
          // Go through each button and sort the teams in the correct order.
          // This assumes the button IDs can be sorted alphabetically.
          Object.keys(bigbuttonPlayerMap.value).sort().forEach((id) => {
            if (teams.length) {
              // Find which team has a player in it from this button ID, if any.
              const teamIndex = teams.findIndex((t) => t.players
                .find((p) => bigbuttonPlayerMap.value[id]
                  .find((u) => u.user.displayName.toLowerCase() === p.name.toLowerCase())));
              // If team found, remove from search array and push to new array.
              if (teamIndex >= 0) {
                newTeams.push(clone(teams[teamIndex]));
                teams.splice(teamIndex, 1);
              }
            }
          });
          // Replace pronouns if any are found on the tags.
          newTeams = newTeams.map((team) => ({
            ...team,
            players: team.players.map((p) => {
              const scanned = allScannedPlayers
                .find((u) => u.user.displayName.toLowerCase() === p.name.toLowerCase());
              return {
                ...p,
                pronouns: scanned ? (scanned.raw.pronouns || '') : p.pronouns,
              };
            }),
          }));
          // Finally, set these teams to the currently active run.
          if (sc.runDataActiveRun.value) sc.runDataActiveRun.value.teams = newTeams;
        }
      // If not a player in the run and not already a commentator, adds them as one.
      } else if (!commentators.value.includes(str)) {
        commentators.value.push(str);
        nodecg().log.debug('[FlagCarrier] Added new commentator:', str);
      }
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
      const data = req.body.tag_data;
      const str = data.pronouns ? `${data.display_name} (${data.pronouns})` : data.display_name;
      // donationReader.value = await searchSrcomPronouns(str);
      donationReader.value = str;
      nodecg().log.info(
        '[FlagCarrier] Donation reader was updated (Name: %s, DeviceID: %s)',
        str,
        device,
      );
      return res.send('You\'ve been logged in.');
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
