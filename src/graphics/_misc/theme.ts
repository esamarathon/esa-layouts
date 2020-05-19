/* eslint-disable @typescript-eslint/no-var-requires */

import { Configschema } from 'configschema';

const { theme } = (nodecg.bundleConfig as Configschema).event;
const defaultTheme = require('./themes/default.theme.css');
const together = require('./themes/together.theme.css');

defaultTheme.use();

if (theme === 'together') {
  together.use();
}
