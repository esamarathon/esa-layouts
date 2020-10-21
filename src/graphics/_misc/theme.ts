/* eslint-disable @typescript-eslint/no-var-requires */

import { Configschema } from 'configschema';

const { theme } = (nodecg.bundleConfig as Configschema).event;
const defaultTheme = require('./themes/default.theme.css');
const together = require('./themes/together.theme.css');
const coronarelief = require('./themes/coronarelief.theme.css');
const uksgsu = require('./themes/uksgsu.theme.css');
const uksga = require('./themes/uksga.theme.css');
const summeronline = require('./themes/summeronline.theme.css');

defaultTheme.use();

switch (theme) {
  case 'together':
    together.use();
    break;
  case 'coronarelief':
    coronarelief.use();
    break;
  case 'uksgsu':
    uksgsu.use();
    break;
  case 'uksga':
    uksga.use();
    break;
  case 'summeronline':
    summeronline.use();
    break;
  default:
    // do nothing
}
