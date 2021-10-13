/* eslint no-new: off, @typescript-eslint/explicit-function-return-type: off */

import App, { setUpReplicants } from '@shared/dashboard/mediabox';
import Vue from 'vue';
import vuetify from '../_misc/vuetify';

setUpReplicants().then(() => {
  new Vue({
    vuetify,
    el: '#App',
    render: (h) => h(App),
  });
});
