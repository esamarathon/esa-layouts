import type { Configschema } from '@esa-layouts/types/schemas/configschema';
import VideoPlayer from '@shared/extension/video-player';
import { v4 as uuid } from 'uuid';
import { get as nodecg } from './util/nodecg';
import obs from './util/obs';
import { assetsVideos } from './util/replicants';

const config = (nodecg().bundleConfig as Configschema);
const videoPlayer = new VideoPlayer(nodecg(), config.obs, obs);

// eslint-disable-next-line import/prefer-default-export
export function startPlaylist(): void {
  // no code
}

videoPlayer.on('videoStarted', () => {
  // Need to switch to the scene if not done already.
  console.log('videoStarted');
});

videoPlayer.on('videoEnded', () => {
  console.log('videoEnded');
  videoPlayer.playNext();
});

videoPlayer.on('playlistEnded', () => {
  console.log('playlistEnded');
});

videoPlayer.on('playCommercial', () => {
  console.log('playCommercial');
});

async function setup(): Promise<void> {
  await new Promise((res) => { setTimeout(res, 10000); }); // Wait 10s
  const assets = assetsVideos.value;
  const fakePlaylist = assets.map((video) => ({ id: uuid(), video, commercial: 30 }));
  videoPlayer.loadPlaylist(fakePlaylist);
  await videoPlayer.playNext();
}

setup();
