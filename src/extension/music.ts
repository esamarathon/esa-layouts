import { Configschema } from '@esa-layouts/types/schemas/configschema';
import Music from '@shared/extension/music';
import { get as nodecg } from './util/nodecg';
import obs from './util/obs';

const config = (nodecg().bundleConfig as Configschema).music;
const music = new Music(nodecg(), config, obs); // eslint-disable-line @typescript-eslint/no-unused-vars, max-len
