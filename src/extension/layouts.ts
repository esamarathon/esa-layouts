/* eslint-disable no-await-in-loop */
import { Configschema } from 'configschema';
import SpeedcontrolUtil from 'speedcontrol-util';
import { get as nodecg } from './util/nodecg';
import obs from './util/obs';
import { capturePositions, gameLayouts, obsData, videoPlayer } from './util/replicants';

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
const obsGameLayoutScene = obsConfig.names.scenes.gameLayout;

// nodecg-speedcontrol no longer sends forceRefreshIntermission so doing it here instead.
sc.on('timerStopped', () => {
  nodecg().sendMessage('forceRefreshIntermission');
});

/**
 * Helper function used by modifyCaptures.
 * Resets the scene item, then sets some properties if possible.
 * @param scene Name of scene item is in
 * @param item Name of item
 * @param area Area object (as used in capturePositions): x, y, width, height
 * @param crop Crop object: top, bottom, left, right
 * @param visible If the source should be visible or not
 */
async function configureSceneItem(
  scene: string,
  item: string,
  area?: {
    x: number;
    y: number;
    width: number;
    height: number;
  },
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  },
  visible?: boolean,
): Promise<void> {
  try {
    if (area) {
      await obs.send('ResetSceneItem', {
        'scene-name': scene,
        item,
      });
    }
    // @ts-ignore: Typings say we need to specify more than we actually do.
    await obs.send('SetSceneItemProperties', {
      'scene-name': scene,
      item,
      visible: typeof visible !== 'undefined' ? visible : true,
      position: (area) ? {
        x: area.x,
        y: area.y,
      } : {},
      bounds: (area) ? {
        type: 'OBS_BOUNDS_STRETCH',
        x: area.width,
        y: area.height,
      } : {},
      crop: crop || {},
    });
  } catch (err) {
    nodecg().log.warn('[Layouts] Cannot successfully configure scene item:', err);
  }
}

// Change the game layout based on information supplied via the run data.
// TO SEE: Do we need "overridden" anymore, besides for informational purposes?
let init = false;
sc.runDataActiveRun.on('change', (newVal, oldVal) => {
  // This shouldn't trigger on initial start up, so should only happen on an *actual* run change.
  if (newVal && init) {
    // If we've changed to a new run, override the overridden value (heh).
    gameLayouts.value.overridden = false;

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
  if (!val || !val['Game Layout']) {
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

    await configureSceneItem(
      obsGameLayoutScene,
      obsSourceKeys[key],
      val['Game Layout'][key],
      crop,
      !!val['Game Layout'][key],
    );
  }
});

// Switch to the video player scene if there is a selected video when intermission commercials end.
sc.twitchCommercialTimer.on('change', async (newVal, oldVal) => {
  if (oldVal && oldVal.secondsRemaining > 0 && newVal.secondsRemaining <= 0
    && videoPlayer.value.selected
    && obsData.value.scene?.startsWith(obsConfig.names.scenes.commercials)) {
    try {
      await obs.changeScene(obsConfig.names.scenes.videoPlayer);
    } catch (err) {
      nodecg().log.warn('[Layouts] Could not switch to video player scene'
        + ' after intermission commercials');
      nodecg().log.debug('[Layouts] Could not switch to video player scene'
      + ' after intermission commercials:', err);
    }
  }
});
