import type { Configschema } from '@esa-layouts/types/schemas/configschema';
import OBS from '@shared/extension/obs';
import { get as nodecg } from './nodecg';

const obs = new OBS(nodecg(), (nodecg().bundleConfig as Configschema).obs);
export default obs;
