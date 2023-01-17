import Music from '@shared/extension/music';
import { get as nodecg } from './util/nodecg';
import obs from './util/obs';

const config = nodecg().bundleConfig.music;
const music = new Music(nodecg(), config, obs); // eslint-disable-line @typescript-eslint/no-unused-vars, max-len
