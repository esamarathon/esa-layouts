import { Configschema } from 'configschema';
import fetch from 'node-fetch';
import type { Response } from 'node-fetch';
import { Readable } from 'stream';
import type { Foobar2000 } from 'types';
import { get as nodecg } from './util/nodecg';
import obs from './util/obs';
import { musicData } from './util/replicants';

const config = (nodecg().bundleConfig as Configschema).music;
const auth = (config.username && config.password)
  ? `Basic ${Buffer.from(`${config.username}:${config.password}`).toString('base64')}` : undefined;
const headers = auth ? {
  Authorization: auth,
} : undefined;
let positionTimestamp = 0;
let positionInitial = 0;
let positionInterval: NodeJS.Timeout;

/**
 * Make a request to the Beefweb foobar2000 plugin.
 * @param method Required HTTP method.
 * @param endpoint The endpoint to request.
 */
async function request(method: string, endpoint: string): Promise<Response> {
  nodecg().log.debug(`[Music] API ${method.toUpperCase()} request processing on ${endpoint}`);
  const resp = await fetch(`http://${config.address}/api${endpoint}`, {
    method,
    headers,
  });
  if (![200, 204].includes(resp.status)) {
    const text = await resp.text();
    nodecg().log.debug(`[Music] API ${method.toUpperCase()} request error on ${endpoint}:`, text);
    throw new Error(text);
  }
  nodecg().log.debug(`[Music] API ${method.toUpperCase()} request successful on ${endpoint}`);
  return resp;
}

/**
 * Updates the stored position of the current track every second.
 */
function updatePosition(): void {
  if (musicData.value.track && musicData.value.playing) {
    musicData.value.track.position = ((Date.now() - positionTimestamp) / 1000) + positionInitial;
  } else {
    clearInterval(positionInterval);
  }
}

/**
 * Sends a "play" command to foobar2000.
 */
async function play(): Promise<void> {
  try {
    await request('post', '/player/play');
    nodecg().log.info('[Music] Successfully playing');
  } catch (err) {
    nodecg().log.warn('[Music] Error playing');
    nodecg().log.debug('[Music] Error playing:', err);
  }
}

/**
 * Sends a "pause" command to foobar2000.
 */
async function pause(): Promise<void> {
  try {
    await request('post', '/player/pause');
    nodecg().log.info('[Music] Successfully paused');
  } catch (err) {
    nodecg().log.warn('[Music] Error pausing');
    nodecg().log.debug('[Music] Error pausing:', err);
  }
}

/**
 * Sets up the constant connection to foobar2000.
 */
async function setup(): Promise<void> {
  try {
    nodecg().log.info('[Music] Attempting connection');
    const resp = await request(
      'get',
      '/query/updates?player=true&trcolumns=%artist%,%title%',
    );
    musicData.value.connected = true;
    nodecg().log.info('[Music] Connection successful');
    const readable = Readable.from(resp.body);
    readable.on('data', (chunk: Buffer) => {
      let msg: Foobar2000.UpdateMsg | undefined;
      try {
        const cleaned = chunk.toString().slice(6).replace(/(\r\n|\n|\r)/gm, '');
        msg = JSON.parse(cleaned);
      } catch (err) {
        nodecg().log.warn('[Music] Error parsing message on connection');
        nodecg().log.debug('[Music] Error parsing message on connection:', err);
      }
      if (!msg) {
        return;
      }
      if (msg.player) {
        clearInterval(positionInterval);
        musicData.value.playing = msg.player.playbackState === 'playing';
        if (msg.player.playbackState !== 'stopped') {
          if (msg.player.activeItem.duration > 0) {
            musicData.value.track = {
              artist: msg.player.activeItem.columns[0] || undefined,
              title: msg.player.activeItem.columns[1] || undefined,
              position: msg.player.activeItem.position,
              duration: msg.player.activeItem.duration,
            };
            if (msg.player.playbackState === 'playing') {
              positionInitial = msg.player.activeItem.position;
              positionTimestamp = Date.now();
              positionInterval = setInterval(updatePosition, 1000);
            }
          }
        } else {
          delete musicData.value.track;
        }
      }
    });
    readable.on('close', () => {
      nodecg().log.warn('[Music] Connection closed');
    });
    readable.on('error', (err) => {
      nodecg().log.warn('[Music] Connection error');
      nodecg().log.debug('[Music] Connection error:', err);
    });
    readable.on('end', () => {
      musicData.value.connected = false;
      nodecg().log.warn('[Music] Connection ended, retrying in 5 seconds');
      setTimeout(setup, 5 * 1000);
    });
  } catch (err) {
    musicData.value.connected = false;
    nodecg().log.warn('[Music] Connection failed, retrying in 5 seconds');
    nodecg().log.debug('[Music] Connection failed, retrying in 5 seconds:', err);
    setTimeout(setup, 5 * 1000);
  }
}

// Listen to OBS transitions to play/pause correctly.
obs.conn.on('TransitionBegin', (data) => {
  if (data['to-scene']) {
    if (data['to-scene'].endsWith('[M]')) {
      play();
    } else {
      pause();
    }
  }
});

musicData.value.connected = false;
if (config.enable) {
  setup();
}
