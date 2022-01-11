/* eslint no-new: off, @typescript-eslint/explicit-function-return-type: off */

import type { Configschema } from '@esa-layouts/types/schemas/configschema';
import App from '@shared/dashboard/rabbitmq';
import Vue from 'vue';
import vuetify from '../_misc/vuetify';

const config = (nodecg.bundleConfig as Configschema);

new Vue({
  vuetify,
  el: '#App',
  render: (h) => h(App, {
    props: {
      enabled: config.rabbitmq.enabled,
      useTestData: config.useTestData,
    },
  }),
});
