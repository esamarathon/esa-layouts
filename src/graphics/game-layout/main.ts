/* eslint-disable import/prefer-default-export */
/* eslint no-new: off, @typescript-eslint/explicit-function-return-type: off */

import { GameLayouts } from 'schemas';
import Vue from 'vue';
import VueRouter from 'vue-router';
import '../_misc/common.css';
import '../_misc/defaults.css';
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
  {
    name: '4:3 2 Player',
    path: '/4x3-2p',
    component: List.L_4x3_2p,
  },
  {
    name: '4:3 2 Player (co-op)',
    path: '/4x3-2p-coop',
    component: List.L_4x3_2p_CoOp,
  },
  {
    name: '4:3 3 Player',
    path: '/4x3-3p',
    component: List.L_4x3_3p,
  },
  {
    name: '4:3 4 Player',
    path: '/4x3-4p',
    component: List.L_4x3_4p,
  },
  {
    name: '4:3 4 Player (co-op)',
    path: '/4x3-4p-coop',
    component: List.L_4x3_4p_CoOp,
  },
  {
    name: '16:9 1 Player',
    path: '/16x9-1p',
    component: List.L_16x9_1p,
  },
  {
    name: '16:9 2 Player',
    path: '/16x9-2p',
    component: List.L_16x9_2p,
  },
  {
    name: '16:9 2 Player (co-op)',
    path: '/16x9-2p-coop',
    component: List.L_16x9_2p_CoOp,
  },
  {
    name: '16:9 2 Player (bingo)',
    path: '/16x9-2p-bingo',
    component: List.L_16x9_2p_Bingo,
  },
  {
    name: '16:9 3 Player',
    path: '/16x9-3p',
    component: List.L_16x9_3p,
  },
  {
    name: '16:9 4 Player (MonHun)',
    path: '/16x9-4p-monhun',
    component: List.L_16x9_4p_MonHun,
  },
  {
    name: 'GameBoy 1 Player',
    path: '/GB-1p',
    component: List.L_GB_1p,
  },
  {
    name: 'GBA 1 Player',
    path: '/GBA-1p',
    component: List.L_GBA_1p,
  },
  {
    name: '3DS 1 Player',
    path: '/3DS-1p',
    component: List.L_3DS_1p,
  },
  {
    name: 'DS 1 Player',
    path: '/DS-1p',
    component: List.L_DS_1p,
  },
  {
    path: '*',
    redirect: '/4x3-1p',
  },
];

const router = new VueRouter({
  routes,
});

// Collect list of available game layouts to add to replicant.
function getAvailable(): GameLayouts['available'] {
  return routes.reduce((accumulator, route) => {
    if (route.name) {
      accumulator.push({
        name: route.name,
        code: route.path.replace('/', ''),
      });
    }
    return accumulator;
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
