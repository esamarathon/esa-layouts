import Vue from 'vue';
import VueRouter from 'vue-router';
import SpeedcontrolUtil from 'speedcontrol-util';

import Layout1 from './4_3-1p.vue';

Vue.use(VueRouter);
Vue.prototype.$sc = new SpeedcontrolUtil(nodecg);

const routes = [
  { name: '4:3 1 Player', path: '/4_3-1p', component: Layout1 },
  { path: '*', redirect: '/4_3-1p' },
];

const router = new VueRouter({
  routes,
});

// Used to send when the layout is changed to the server.
function layoutChanged(route) {
  nodecg.sendMessage('layoutChange', {
    name: route.name,
    path: route.path,
  });
}

nodecg.sendMessage('gameLayoutGraphicOpened');

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
