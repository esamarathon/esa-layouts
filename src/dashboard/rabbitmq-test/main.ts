/* eslint no-new: off, @typescript-eslint/explicit-function-return-type: off */

import Vue from 'vue';
import vuetify from '../_misc/vuetify';
import App from './main.vue';

new Vue({
  vuetify,
  el: '#App',
  render: (h) => h(App),
});
