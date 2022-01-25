/* eslint no-new: off, @typescript-eslint/explicit-function-return-type: off */

import Vue from 'vue';
import '../_misc/common.css';
import App from './main.vue';

new Vue({
  el: '#App',
  render: (h) => h(App),
});
