import type { Configschema } from '@esa-layouts/types/schemas/configschema';
import OBS from '@esamarathon/esa-layouts-shared/obs/extension';
import { get as nodecg } from './nodecg';

const obs = new OBS(nodecg(), (nodecg().bundleConfig as Configschema).obs);
export default obs;
