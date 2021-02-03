import { Configschema } from 'configschema';
import SpeedcontrolUtil from 'speedcontrol-util';
import { RunDataPlayer } from 'speedcontrol-util/types';
import { ExtensionReturn as ExtensionReturnOBSN } from '../../../nodecg-obsninja/src/types';
import { ObsnRooms } from '../../../nodecg-obsninja/src/types/schemas';
import { get as nodecg } from './util/nodecg';

const obsn = nodecg().extensions['nodecg-obsninja'] as unknown as ExtensionReturnOBSN;
const sc = new SpeedcontrolUtil(nodecg());
const obsnRooms = nodecg().Replicant<ObsnRooms>('obsnRooms', 'nodecg-obsninja');
const cfg = nodecg().bundleConfig as Configschema;

async function setup(): Promise<void> {
  if (!cfg.obsn.enable) {
    return;
  }
  // Check that nodecg-obsninja is loaded.
  // Doing it this way because I don't want to specify it in bundleDependencies.
  while (typeof obsn === 'undefined') {
    await new Promise((res) => setTimeout(res, 1000));
  }

  // Create new rooms based on nodecg-speedcontrol information about the upcoming run.
  sc.runDataActiveRunSurrounding.on('change', async (newVal, oldVal) => {
    if (newVal.next && newVal.next !== oldVal?.next) {
      // If the run coming up was found and no room is currently created, make it.
      const room = obsnRooms.value.find((r) => r.externalId === newVal.next);
      const run = sc.runDataArray.value.find((r) => r.id === newVal.next);
      if (!room && run) {
        try {
          await obsn.sendMessage('createRoom', {
            name: `${run.game || 'N/A'} - ${run.category || 'N/A'}`,
            clients: run.teams
              .reduce<RunDataPlayer[]>((prev, curr) => prev.concat(curr.players), [])
              .map((p) => ({ name: p.name, camera: true, externalId: p.id })),
            externalId: run.id,
          });
        } catch (err) {
          // Catch error, so far none can be passed but this is for safety.
        }
      }
    }
  });

  // Change the active "current run" room based on nodecg-speedcontrol information.
  let init = false;
  sc.runDataActiveRun.on('change', async (newVal, oldVal) => {
    // This shouldn't trigger on initial start up, so should only happen on an *actual* run change.
    if (newVal && init) {
      // If there's no old run or we changed to a different run, and there's a OBSN room for it,
      // try to set the "current run" room to it.
      const room = obsnRooms.value.find((r) => r.externalId === newVal.id);
      if (room && (!oldVal || newVal.id !== oldVal.id)) {
        try {
          await obsn
            .sendMessage('changeActiveRoom', { type: 'video', key: 'currentRun', id: room.id });
          await obsn
            .sendMessage('changeActiveRoom', { type: 'audio', key: 'currentRun', id: room.id });
        } catch (err) {
          // Catch error, so far none can be passed but this is for safety.
        }
      }
    } else if (!newVal && init) {
      // Active run is removed, do we care here?
    }
    init = true;
  });
}

setup();
