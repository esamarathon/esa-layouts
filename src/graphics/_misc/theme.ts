/* eslint-disable @typescript-eslint/no-var-requires */

import { Configschema } from 'configschema';

const { theme } = (nodecg.bundleConfig as Configschema).event;
const esa = require('./themes/esa.theme.css');

if (theme === 'esa') {
  esa.use();
} else {
  esa.use();
}
