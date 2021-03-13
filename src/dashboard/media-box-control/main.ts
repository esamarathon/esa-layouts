/* eslint no-new: off, @typescript-eslint/explicit-function-return-type: off */

import App from '@esamarathon/esa-layouts-shared/mediabox/dashboard';
import waitForReplicants from '@esamarathon/esa-layouts-shared/mediabox/dashboard/src/store';
import Vue from 'vue';
import vuetify from '../_misc/vuetify';

waitForReplicants().then((store) => {
  new Vue({
    vuetify,
    store,
    el: '#App',
    render: (h) => h(App),
  });
});
