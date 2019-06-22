import SpeedcontrolUtil from 'speedcontrol-util';
import Vue from 'vue';
import VueRouter from 'vue-router';
import Layout1 from './4_3-1p.vue';

Vue.use(VueRouter);
Vue.prototype.$sc = new SpeedcontrolUtil(nodecg);
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
  { name: '4:3 1 Player', path: '/4_3-1p', component: Layout1 },
  { path: '*', redirect: '/4_3-1p' },
];

const router = new VueRouter({
  routes,
});

// Used to send when the layout is changed.
function layoutChanged(route) {
  nodecg.sendMessage('layoutChange', {
    name: route.name,
    path: route.path,
  });
}

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
