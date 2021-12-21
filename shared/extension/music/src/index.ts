import type { HeadersInit, Response } from 'node-fetch';
import fetch from 'node-fetch';
import type { NodeCG, Replicant } from 'nodecg/types/server';
import path from 'path';
import { Readable } from 'stream';
import { Foobar2000, Music as MusicTypes } from '../../../types';
import { MusicData } from '../../../types/schemas';

/**
 * Calculates the absolute file path to one of our local replicant schemas.
 * @param schemaName the replicant/schema filename.
 */
function buildSchemaPath(schemaName: string) {
  return path.resolve(__dirname, '../../../schemas', `${encodeURIComponent(schemaName)}.json`);
}

class Music {
  private nodecg: NodeCG;
  private config: MusicTypes.Config;
  private auth: string | undefined;
  private headers: HeadersInit | undefined;
  private positionTimestamp = 0;
  private positionInitial = 0;
  private positionInterval: NodeJS.Timeout | undefined;
  musicData: Replicant<MusicData>;

  constructor(nodecg: NodeCG, config: MusicTypes.Config) {
    this.nodecg = nodecg;
    this.config = config;
    this.auth = (config.username && config.password)
      ? `Basic ${Buffer.from(`${config.username}:${config.password}`).toString('base64')}`
      : undefined;
    this.headers = this.auth ? { Authorization: this.auth } : undefined;
    this.musicData = nodecg.Replicant('musicData', { schemaPath: buildSchemaPath('musicData') });

    this.musicData.value.connected = false;
    if (config.enable) {
      this.setup();
    }
  }

  /**
   * Make a request to the Beefweb foobar2000 plugin.
   * @param method Required HTTP method.
   * @param endpoint The endpoint to request.
   */
  private async request(method: string, endpoint: string): Promise<Response> {
    this.nodecg.log.debug(`[Music] API ${method.toUpperCase()} request processing on ${endpoint}`);
    const resp = await fetch(`http://${this.config.address}/api${endpoint}`, {
      method,
      headers: this.headers,
    });
    if (![200, 204].includes(resp.status)) {
      const text = await resp.text();
      this.nodecg.log
        .debug(`[Music] API ${method.toUpperCase()} request error on ${endpoint}:`, text);
      throw new Error(text);
    }
    this.nodecg.log.debug(`[Music] API ${method.toUpperCase()} request successful on ${endpoint}`);
    return resp;
  }

  /**
   * Updates the stored position of the current track every second.
   */
  private updatePosition(): void {
    if (this.musicData.value.track && this.musicData.value.playing) {
      this.musicData.value.track.position = ((Date.now() - this.positionTimestamp) / 1000)
        + this.positionInitial;
    } else if (this.positionInterval) {
      clearInterval(this.positionInterval);
    }
  }

  /**
   * Sends a "play" command to foobar2000.
   */
  async play(): Promise<void> {
    try {
      await this.request('post', '/player/play');
      this.nodecg.log.info('[Music] Successfully playing');
    } catch (err) {
      this.nodecg.log.warn('[Music] Error playing');
      this.nodecg.log.debug('[Music] Error playing:', err);
    }
  }

  /**
   * Sends a "pause" command to foobar2000.
   */
  async pause(): Promise<void> {
    try {
      await this.request('post', '/player/pause');
      this.nodecg.log.info('[Music] Successfully paused');
    } catch (err) {
      this.nodecg.log.warn('[Music] Error pausing');
      this.nodecg.log.debug('[Music] Error pausing:', err);
    }
  }

  /**
   * Sets up the constant connection to foobar2000.
   */
  private async setup(): Promise<void> {
    try {
      this.nodecg.log.info('[Music] Attempting connection');
      const resp = await this.request(
        'get',
        '/query/updates?player=true&trcolumns=%artist%,%title%',
      );
      this.musicData.value.connected = true;
      this.nodecg.log.info('[Music] Connection successful');
      if (!resp.body) throw new Error('body was null');
      const readable = Readable.from(resp.body);
      readable.on('data', (chunk: Buffer) => {
        let msg: Foobar2000.UpdateMsg | undefined;
        try {
          const cleaned = chunk.toString().slice(6).replace(/(\r\n|\n|\r)/gm, '');
          msg = JSON.parse(cleaned);
        } catch (err) {
          this.nodecg.log.warn('[Music] Error parsing message on connection');
          this.nodecg.log.debug('[Music] Error parsing message on connection:', err);
        }
        if (!msg) {
          return;
        }
        if (msg.player) {
          if (this.positionInterval) {
            clearInterval(this.positionInterval);
          }
          this.musicData.value.playing = msg.player.playbackState === 'playing';
          if (msg.player.playbackState !== 'stopped') {
            if (msg.player.activeItem.duration > 0) {
              this.musicData.value.track = {
                artist: msg.player.activeItem.columns[0] || undefined,
                title: msg.player.activeItem.columns[1] || undefined,
                position: msg.player.activeItem.position,
                duration: msg.player.activeItem.duration,
              };
              if (msg.player.playbackState === 'playing') {
                this.positionInitial = msg.player.activeItem.position;
                this.positionTimestamp = Date.now();
                this.positionInterval = setInterval(() => this.updatePosition(), 1000);
              }
            }
          } else {
            delete this.musicData.value.track;
          }
        }
      });
      readable.on('close', () => {
        this.nodecg.log.warn('[Music] Connection closed');
      });
      readable.on('error', (err) => {
        this.nodecg.log.warn('[Music] Connection error');
        this.nodecg.log.debug('[Music] Connection error:', err);
      });
      readable.on('end', () => {
        this.musicData.value.connected = false;
        this.nodecg.log.warn('[Music] Connection ended, retrying in 5 seconds');
        setTimeout(() => this.setup(), 5 * 1000);
      });
    } catch (err) {
      this.musicData.value.connected = false;
      this.nodecg.log.warn('[Music] Connection failed, retrying in 5 seconds');
      this.nodecg.log.debug('[Music] Connection failed, retrying in 5 seconds:', err);
      setTimeout(() => this.setup(), 5 * 1000);
    }
  }
}

export = Music;
