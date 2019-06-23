import SpeedcontrolUtil from 'speedcontrol-util';
import Vue from 'vue';
import VueRouter from 'vue-router';
import * as Layouts from './layout-list';

Vue.use(VueRouter);
Vue.prototype.$sc = new SpeedcontrolUtil(nodecg);
const layouts = nodecg.Replicant('layouts', { persistent: false }); // schema this!
const currentLayout = nodecg.Replicant('currentLayout', { persistent: false }); // schema this!
// eslint-disable-next-line import/prefer-default-export
export const serverBus = new Vue();

// This controls the player name -> Twitch username animation timings.
let playerShowTwitchTO;
let playerShowTwitch = false;
function rotatePlayerInfo(init) {
  if (!init) {
    playerShowTwitch = !playerShowTwitch;
  }
  serverBus.$emit('playerShowTwitch', playerShowTwitch);
  if (playerShowTwitch) {
    playerShowTwitchTO = setTimeout(rotatePlayerInfo, 15000);
  } else {
    playerShowTwitchTO = setTimeout(rotatePlayerInfo, 45000);
  }
}
Vue.prototype.$sc.runDataActiveRun.on('change', () => {
  clearTimeout(playerShowTwitchTO);
  playerShowTwitch = false;
  rotatePlayerInfo(true);
});

const routes = [
  { name: '4:3 1 Player', path: '/4x3-1p', component: Layouts.L_4x3_1p },
  { name: '16:9 1 Player', path: '/16x9-1p', component: Layouts.L_16x9_1p },
  { path: '*', redirect: '/4x3-1p' },
];

const router = new VueRouter({
  routes,
});

// Used to send when the layout is changed.
// Usually happens elsewhere but just in case.
function layoutChanged(route) {
  currentLayout.value = route.path;
}

currentLayout.on('change', (newVal) => {
  if (newVal) {
    router.push(newVal);
  }
});

// Sometimes the registration doesn't happen! heh
const pageRegTimeout = setTimeout(() => window.location.reload(), 1000);
// Waiting to make sure the graphic is the only instance open.
window.addEventListener('nodecg-registration-accepted', () => {
  clearTimeout(pageRegTimeout);
  NodeCG.waitForReplicants(layouts).then(() => {
    layouts.value = routes;
    window.onunload = () => {
      layouts.value = {};
    };
    // Will only set up Vue app once OBS is ready.
    nodecg.sendMessage('hideAllCaptures').then(() => {
      // eslint-disable-next-line no-unused-vars
      const app = new Vue({
        router,
        watch: {
          $route(to) {
            // Happens when route is changed.
            layoutChanged(to);
          },
        },
        mounted() {
          // Initial route.
          layoutChanged(this.$route);
        },
      }).$mount('#App');
    }).catch(() => {});
  });
});
