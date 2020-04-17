import clone from 'clone';
import { Configschema } from 'configschema';
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

obs.conn.on('ConnectionOpened', async () => {
  obsData.value.connected = true;
  try {
    const streamingStatus = await obs.conn.send('GetStreamingStatus');
    obsData.value.streaming = streamingStatus.streaming;
    if (evtConfig.online) {
      takeGameLayoutScreenshot();
      gameLayoutScreenshotInterval = setInterval(takeGameLayoutScreenshot, 1 * 1000);
    }
  } catch (err) {
    nodecg().log.warn('[OBS Data] Cannot get current scene on connection');
  }
});

obs.conn.on('ConnectionClosed', () => {
  obsData.value = {
    connected: false,
    sceneList: [],
    disableTransitioning: obsData.value.disableTransitioning,
  };
  clearInterval(gameLayoutScreenshotInterval);
});

obs.on('currentSceneChanged', (currentScene) => {
  obsData.value.scene = currentScene;
});
obs.on('sceneListChanged', (sceneList) => {
  obsData.value.sceneList = clone(sceneList);
});

// This logic assumes the duration supplied is correct, which isn't always the case.
// Not too important for now; a "TransitionEnd" event will be added in a later version.
let transitioningTimeout: NodeJS.Timeout;
obs.conn.on('TransitionBegin', (data) => {
  obsData.value.transitioning = true;
  clearTimeout(transitioningTimeout);
  transitioningTimeout = setTimeout(() => { obsData.value.transitioning = false; }, data.duration);
});

obs.conn.on('Heartbeat', (data) => {
  if (typeof data.streaming === 'boolean') {
    obsData.value.streaming = data.streaming;
  }
});
