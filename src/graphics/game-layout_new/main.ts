/* eslint no-new: off, @typescript-eslint/explicit-function-return-type: off */

import type { GameLayouts } from 'schemas';
import Vue from 'vue';
import VueRouter from 'vue-router';
import '../_misc/defaults.css';
import './common.css';
import * as List from './list';
import App from './main.vue';
import waitForReplicants from './store';

Vue.use(VueRouter);

const routes = [
  {
    name: '4:3 1 Player',
    path: '/4x3-1p',
    component: List.L_4x3_1p,
  },
];

const router = new VueRouter({
  routes,
});

// Collect list of available game layouts to add to replicant.
function getAvailable(): GameLayouts['available'] {
  return routes.reduce((prev, route) => {
    if (route.name) {
      prev.push({
        name: route.name,
        code: route.path.replace('/', ''),
      });
    }
    return prev;
  }, [] as GameLayouts['available']);
}

waitForReplicants().then((store) => {
  store.commit('updateList', getAvailable());
  window.addEventListener('beforeunload', () => {
    store.commit('clearList');
  });

  new Vue({
    store,
    router,
    el: '#App',
    render: (h) => h(App),
  });
});
