/* eslint no-new: off, @typescript-eslint/explicit-function-return-type: off */

import type { GameLayouts } from '@esa-layouts/types/schemas';
import { setUpReplicantsComponent as setUpReplicantsMediabox } from '@shared/graphics/mediabox';
import { RunDataActiveRun } from 'speedcontrol-util/types';
import Vue from 'vue';
import VueRouter from 'vue-router';
import '../_misc/common.css';
import '../_misc/theme';
import * as List from './list';
import App from './main.vue';
import waitForReplicants from './store';

Vue.use(VueRouter);

const routes = [
  /* {
    name: '(SWCF) 16:9 2 Feeds (Dance Pad)',
    path: '/swcf_16x9-2feeds-dancepad',
    component: List.L_SWCF_16x9_2Feeds_Dancepad,
  },
  {
    name: '(SWCF) 16:9 2 Player (Bingo)',
    path: '/swcf_16x9-2p-bingo',
    component: List.L_SWCF_16x9_2p_Bingo,
  },
  {
    name: '(SWCF) 16:9 4 Player (Bingo)',
    path: '/swcf_16x9-4p-bingo',
    component: List.L_SWCF_16x9_4p_Bingo,
  }, */
  {
    name: '(ESAW24) 4:3 1 Player',
    path: '/esaw24-4x3-1p',
    component: List.L_ESAW24_4x3_1p,
  },
  {
    name: '(ESAW24) 16:9 1 Player',
    path: '/esaw24-16x9-1p',
    component: List.L_ESAW24_16x9_1p,
  },
  {
    name: '(ESAW24) GBA 1 Player',
    path: '/esaw24-gba-1p',
    component: List.L_ESAW24_GBA_1p,
  },
  {
    name: '(ESAW24) Elden Ring Bingo',
    path: '/esaw24-eldenring-bingo',
    component: List.L_ESAW24_EldenRing_Bingo,
  },
  {
    name: '4:3 1 Player',
    path: '/4x3-1p',
    component: List.L_4x3_1p,
  },
  {
    name: '4:3 1 Player (2 Cameras)',
    path: '/4x3-1p-2cams',
    component: List.L_4x3_1p_2Cams,
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
    name: '16:9 1 Player (2 Cameras, No Game)',
    path: '/16x9-1p-2cams-nogame',
    component: List.L_16x9_1p_2Cams_NoGame,
  },
  {
    name: '16:9 1 Player (Large Crowd Camera)',
    path: '/16x9-1p-largecrowdcam',
    component: List.L_16x9_1p_LargeCrowdCam,
  },
  {
    name: '16:9 1 Player (HEK)',
    path: '/16x9-1p-hek',
    component: List.L_16x9_1p_HEK,
  },
  {
    name: '16:9 2 Player',
    path: '/16x9-2p',
    component: List.L_16x9_2p,
  },
  {
    name: '16:9 2 Player (Bingo)',
    path: '/16x9-2p-bingo',
    component: List.L_16x9_2p_Bingo,
  },
  {
    name: '16:9 2 Player (HEK)',
    path: '/16x9-2p-hek',
    component: List.L_16x9_2p_HEK,
  },
  {
    name: '16:9 3 Player',
    path: '/16x9-3p',
    component: List.L_16x9_3p,
  },
  {
    name: '9:16 1 Player',
    path: '/9x16-1p',
    component: List.L_9x16_1p,
  },
  {
    name: '9:16 1 Player (2 Cameras)',
    path: '/9x16-1p-2cams',
    component: List.L_9x16_1p_2Cams,
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
    name: 'GBA 2 Player',
    path: '/GBA-2p',
    component: List.L_GBA_2p,
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
    name: 'SM64 (Power Star Pathway 2P)',
    path: '/sm64-psp-2p',
    component: List.L_SM64_PSP_2p,
  },
  {
    name: '2 Cameras Only',
    path: '/2-cams-only',
    component: List.L_2CamsOnly,
  },
  {
    name: 'Full Camera',
    path: '/full-cam',
    component: List.L_FullCam,
  },
  {
    name: 'Taskmaster Timer',
    path: '/taskmaster-timer',
    component: List.L_Taskmaster_Timer,
  },
  {
    name: 'Pokemon Emerald Map Randomizer',
    path: '/pokemonemerald-maprando',
    component: List.L_PokemonEmerald_MapRando,
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

waitForReplicants().then(async (store) => {
  await setUpReplicantsMediabox();
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
