/* eslint no-new: off, @typescript-eslint/explicit-function-return-type: off */

import '@fontsource/montserrat/latin.css';
import Vue from 'vue';
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
