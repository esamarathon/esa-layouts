import speedcontrolUtil from 'speedcontrol-util';
import { Commentators } from '../../schemas';
import * as nodecgApiContext from './util/nodecg-api-context';
import { bundleConfig } from './util/nodecg-bundleconfig';
import obs from './util/obs';
import { mq } from './util/rabbitmq';

const nodecg = nodecgApiContext.get();
const sc = new speedcontrolUtil(nodecg);
const currentScene = nodecg.Replicant<string>('currentOBSScene'); // temp
const currentLayout = nodecg.Replicant<string>('currentLayout'); // schema this!
const currentLayoutOverridden = nodecg.Replicant<boolean>('currentLayoutOverridden');
const commentators = nodecg.Replicant<Commentators>('commentators');
let lastScene: string | undefined;
let commercialTO: NodeJS.Timeout;

interface GameLayoutChange {
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
}

// CSS ID -> OBS group name mapping
const obsGroupKeys: { [key: string]: string } = {
  GameCapture1: bundleConfig.obs.names.groups.gameCapture1,
  GameCapture2: bundleConfig.obs.names.groups.gameCapture2,
  GameCapture3: bundleConfig.obs.names.groups.gameCapture3,
  GameCapture4: bundleConfig.obs.names.groups.gameCapture4,
  CameraCapture1: bundleConfig.obs.names.groups.cameraCapture1,
  CameraCapture2: bundleConfig.obs.names.groups.cameraCapture2,
};

// nodecg-speedcontrol no longer sends forceRefreshIntermission so doing it here instead
sc.on('timerStopped', () => {
  nodecg.sendMessage('forceRefreshIntermission');
});

obs.on('SwitchScenes', (data) => {
  lastScene = currentScene.value;
  currentScene.value = data['scene-name'];

  // Trigger Twitch ads when on the relevant scene.
  if (currentScene.value === bundleConfig.obs.names.scenes.ads) {
    // TODO: add this to speedcontrol-util.
    nodecg.sendMessageToBundle('twitchStartCommercial', 'nodecg-speedcontrol', { duration: 180 });
  }

  // Enable/disable nodecg-speedcontrol timer changes if on/not on a game layout scene.
  if (currentScene.value.includes(bundleConfig.obs.names.scenes.gameLayout)) {
    sc.enableTimerChanges();
  } else {
    sc.disableTimerChanges();
  }
});

// Triggered when the game layout page is opened;
// we need to toggle the visibility to off for all captures.
nodecg.listenFor('hideAllCaptures', async (value, ack) => {
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
});

// Triggered when the capture parts of the game layout in the browser move around.
nodecg.listenFor('captureChange', async (opts: GameLayoutChange) => {
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
});

sc.runDataActiveRun.on('change', (newVal, oldVal) => {
  // Change the game layout based on information supplied via the run data.
  if (newVal) {
    if (oldVal && currentLayoutOverridden.value && newVal.id !== oldVal.id) {
      currentLayoutOverridden.value = false;
    }

    if (!currentLayoutOverridden.value && (!oldVal || newVal.id !== oldVal.id)) {
      const layoutCode = (
        newVal.customData && newVal.customData.layout
        ) ? newVal.customData.layout : '4x3-1p';

      currentLayout.value = `/${layoutCode}`;
    }
  }
});
