import { Configschema } from 'configschema';
import { get as nodecg } from './util/nodecg';
import obs from './util/obs';
import { obsData } from './util/replicants';

const obsConfig = (nodecg().bundleConfig as Configschema).obs;

let gameLayoutScreenshotInterval: NodeJS.Timeout;
async function takeGameLayoutScreenshot(): Promise<void> {
  try {
    const gameLayoutScreenshot = await obs.send('TakeSourceScreenshot', {
      sourceName: obsConfig.names.scenes.gameLayout,
      embedPictureFormat: 'png',
      height: 360,
    });
    obsData.value.gameLayoutScreenshot = gameLayoutScreenshot.img;
  } catch (err) {
    nodecg().log.debug('[OBS Data] Cannot take screenshot of game layout:', err);
  }
}

obs.on('ConnectionOpened', async () => {
  obsData.value.connected = true;
  try {
    const sceneList = await obs.send('GetSceneList');
    const streamingStatus = await obs.send('GetStreamingStatus');
    obsData.value.scene = sceneList['current-scene'];
    obsData.value.sceneList = sceneList.scenes.map((s) => s.name);
    obsData.value.streaming = streamingStatus.streaming;
    takeGameLayoutScreenshot();
    gameLayoutScreenshotInterval = setInterval(takeGameLayoutScreenshot, 1 * 1000);
  } catch (err) {
    nodecg().log.warn('[OBS Data] Cannot get current scene on connection');
  }
});

obs.on('ConnectionClosed', () => {
  obsData.value = {
    connected: false,
    sceneList: [],
    disableTransitioning: obsData.value.disableTransitioning,
  };
  clearInterval(gameLayoutScreenshotInterval);
});

obs.on('SwitchScenes', (data) => {
  obsData.value.scene = data['scene-name'];
});

obs.on('ScenesChanged', async () => {
  const sceneList = await obs.send('GetSceneList');
  obsData.value.sceneList = sceneList.scenes.map((s) => s.name);
});

// This logic assumes the duration supplied is correct, which isn't always the case.
// Not too important for now, a "TransitionEnd" event will be added in a later version.
let transitioningTimeout: NodeJS.Timeout;
obs.on('TransitionBegin', (data) => {
  obsData.value.transitioning = true;
  clearTimeout(transitioningTimeout);
  transitioningTimeout = setTimeout(() => { obsData.value.transitioning = false; }, data.duration);
});

obs.on('Heartbeat', (data) => {
  if (typeof data.streaming === 'boolean') {
    obsData.value.streaming = data.streaming;
  }
});
