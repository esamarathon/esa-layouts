import { Configschema } from 'configschema';
import needle, { NeedleResponse } from 'needle';
import SpeedcontrolUtil from 'speedcontrol-util';
import { get as nodecg } from './util/nodecg';
import obs from './util/obs';
import * as mq from './util/rabbitmq';
import { restreamViewerTool } from './util/replicants';

const sc = new SpeedcontrolUtil(nodecg());
const config = (nodecg().bundleConfig as Configschema).restream;
const obsConfig = (nodecg().bundleConfig as Configschema).obs;

async function post(endpoint: string, data: { [k: string]: unknown }): Promise<NeedleResponse> {
  try {
    nodecg().log.debug(`[Restream] POST request processing on ${endpoint}`
      + ` with data ${JSON.stringify(data)}`);
    const resp = await needle(
      'post',
      `http://${config.address}${endpoint}?key=${config.key}`,
      JSON.stringify(data),
      {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      },
    );
    nodecg().log.debug('[Restream] Response from tool:', JSON.stringify(resp.body));
    if (resp.statusCode === 200) {
      nodecg().log.debug(`[Restream] POST request successful on ${endpoint}`);
    } else {
      throw new Error(`Status code ${resp.statusCode}`);
    }
    return resp;
  } catch (err) {
    nodecg().log.debug(`[Restream] POST request error on ${endpoint}:`, err);
    throw err;
  }
}

async function startStream(channel: string, overridden = false): Promise<void> {
  try {
    const resp = await post('/start', { channel });
    restreamViewerTool.value = {
      channel: resp.body.channel,
      overridden,
    };
    nodecg().log.warn('[Restream] Successfully started stream');
  } catch (err) {
    nodecg().log.warn('[Restream] Error starting stream');
    nodecg().log.debug('[Restream] Error starting stream:', err);
  }
}

async function configureVLCSource(url: string): Promise<void> {
  try {
    // This assumes the source *is* a VLC Video Source.
    await obs.send('SetSourceSettings', {
      sourceName: obsConfig.names.sources.restreamSource,
      /* eslint-disable @typescript-eslint/camelcase */
      sourceSettings: {
        loop: true,
        network_caching: 1000,
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
    nodecg().log.info('[Restream] Successfully configured VLC source');
  } catch (err) {
    nodecg().log.warn('[Restream] Error configuring VLC source');
    nodecg().log.debug('[Restream] Error configuring VLC source:', err);
  }
}

if (config.enable) {
  // Received when we need to tweak the OBS source for the stream.
  mq.evt.on('rvtServerStarted', (data) => {
    configureVLCSource(`http://localhost:${data.port}`);
  });

  // Start new stream when run changes but not on server (re)start.
  let init = false;
  sc.runDataActiveRun.on('change', (newVal, oldVal) => {
    if (init && newVal?.id !== oldVal?.id) {
      if (newVal && newVal.teams.length && newVal.teams[0].players.length
        && newVal.teams[0].players[0].social.twitch) {
        startStream(newVal.teams[0].players[0].social.twitch);
      }
    }
    init = true;
  });

  nodecg().listenFor('rvtOverride', async (channel: string) => {
    await startStream(channel, true);
    // maybe send a callback to the browser here?
  });
}
