import type { Configschema } from '@esa-layouts/types/schemas/configschema';
import Countdown from '@esamarathon/esa-layouts-shared/countdown/extension';
import clone from 'clone';
import SpeedcontrolUtil from 'speedcontrol-util';
import { toggleLiveMics } from './mixer';
import { logError } from './util/helpers';
import { get as nodecg } from './util/nodecg';
import obs from './util/obs';
import { capturePositions, currentRunDelay, delayedTimer, gameLayouts, nameCycle, obsData, upcomingRunID, videoPlayer } from './util/replicants'; // eslint-disable-line object-curly-newline, max-len

const cfg = nodecg().bundleConfig as Configschema;
const evtConfig = (nodecg().bundleConfig as Configschema).event;
const obsConfig = (nodecg().bundleConfig as Configschema).obs;
const sc = new SpeedcontrolUtil(nodecg());
const countdown = new Countdown(nodecg()); // eslint-disable-line @typescript-eslint/no-unused-vars

// CSS ID -> OBS source name mapping
const obsSourceKeys: { [key: string]: string } = {
  GameCapture1: obsConfig.names.sources.gameCapture1,
  GameCapture2: obsConfig.names.sources.gameCapture2,
  GameCapture3: obsConfig.names.sources.gameCapture3,
  GameCapture4: obsConfig.names.sources.gameCapture4,
  CameraCapture1: obsConfig.names.sources.cameraCapture1,
  CameraCapture2: obsConfig.names.sources.cameraCapture2,
};

// Controls the name cycling ticks for players/hosts
function cycleNames(reset = false): void {
  let cycle = 0;
  if (!reset) {
    cycle = nameCycle.value + 1;
  }
  if (cycle === 0) { // Name
    setTimeout(cycleNames, 45 * 1000);
  } else if (cycle === 1) { // Twitch
    setTimeout(cycleNames, 15 * 1000);
  } else {
    cycleNames(true);
    return;
  }
  nameCycle.value = cycle;
}
cycleNames(true);

// This code keeps a delayed copy of the timer synced to a delay value from OBS.Ninja.
const timerDelayTO: { delay: number, timeout: NodeJS.Timeout }[] = [];
delayedTimer.value = clone(sc.timer.value);
currentRunDelay.on('change', (newVal, oldVal) => {
  if (newVal.video !== oldVal?.video && timerDelayTO.length) {
    // Reset delayed timer to the same as normal timer.
    delayedTimer.value = clone(sc.timer.value);

    // Clear all the irrelevant timeouts currently active.
    const timeouts: NodeJS.Timeout[] = [];
    for (let i = 0; i < timerDelayTO.length;) {
      if (timerDelayTO[i] && timerDelayTO[i].delay !== newVal.video) {
        timeouts.push(timerDelayTO.shift()?.timeout as NodeJS.Timeout);
      } else {
        i += 1;
      }
    }
    timeouts.forEach((timeout) => clearTimeout(timeout));
  }
});
sc.timer.on('change', (val) => {
  const timerFreeze = clone(val);
  if (currentRunDelay.value.video === 0) {
    delayedTimer.value = timerFreeze;
  } else {
    timerDelayTO.push({
      delay: currentRunDelay.value.video,
      timeout: setTimeout(() => { delayedTimer.value = timerFreeze; }, currentRunDelay.value.video),
    });
  }
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

// Change the game layout based on information supplied via the run data.
let init = false;
sc.runDataActiveRun.on('change', (newVal, oldVal) => {
  // This shouldn't trigger on initial start up, so should only happen on an *actual* run change.
  if (newVal && init) {
    // If there's no old run or we changed to a different run, try to automatically set the layout.
    if (!oldVal || newVal.id !== oldVal.id) {
      const layout = gameLayouts.value.available.find((l) => l.code === newVal.customData.layout);
      gameLayouts.value.selected = layout?.code;
      if (newVal.customData.layout && !layout) {
        nodecg().log.warn('[Layouts] Run specified game layout with code '
          + `${newVal.customData.layout} but none available`);
      } else if (newVal.customData.layout && layout) {
        nodecg().log.info(`[Layouts] Game layout changed to ${layout.name} (${layout.code})`);
      }
    }
  } else if (!newVal && init) {
    // If the active run is removed, return to selecting "nothing"
    // (graphic will reselect the default).
    delete gameLayouts.value.selected;
  }
  init = true;
});

capturePositions.on('change', async (val) => {
  if ((evtConfig.online && evtConfig.online === 'partial') || !val || !val['game-layout']) {
    return;
  }
  for (const key of Object.keys(obsSourceKeys)) {
    const crop = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    };
    // If this is a camera, it may need cropping.
    if (key.includes('Camera') && val['game-layout'][key]) {
      try {
        // Cameras need cropping if not exactly 16:9.
        // Bigger than 16:9 need top/bottom cropping.
        // Smaller than 16:9 need left/right cropping.
        const sceneItemProperties = await obs.conn.send('GetSceneItemProperties', {
          'scene-name': obsConfig.names.scenes.gameLayout,
          item: { name: obsSourceKeys[key] },
        });
        const cameraAR = sceneItemProperties.sourceWidth / sceneItemProperties.sourceHeight;
        const areaAR = val['game-layout'][key].width / val['game-layout'][key].height;
        if (areaAR > cameraAR) {
          const newHeight = sceneItemProperties.sourceWidth / areaAR;
          const cropAmount = Math.floor((sceneItemProperties.sourceHeight - newHeight) / 2);
          crop.top = cropAmount;
          crop.bottom = cropAmount;
        } else if (areaAR < cameraAR) {
          const newWidth = sceneItemProperties.sourceHeight * areaAR;
          const cropAmount = Math.floor((sceneItemProperties.sourceWidth - newWidth) / 2);
          crop.left = cropAmount;
          crop.right = cropAmount;
        }
      } catch (err) {
        nodecg().log.warn(`[Layouts] Cannot successfuly find camera source to crop [${key}]`);
        nodecg().log
          .debug(`[Layouts] Cannot successfuly find camera source to crop [${key}]:`, err);
      }
    }

    try {
      await obs.configureSceneItem(
        obsConfig.names.scenes.gameLayout,
        obsSourceKeys[key],
        (() => {
          if (key.startsWith('GameCapture')
          && ['DS-1p', '3DS-1p'].includes(gameLayouts.value.selected || '')) {
            if (key === 'GameCapture1') {
              return {
                x: 0, y: 0, width: 1920, height: 1080,
              };
            }
            return undefined;
          }
          return val['game-layout'][key];
        })(),
        crop,
        (() => {
          if (key.startsWith('GameCapture')
          && ['DS-1p', '3DS-1p'].includes(gameLayouts.value.selected || '')) {
            if (key === 'GameCapture1') {
              return true;
            }
            return false;
          }
          return !!val['game-layout'][key];
        })(),
      );
    } catch (err) {
      nodecg().log.warn(`[Layouts] Cannot successfully configure capture position [${key}]`);
      nodecg().log.debug(`[Layouts] Cannot successfully configure capture position [${key}]:`, err);
    }
  }
});

sc.twitchCommercialTimer.on('change', async (newVal, oldVal) => {
  // Disable transitioning if on commercials scene and seconds are on the commercial timer.
  if (obs.isCurrentScene(obsConfig.names.scenes.commercials)) {
    obsData.value.disableTransitioning = newVal.secondsRemaining > 0;
  }

  // Switch to the video player scene if there is
  // a selected video when intermission commercials end.
  if (oldVal && oldVal.secondsRemaining > 0 && newVal.secondsRemaining <= 0
    && videoPlayer.value.playlist.length
    && obs.isCurrentScene(obsConfig.names.scenes.commercials)) {
    try {
      await obs.changeScene(obsConfig.names.scenes.videoPlayer);
      obsData.value.disableTransitioning = true;
    } catch (err) {
      nodecg().log.warn('[Layouts] Could not switch to video player scene'
        + ' after intermission commercials');
      nodecg().log.debug('[Layouts] Could not switch to video player scene'
      + ' after intermission commercials:', err);
    }
  }
});

// Enable transitioning if we just changed to
// the game layout or intermission (without commercials).
obs.on('currentSceneChanged', () => {
  if (!obs.isCurrentScene(obsConfig.names.scenes.videoPlayer)) {
    obsData.value.disableTransitioning = false;
  }
});

nodecg().listenFor('obsChangeScene', async (name: string) => {
  // Don't change scene if identical, we're currently transitioning, or transitioning is disabled.
  if (obsData.value.scene === name
    || obsData.value.transitioning
    || obsData.value.disableTransitioning) {
    return;
  }
  try {
    if (currentRunDelay.value.audio === 0
      || (!obs.isCurrentScene(obsConfig.names.scenes.gameLayout)
      && obs.findScene(name) !== obsConfig.names.scenes.gameLayout)) {
      await obs.changeScene(name);
    } else {
      const delay = currentRunDelay.value.audio;
      obsData.value.disableTransitioning = true;
      obsData.value.transitionTimestamp = Date.now() + delay;
      if (cfg.obsn.enable && cfg.x32.enable && cfg.event.online !== 'partial') {
        if (cfg.obsn.buffer <= 0) {
          toggleLiveMics(name);
        } else {
          setTimeout(() => { toggleLiveMics(name); }, cfg.obsn.buffer);
        }
      }
      setTimeout(async () => {
        try {
          await obs.changeScene(name);
        } catch (err) {
          logError('[Layouts] Could not change scene (on delay) [name: %s]', err, name);
        }
      }, delay);
    }
  } catch (err) {
    logError('[Layouts] Could not change scene [name: %s]', err, name);
  }
});
