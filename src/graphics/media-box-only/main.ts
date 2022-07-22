/* eslint no-new: off, @typescript-eslint/explicit-function-return-type: off */

import { setUpReplicants } from '@esa-layouts/browser_shared/replicant_store';
import { setUpReplicantsComponent as setUpReplicantsMediabox } from '@shared/graphics/mediabox';
import Vue from 'vue';
import '../_misc/common.css';
import '../_misc/theme';
import App from './main.vue';
import store from './store';

setUpReplicants(store).then(async () => {
  await setUpReplicantsMediabox();
  new Vue({
    store,
    el: '#App',
    render: (h) => h(App),
  });
});
