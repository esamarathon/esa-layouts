/* eslint no-new: off, @typescript-eslint/explicit-function-return-type: off */

import Vue from 'vue';
import '../_misc/theme';
import './common.css';
import App from './main.vue';
import waitForReplicants from './store';

waitForReplicants().then((store) => {
  new Vue({
    store,
    el: '#App',
    render: (h) => h(App),
  });
});
