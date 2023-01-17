/* eslint no-new: off, @typescript-eslint/explicit-function-return-type: off */

import App from '@shared/dashboard/rabbitmq';
import Vue from 'vue';
import vuetify from '../_misc/vuetify';

const config = nodecg.bundleConfig;

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
