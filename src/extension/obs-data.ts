import clone from 'clone';
import type { Configschema } from '@esa-layouts/types/schemas/configschema';
import { logSceneSwitch, logStreamingStatusChange } from './util/logging';
import { get as nodecg } from './util/nodecg';
import obs from './util/obs';
import { obsData } from './util/replicants';

const evtConfig = (nodecg().bundleConfig as Configschema).event;
const config = (nodecg().bundleConfig as Configschema).obs;

let gameLayoutScreenshotInterval: NodeJS.Timeout;
async function takeGameLayoutScreenshot(): Promise<void> {
  try {
    const gameLayoutScreenshot = await obs.conn.send('TakeSourceScreenshot', {
      sourceName: config.names.scenes.gameLayout,
      embedPictureFormat: 'png',
      height: 360,
    });
    obsData.value.gameLayoutScreenshot = gameLayoutScreenshot.img;
  } catch (err) {
    nodecg().log.debug('[OBS Data] Cannot take screenshot of game layout:', err);
  }
}

obs.on('connectionStatusChanged', (connected) => {
  obsData.value.connected = connected;
  if (connected) {
    if (evtConfig.online) {
      takeGameLayoutScreenshot();
      gameLayoutScreenshotInterval = setInterval(takeGameLayoutScreenshot, 1 * 1000);
    }
  } else {
    clearInterval(gameLayoutScreenshotInterval);
  }
});

obs.on('streamingStatusChanged', (streaming) => {
  obsData.value.streaming = streaming;
  logStreamingStatusChange(streaming);
});

obs.on('currentSceneChanged', (current, last) => {
  obsData.value.scene = current;
  if (last) {
    logSceneSwitch(last, 'end');
  }
  if (current) {
    logSceneSwitch(current, 'start');
  }
});

obs.on('sceneListChanged', (list) => {
  // Don't include scenes after the first that starts with "---".
  const stopIndex = list.findIndex((s) => s.startsWith('---'));
  obsData.value.sceneList = clone(list).slice(0, stopIndex >= 0 ? stopIndex : undefined);
});

// This logic assumes the duration supplied is correct, which isn't always the case.
// Not too important for now; a "TransitionEnd" event will be added in a later version.
let transitioningTimeout: NodeJS.Timeout;
obs.conn.on('TransitionBegin', (data) => {
  obsData.value.transitioning = true;
  clearTimeout(transitioningTimeout);
  transitioningTimeout = setTimeout(() => { obsData.value.transitioning = false; }, data.duration);
});
