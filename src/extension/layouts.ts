import type { Configschema } from 'configschema';
import SpeedcontrolUtil from 'speedcontrol-util';
import { get as nodecg } from './util/nodecg';
import obs from './util/obs';
import { capturePositions, gameLayouts, nameCycle, obsData, upcomingRunID, videoPlayer } from './util/replicants'; // eslint-disable-line object-curly-newline, max-len

const evtConfig = (nodecg().bundleConfig as Configschema).event;
const obsConfig = (nodecg().bundleConfig as Configschema).obs;
const sc = new SpeedcontrolUtil(nodecg());

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
  // Online marathons are not currently using the same OBS logic.
  if (evtConfig.online || !val || !val['Game Layout']) {
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
    if (key.includes('Camera') && val['Game Layout'][key]) {
      // Cameras need cropping if not exactly 16:9.
      // Bigger than 16:9 need top/bottom cropping.
      // Smaller than 16:9 need left/right cropping.
      const webcamAR = val['Game Layout'][key].width / val['Game Layout'][key].height;
      if (webcamAR > (16 / 9)) {
        const newHeight = 1920 / webcamAR;
        const cropAmount = Math.floor((1080 - newHeight) / 2);
        crop.top = cropAmount;
        crop.bottom = cropAmount;
      } else if (webcamAR < (16 / 9)) {
        const newWidth = 1080 * webcamAR;
        const cropAmount = Math.floor((1920 - newWidth) / 2);
        crop.left = cropAmount;
        crop.right = cropAmount;
      }
    }

    try {
      await obs.configureSceneItem(
        obsConfig.names.scenes.gameLayout,
        obsSourceKeys[key],
        val['Game Layout'][key],
        crop,
        !!val['Game Layout'][key],
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
    && videoPlayer.value.selected && obs.isCurrentScene(obsConfig.names.scenes.commercials)) {
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
  if (obs.isCurrentScene(obsConfig.names.scenes.gameLayout)
    || obs.isCurrentScene(obsConfig.names.scenes.intermission)) {
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
    await obs.changeScene(name);
  } catch (err) {
    nodecg().log.warn('[Layouts] Could not change scene');
    nodecg().log.debug('[Layouts] Could not change scene:', err);
  }
});
