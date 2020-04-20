import { Configschema } from 'configschema';
import needle, { BodyData, NeedleHttpVerbs, NeedleResponse } from 'needle';
import SpeedcontrolUtil from 'speedcontrol-util';
import { get as nodecg } from './util/nodecg';
import obs from './util/obs';
import { evt } from './util/rabbitmq';
import { restreamViewerTool } from './util/replicants';

const sc = new SpeedcontrolUtil(nodecg());
const config = (nodecg().bundleConfig as Configschema).restream;
const obsConfig = (nodecg().bundleConfig as Configschema).obs;

// eslint-disable-next-line max-len
async function request(method: NeedleHttpVerbs, endpoint: string, data: BodyData = null): Promise<NeedleResponse> {
  try {
    nodecg().log.debug(`[Restream] ${method.toUpperCase()} request processing on ${endpoint}${
      (data) ? ` with data ${JSON.stringify(data)}` : ''}`);
    const resp = await needle(
      method,
      `http://${config.address}${endpoint}?key=${config.key}`,
      data ? JSON.stringify(data) : null,
      {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      },
    );
    nodecg().log.debug('[Restream] Response from tool:', JSON.stringify(resp.body));
    if (resp.statusCode === 200) {
      nodecg().log.debug(`[Restream] ${method.toUpperCase()} request successful on ${endpoint}`);
    } else {
      throw new Error(`Status code ${resp.statusCode}`);
    }
    return resp;
  } catch (err) {
    nodecg().log.debug(`[Restream] ${method.toUpperCase()} request error on ${endpoint}:`, err);
    throw err;
  }
}

async function updateStatus(): Promise<void> {
  try {
    const resp = await request('get', '/status');
    restreamViewerTool.value = {
      channel: resp.body.channel || undefined,
      overridden: restreamViewerTool.value.overridden,
      lowLatency: resp.body.lowLatency ?? true,
    };
  } catch (err) {
    nodecg().log.warn('[Restream] Error getting status');
    nodecg().log.debug('[Restream] Error getting status:', err);
  }
}

async function startStream(data: {
  channel?: string; lowLatency?: boolean; overridden?: boolean;
}): Promise<void> {
  try {
    const resp = await request('post', '/start', {
      channel: data.channel || restreamViewerTool.value.channel,
      lowLatency: data.lowLatency ?? restreamViewerTool.value.lowLatency,
    });
    restreamViewerTool.value = {
      channel: resp.body.channel,
      overridden: data.overridden ?? false,
      lowLatency: resp.body.lowLatency ?? true,
    };
    nodecg().log.info('[Restream] Successfully started stream');
  } catch (err) {
    nodecg().log.warn('[Restream] Error starting stream');
    nodecg().log.debug('[Restream] Error starting stream:', err);
  }
}

async function stopStream(): Promise<void> {
  try {
    await request('post', '/stop');
    restreamViewerTool.value = {
      channel: undefined,
      overridden: true,
      lowLatency: restreamViewerTool.value.lowLatency,
    };
    nodecg().log.info('[Restream] Successfully stopped stream');
  } catch (err) {
    nodecg().log.warn('[Restream] Error stopping stream');
    nodecg().log.debug('[Restream] Error stopping stream:', err);
  }
}

async function restartStream(): Promise<void> {
  try {
    const resp = await request('post', '/restart');
    restreamViewerTool.value = {
      channel: resp.body.channel,
      overridden: true,
      lowLatency: resp.body.lowLatency ?? true,
    };
    nodecg().log.info('[Restream] Successfully restarted stream');
  } catch (err) {
    nodecg().log.warn('[Restream] Error restarting stream');
    nodecg().log.debug('[Restream] Error restarting stream:', err);
  }
}

async function configureMediaSource(url: string): Promise<void> {
  try {
    const sourceSettings = await obs.getSourceSettings(obsConfig.names.sources.restreamSource);
    if (!['vlc_source', 'ffmpeg_source'].includes(sourceSettings.sourceType)) {
      throw new Error('Source is neither vlc_source/ffmpeg_source');
    }
    const useVLC = sourceSettings.sourceType === 'vlc_source';

    if (useVLC) {
      nodecg().log.debug('[Restream] Using VLC source type instead of FFmpeg source type');
      await obs.setSourceSettings(
        obsConfig.names.sources.restreamSource,
        'vlc_source',
        /* eslint-disable @typescript-eslint/camelcase */
        {
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
      );
    } else {
      await obs.setSourceSettings(
        obsConfig.names.sources.restreamSource,
        'ffmpeg_source',
        /* eslint-disable @typescript-eslint/camelcase */
        {
          buffering_mb: 2,
          clear_on_media_end: false,
          color_range: 0,
          hw_decode: true,
          input: 'http://localhost:1234',
          input_format: '',
          is_local_file: false,
          restart_on_activate: false,
          seekable: false,
        },
        /* eslint-enable */
      );
    }
    nodecg().log.info('[Restream] Successfully configured media source');
  } catch (err) {
    nodecg().log.warn('[Restream] Error configuring media source');
    nodecg().log.debug('[Restream] Error configuring media source:', err);
  }
}

if (config.enable) {
  updateStatus();
  setInterval(updateStatus, 10 * 1000);

  // Received when we need to tweak the OBS source for the stream.
  evt.on('rvtServerStarted', (data) => {
    configureMediaSource(`http://localhost:${data.port}`);
  });

  // Start new stream when run changes but not on server (re)start.
  let init = false;
  sc.runDataActiveRun.on('change', (newVal, oldVal) => {
    if (init && newVal?.id !== oldVal?.id
      && newVal && newVal.teams.length && newVal.teams[0].players.length
      && newVal.teams[0].players[0].social.twitch) {
      startStream({ channel: newVal.teams[0].players[0].social.twitch });
    }
    init = true;
  });

  // eslint-disable-next-line max-len
  nodecg().listenFor('rvtOverride', async (data: { channel?: string; lowLatency?: boolean }, cb) => {
    await startStream({ ...data, ...{ overridden: true } });
    if (cb && !cb.handled) {
      cb();
    }
  });

  nodecg().listenFor('rvtRestart', async (data, cb) => {
    await restartStream();
    if (cb && !cb.handled) {
      cb();
    }
  });

  nodecg().listenFor('rvtStop', async (data, cb) => {
    await stopStream();
    if (cb && !cb.handled) {
      cb();
    }
  });
}
