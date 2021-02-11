import { Configschema } from 'configschema';
import { isEqual, throttle } from 'lodash';
import SpeedcontrolUtil from 'speedcontrol-util';
import { RunDataPlayer } from 'speedcontrol-util/types';
import { ExtensionReturn as ExtensionReturnOBSN } from '../../../nodecg-obsninja/src/types';
import { ActiveRooms, ObsnRooms } from '../../../nodecg-obsninja/src/types/schemas';
import { setFaderName } from './mixer';
import { get as nodecg } from './util/nodecg';
import obs from './util/obs';

const obsn = nodecg().extensions['nodecg-obsninja'] as unknown as ExtensionReturnOBSN;
const sc = new SpeedcontrolUtil(nodecg());
const obsnRooms = nodecg().Replicant<ObsnRooms>('obsnRooms', 'nodecg-obsninja');
const activeRooms = nodecg().Replicant<ActiveRooms>('activeRooms', 'nodecg-obsninja');
const cfg = nodecg().bundleConfig as Configschema;
const faders = [
  '/ch/01',
  '/ch/02',
  '/ch/03',
  '/ch/04',
  '/ch/05',
  '/ch/06',
  '/ch/07',
];
const defaultFaderNames = [
  'Ninja 1',
  'Ninja 2',
  'Ninja 3',
  'Ninja 4',
  'Ninja 5',
  'Ninja 6',
  'Ninja 7',
];

function getTotalDelay(room?: ObsnRooms[0]): number {
  if (!room?.delay.apply) {
    return 0;
  }
  return room.delay.base + room.delay.offset;
}

async function processCurrentRunAudioChange(
  newRoom?: ObsnRooms[0],
  oldRoom?: ObsnRooms[0],
): Promise<void> {
  faders.forEach((fader, i) => {
    setFaderName(fader, newRoom?.invitedClients[i]?.name || defaultFaderNames[i]);
  });
  if (obs.connected && getTotalDelay(newRoom) !== getTotalDelay(oldRoom)) {
    try {
      const settings = {
        source: 'Mics',
      };
      await obs.conn.send('SetSyncOffset', {
        ...settings,
        ...{
          // Using 1ms, OBS really doesn't like going directly up from 0 and it doesn't work.
          offset: 1 * 1000000,
        },
      });
      if (getTotalDelay(newRoom) !== 0) {
        await new Promise((res) => setTimeout(res, 500));
        await obs.conn.send('SetSyncOffset', {
          ...settings,
          ...{
            offset: getTotalDelay(newRoom) * 1000000, // Nanoseconds
          },
        });
      }
    } catch (err) {
      // catch
    }
  }
}

const processCurrentRunAudioChangeThrottle = throttle(
  processCurrentRunAudioChange, 20, { trailing: false },
);

async function processCurrentRunVideoChange(
  newRoom?: ObsnRooms[0],
  oldRoom?: ObsnRooms[0],
): Promise<void> {
  if (obs.connected && getTotalDelay(newRoom) !== getTotalDelay(oldRoom)) {
    try {
      const settings = {
        sourceName: 'OBSN Cameras',
        filterName: 'Camera Delay',
      };
      await obs.conn.send('SetSourceFilterSettings', {
        ...settings,
        ...{
          filterSettings: {
            delay_ms: 0,
          },
        },
      });
      if (getTotalDelay(newRoom) !== 0) {
        await new Promise((res) => setTimeout(res, 500));
        await obs.conn.send('SetSourceFilterSettings', {
          ...settings,
          ...{
            filterSettings: {
              delay_ms: getTotalDelay(newRoom),
            },
          },
        });
      }
    } catch (err) {
      // catch
    }
  }
}

const processCurrentRunVideoChangeThrottle = throttle(
  processCurrentRunVideoChange, 20, { trailing: false },
);

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

  obsnRooms.on('change', async (newVal, oldVal) => {
    const activeRoom = {
      audio: activeRooms.value.find((a) => a.type === 'audio' && a.key === 'currentRun'),
      video: activeRooms.value.find((a) => a.type === 'video' && a.key === 'currentRun'),
    };
    const roomNew = {
      audio: newVal.find((r) => r.id === activeRoom.audio?.id),
      video: newVal.find((r) => r.id === activeRoom.video?.id),
    };
    const roomOld = {
      audio: oldVal?.find((r) => r.id === activeRoom.audio?.id),
      video: oldVal?.find((r) => r.id === activeRoom.video?.id),
    };

    // If the current run audio room has changed at all, apply updates.
    if (!isEqual(roomNew.audio, roomOld.audio)) {
      await processCurrentRunAudioChangeThrottle(roomNew.audio, roomOld.audio);
    }

    // If the current run video room delay changed, apply updates.
    if (!isEqual(roomNew.video?.delay, roomOld.video?.delay)) {
      await processCurrentRunVideoChangeThrottle(roomNew.video, roomOld.video);
    }
  });

  activeRooms.on('change', async (newVal, oldVal) => {
    const activeRoomNew = {
      audio: newVal.find((a) => a.type === 'audio' && a.key === 'currentRun'),
      video: newVal.find((a) => a.type === 'video' && a.key === 'currentRun'),
    };
    const activeRoomOld = {
      audio: oldVal?.find((a) => a.type === 'audio' && a.key === 'currentRun'),
      video: oldVal?.find((a) => a.type === 'video' && a.key === 'currentRun'),
    };

    // If the current run room ID has changed, apply updates.
    if (activeRoomNew.audio?.id !== activeRoomOld.audio?.id) {
      const roomNew = obsnRooms.value.find((r) => r.id === activeRoomNew.audio?.id);
      const roomOld = obsnRooms.value.find((r) => r.id === activeRoomOld.audio?.id);
      await processCurrentRunAudioChangeThrottle(roomNew, roomOld);
    }
    if (activeRoomNew.video?.id !== activeRoomOld.video?.id) {
      const roomNew = obsnRooms.value.find((r) => r.id === activeRoomNew.video?.id);
      const roomOld = obsnRooms.value.find((r) => r.id === activeRoomOld.video?.id);
      await processCurrentRunVideoChangeThrottle(roomNew, roomOld);
    }
  });
}

setup();
