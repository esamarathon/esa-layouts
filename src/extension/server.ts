import needle from 'needle';
import { get as nodecg } from './util/nodecg';
import { horaroImportStatus } from './util/replicants';
import { sc } from './util/speedcontrol';

const config = nodecg().bundleConfig;

export async function lookupUserByID(id: number): Promise<any> {
  if (!config.server.enabled) throw new Error('server integration disabled');
  const resp = await needle(
    'get',
    `${config.server.address}/users/${id}`,
    {
      headers: {
        Authorization: `Bearer ${config.server.key}`,
      },
    },
  );
  return resp.body.data;
}

export async function lookupUsersByStr(str: string): Promise<any[]> {
  if (!config.server.enabled) throw new Error('server integration disabled');
  const resp = await needle(
    'get',
    `${config.server.address}/users?search=${str}`,
    {
      headers: {
        Authorization: `Bearer ${config.server.key}`,
      },
    },
  );
  return resp.body.data;
}

if (config.server.enabled) {
  horaroImportStatus.on('change', async (newVal, oldVal) => {
    if (oldVal && oldVal.importing && !newVal.importing) {
      nodecg().log.info('[Server] Schedule reimported, looking up user information');
      const runs = sc.getRunDataArray();
      for (const run of runs) {
        const userIds = run.customData.userIds ? run.customData.userIds.split(',') : [];
        const userDataArr: any[] = [];
        for (const id of userIds) {
          try {
            if (Number(id) > 0) {
              // 500ms wait to not hammer the server
              await new Promise((res) => { setTimeout(res, 500); });
              const userData = await lookupUserByID(Number(id));
              userDataArr.push(userData);
            } else {
              userDataArr.push(null);
            }
          } catch (err) {
            // error
            userDataArr.push(null);
          }
        }
        let i = 0;
        const { teams } = run;
        for (const [x, team] of teams.entries()) {
          for (const [y, player] of team.players.entries()) {
            teams[x].players[y].customData.id = userIds[i];
            let userData = userDataArr[i];
            if (!userData && config.event.shorts === 'swcf') {
              try {
                // 500ms wait to not hammer the server
                await new Promise((res) => { setTimeout(res, 500); });
                userData = (await lookupUsersByStr(player.name.toLowerCase()))[0] || null;
              } catch (err) {
                userData = null;
              }
            }
            if (userData) {
              // Fix some flags which use a different format (mostly GB).
              let { country } = userData;
              if (country && country.includes('-')) country = country.replace('-', '/');
              teams[x].players[y].name = userData.name;
              teams[x].players[y].country = country || undefined;
              teams[x].players[y].pronouns = userData.pronouns || undefined;
              teams[x].players[y].social.twitch = userData.twitch?.displayName || undefined;
            }
            i += 1;
          }
        }
        await sc.sendMessage('modifyRun', {
          runData: {
            ...run,
            teams,
          },
        });
      }
      nodecg().log.info('[Server] Schedule reimport user information lookup complete');
    }
  });
}
