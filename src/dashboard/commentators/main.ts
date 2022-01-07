/* eslint no-new: off, @typescript-eslint/explicit-function-return-type: off */

import { setUpReplicants } from '@esa-layouts/browser_shared/replicant_store';
import Vue from 'vue';
import vuetify from '../_misc/vuetify';
import App from './main.vue';
import store from './store';

setUpReplicants(store).then(() => {
  new Vue({
    vuetify,
    store,
    el: '#App',
    render: (h) => h(App),
  });
});
