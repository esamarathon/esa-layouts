/* eslint-disable @typescript-eslint/no-var-requires */

import { Configschema } from '@esa-layouts/types/schemas/configschema';

const { theme } = (nodecg.bundleConfig as Configschema).event;
const { default: defaultTheme } = require('./themes/default.theme.css');
const { default: together } = require('./themes/together.theme.css');
const { default: coronarelief } = require('./themes/coronarelief.theme.css');
const { default: uksgsu } = require('./themes/uksgsu.theme.css');
const { default: uksga } = require('./themes/uksga.theme.css');
const { default: uksgw } = require('./themes/uksgw.theme.css');
const { default: summeronline } = require('./themes/summeronline.theme.css');
const { default: winter } = require('./themes/winter.theme.css');

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
  case 'uksgw':
    uksgw.use();
    break;
  case 'summeronline':
    summeronline.use();
    break;
  case 'winter':
    winter.use();
    break;
  default:
    // do nothing
}
