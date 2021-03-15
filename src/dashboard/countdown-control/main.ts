/* eslint no-new: off, @typescript-eslint/explicit-function-return-type: off */

import App from '@esamarathon/esa-layouts-shared/countdown/dashboard';
import Vue from 'vue';
import vuetify from '../_misc/vuetify';

new Vue({
  vuetify,
  el: '#App',
  render: (h) => h(App),
});
