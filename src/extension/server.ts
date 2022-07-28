import { Configschema } from '@esa-layouts/types/schemas';
import needle from 'needle';
import { get as nodecg } from './util/nodecg';
import { horaroImportStatus } from './util/replicants';
import { sc } from './util/speedcontrol';

const config = (nodecg().bundleConfig as Configschema).server;

export async function lookupUserByID(id: number): Promise<any> {
  const resp = await needle(
    'get',
    `${config.address}/users/${id}`,
    {
      headers: {
        Authorization: `Bearer ${config.key}`,
      },
    },
  );
  return resp.body.data;
}

export async function lookupUsersByStr(str: string): Promise<any[]> {
  const resp = await needle(
    'get',
    `${config.address}/users?search=${str}`,
    {
      headers: {
        Authorization: `Bearer ${config.key}`,
      },
    },
  );
  return resp.body.data;
}

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
      teams.forEach((team, x) => {
        team.players.forEach((player, y) => {
          teams[x].players[y].customData.id = userIds[i];
          if (userDataArr[i] !== null) {
            // Fix some flags which use a different format (mostly GB).
            let { country } = userDataArr[i];
            if (country && country.includes('-')) country = country.replace('-', '/');
            teams[x].players[y].name = userDataArr[i].name;
            teams[x].players[y].country = country || undefined;
            teams[x].players[y].pronouns = userDataArr[i].pronouns || undefined;
            teams[x].players[y].social.twitch = userDataArr[i].twitch?.displayName || undefined;
          }
          i += 1;
        });
      });
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
