/* eslint-disable @typescript-eslint/no-var-requires */

import { Configschema } from 'configschema';

const { theme } = (nodecg.bundleConfig as Configschema).event;
const defaultTheme = require('./themes/default.theme.css');

defaultTheme.use();

// More themes will be included here when added.
