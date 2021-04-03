/* eslint no-new: off, @typescript-eslint/explicit-function-return-type: off */

import type { GameLayouts } from '@esa-layouts/types/schemas';
import { RunDataActiveRun } from 'speedcontrol-util/types';
import Vue from 'vue';
import VueRouter from 'vue-router';
import '../_misc/fonts/barlow-condensed.css';
import '../_misc/theme';
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
  {
    name: '4:3 2 Player',
    path: '/4x3-2p',
    component: List.L_4x3_2p,
  },
  {
    name: '4:3 2 Player (Extra Space)',
    path: '/4x3-2p-extraspace',
    component: List.L_4x3_2p_ExtraSpace,
  },
  {
    name: '4:3 2 Player (Extra Middle Space)',
    path: '/4x3-2p-extramiddlespace',
    component: List.L_4x3_2p_ExtraMiddleSpace,
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
    name: '16:9 1 Player',
    path: '/16x9-1p',
    component: List.L_16x9_1p,
  },
  {
    name: '16:9 1 Player (Large Camera)',
    path: '/16x9-1p-largecam',
    component: List.L_16x9_1p_LargeCam,
  },
  {
    name: '16:9 1 Player (2 Cameras)',
    path: '/16x9-1p-2cams',
    component: List.L_16x9_1p_2Cams,
  },
  {
    name: '16:9 2 Player',
    path: '/16x9-2p',
    component: List.L_16x9_2p,
  },
  {
    name: '16:9 3 Player',
    path: '/16x9-3p',
    component: List.L_16x9_3p,
  },
  {
    name: 'GameBoy 1 Player',
    path: '/GB-1p',
    component: List.L_GB_1p,
  },
  {
    name: 'GameBoy 2 Player (Extra Space)',
    path: '/GB-2p-extraspace',
    component: List.L_GB_2p_ExtraSpace,
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
    name: '5:2 1 Player',
    path: '/5x2-1p',
    component: List.L_5x2_1p,
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

// Logic for if we should be using mutiplayer layouts as "co-op" variants.
function checkCoop(runData: RunDataActiveRun): boolean {
  return (runData
    && runData.teams.length === 1
    && runData.teams[0].players.length > 1) || false;
}

waitForReplicants().then((store) => {
  store.commit('updateList', getAvailable());
  window.addEventListener('beforeunload', () => {
    store.commit('clearList');
  });
  store.watch(() => store.state.runDataActiveRun, () => {
    store.commit('updateCoop', checkCoop(store.state.runDataActiveRun));
  }, { immediate: true });

  new Vue({
    store,
    router,
    el: '#App',
    render: (h) => h(App),
  });
});
