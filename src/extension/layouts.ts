import SpeedcontrolUtil from 'speedcontrol-util';
import { get as nodecg } from './util/nodecg';
import { gameLayouts } from './util/replicants';

// const obsConfig = (nodecg().bundleConfig as Configschema).obs;
const sc = new SpeedcontrolUtil(nodecg());

/* interface GameLayoutChange {
  cssID: string;
  cssClass: string;
  sizes: {
    x: number;
    y: number;
    width: number;
    height: number;
    top: number;
    right: number;
    bottom: number;
    left: number;
  } | null;
} */

// CSS ID -> OBS group name mapping
/* const obsGroupKeys: { [key: string]: string } = {
  GameCapture1: obsConfig.names.sources.gameCapture1,
  GameCapture2: obsConfig.names.sources.gameCapture2,
  GameCapture3: obsConfig.names.sources.gameCapture3,
  GameCapture4: obsConfig.names.sources.gameCapture4,
  CameraCapture1: obsConfig.names.sources.cameraCapture1,
  CameraCapture2: obsConfig.names.sources.cameraCapture2,
};
const obsGameLayoutScene = obsConfig.names.scenes.gameLayout; */

// nodecg-speedcontrol no longer sends forceRefreshIntermission so doing it here instead.
sc.on('timerStopped', () => {
  nodecg().sendMessage('forceRefreshIntermission');
});

// Triggered when the game layout page is opened;
// we need to toggle the visibility to off for all captures.
/* nodecg().listenFor('hideAllCaptures', async (value, ack) => {
  const keyMap = Object.keys(obsGroupKeys).map((key) => {
    return obsGroupKeys[key];
  });
  for await (const item of keyMap) {
    try {
      await obs.hideItemInScene(item, obsGameLayoutScene);
    } catch (err) {}
  }
  if (ack && !ack.handled) {
    ack(null);
  }
}); */

// Triggered when the capture parts of the game layout in the browser move around.
/* nodecg().listenFor('captureChange', async (opts: GameLayoutChange) => {
  // If no sizes are specified, we want to disable it's visibility.
  if (!opts.sizes) {
    try {
      await obs.hideItemInScene(obsGroupKeys[opts.cssID], obsGameLayoutScene);
    } catch (err) {}
  } else {
    try {
      const crop = { top: 0, right: 0, bottom: 0, left: 0 };
      // If this is a camera, it may need cropping.
      if (opts.cssClass === 'CameraCapture') {
        // Cameras need cropping if not exactly 16:9.
        // Bigger than 16:9 need top/bottom cropping.
        // Smaller than 16:9 need left/right cropping.
        const webcamAR = opts.sizes.width / opts.sizes.height;
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

      await obs.setUpCaptureInScene(obsGroupKeys[opts.cssID], obsGameLayoutScene, {
        x: opts.sizes.x,
        y: opts.sizes.y,
        width: opts.sizes.width,
        height: opts.sizes.height,
        croptop: crop.top,
        cropright: crop.right,
        cropbottom: crop.bottom,
        cropleft: crop.left,
      });
    } catch (err) {}
  }
}); */


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
