import clone from 'clone';
import type { Configschema } from 'configschema';
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

obs.on('connectionStateChanged', (connected) => {
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

obs.on('streamingStateChanged', (streaming, old) => {
  obsData.value.streaming = streaming;
  if (typeof old === 'boolean') {
    logStreamingStatusChange(streaming);
  }
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
  obsData.value.sceneList = clone(list);
});

// This logic assumes the duration supplied is correct, which isn't always the case.
// Not too important for now; a "TransitionEnd" event will be added in a later version.
let transitioningTimeout: NodeJS.Timeout;
obs.conn.on('TransitionBegin', (data) => {
  obsData.value.transitioning = true;
  clearTimeout(transitioningTimeout);
  transitioningTimeout = setTimeout(() => { obsData.value.transitioning = false; }, data.duration);
});
