import speedcontrolUtil from 'speedcontrol-util';
import * as nodecgApiContext from './util/nodecg-api-context';
import { bundleConfig } from './util/nodecg-bundleconfig';
import obs from './util/obs';

const nodecg = nodecgApiContext.get();
const sc = new speedcontrolUtil(nodecg);
const lastScene = nodecg.Replicant<string>('lastOBSScene');
const currentScene = nodecg.Replicant<string>('currentOBSScene');

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
const obsGameLayoutScene = bundleConfig.obs.names.scenes.gameLayout;

// Triggered when the page is opened; we need to toggle the visibility to off for all captures.
nodecg.listenFor('gameLayoutGraphicOpened', async () => {
  const keyMap = Object.keys(obsGroupKeys).map((key) => {
    return obsGroupKeys[key];
  });
  for await (const item of keyMap) {
    try {
      await obs.hideItemInScene(item, obsGameLayoutScene);
    } catch (err) {}
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
      await obs.setUpCaptureInScene(obsGroupKeys[opts.cssID], obsGameLayoutScene, {
        x: opts.sizes.x,
        y: opts.sizes.y,
        width: opts.sizes.width,
        height: opts.sizes.height,
      });
    } catch (err) {}
  }
});
