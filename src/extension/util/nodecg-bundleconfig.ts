import { Configschema } from '../../../configschema';
import * as nodecgApiContext from './nodecg-api-context';

export const bundleConfig: Configschema = nodecgApiContext.get().bundleConfig;
