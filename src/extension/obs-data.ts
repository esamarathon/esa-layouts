import { get as nodecg } from './util/nodecg';
import obs from './util/obs';
import { obsData } from './util/replicants';

obs.on('ConnectionOpened', async () => {
  obsData.value.connected = true;
  try {
    const resp = await obs.send('GetCurrentScene');
    obsData.value.scene = resp.name;
  } catch (err) {
    nodecg().log.warn('[OBS Data] Cannot get current scene on connection');
  }
});

obs.on('ConnectionClosed', () => {
  obsData.value.connected = false;
  delete obsData.value.scene;
});

obs.on('SwitchScenes', (data) => {
  obsData.value.scene = data['scene-name'];
});
