import SpeedcontrolUtil from 'speedcontrol-util';
import { get as nodecg } from './util/nodecg';
import obs from './util/obs';
import * as mq from './util/rabbitmq';
import { restreamViewerTool } from './util/replicants';

const sc = new SpeedcontrolUtil(nodecg());

async function configureVLCSource(url: string): Promise<void> {
  try {
    await obs.send('SetSourceSettings', {
      sourceName: 'Stream Source',
      /* eslint-disable @typescript-eslint/camelcase */
      sourceSettings: {
        loop: true,
        network_caching: 400,
        playback_behavior: 'always_play',
        playlist: [
          {
            value: url,
          },
        ],
        shuffle: false,
        subtitle: 1,
        subtitle_enable: false,
        track: 1,
      },
      /* eslint-enable */
    });
  } catch (err) {
    // log the error
  }
}

// Received when we need to tweak the OBS source for the stream.
mq.evt.on('rvtServerStarted', (data) => {
  configureVLCSource(`http://127.0.0.1:${data.port}`);
});

sc.runDataActiveRun.on('change', (newVal, oldVal) => {
  if (newVal?.id !== oldVal?.id) {
    let channel;
    if (newVal && newVal.teams.length && newVal.teams[0].players.length
      && newVal.teams[0].players[0].social.twitch) {
      channel = newVal.teams[0].players[0].social.twitch;
    }
    restreamViewerTool.value.overridden = false;
    restreamViewerTool.value.channel = channel;
  }
});
