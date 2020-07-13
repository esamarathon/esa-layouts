/* eslint-disable @typescript-eslint/no-var-requires */

import { Configschema } from 'configschema';

const { theme } = (nodecg.bundleConfig as Configschema).event;
const defaultTheme = require('./themes/default.theme.css');
const together = require('./themes/together.theme.css');
const coronarelief = require('./themes/coronarelief.theme.css');
const uksg = require('./themes/uksg.theme.css');
const summeronline = require('./themes/summeronline.theme.css');

defaultTheme.use();

switch (theme) {
  case 'together':
    together.use();
    break;
  case 'coronarelief':
    coronarelief.use();
    break;
  case 'uksg':
    uksg.use();
    break;
  case 'summeronline':
    summeronline.use();
    break;
  default:
    // do nothing
}
