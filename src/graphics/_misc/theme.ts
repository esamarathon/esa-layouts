/* eslint-disable @typescript-eslint/no-var-requires */

import { Configschema } from '@esa-layouts/types/schemas/configschema';

const { theme } = (nodecg.bundleConfig as Configschema).event;
const { default: defaultTheme } = require('./themes/default.theme.css');
const { default: together } = require('./themes/together.theme.css');
const { default: coronarelief } = require('./themes/coronarelief.theme.css');
const { default: uksg } = require('./themes/uksg.theme.css');
const { default: uksgsp } = require('./themes/uksgsp.theme.css');
const { default: uksgsu } = require('./themes/uksgsu.theme.css');
const { default: uksga } = require('./themes/uksga.theme.css');
const { default: uksgw } = require('./themes/uksgw.theme.css');
const { default: summer } = require('./themes/summer.theme.css');
const { default: winter } = require('./themes/winter.theme.css');
const { default: swcf } = require('./themes/swcf.theme.css');

defaultTheme.use();

switch (theme) {
  case 'together':
    together.use();
    break;
  case 'coronarelief':
    coronarelief.use();
    break;
  case 'uksgsp':
    uksg.use();
    uksgsp.use();
    break;
  case 'uksgsu':
    uksg.use();
    uksgsu.use();
    break;
  case 'uksga':
    uksg.use();
    uksga.use();
    break;
  case 'uksgw':
    uksg.use();
    uksgw.use();
    break;
  case 'summer':
    summer.use();
    break;
  case 'winter':
    winter.use();
    break;
  case 'swcf':
    swcf.use();
    break;
  default:
    // do nothing
}
