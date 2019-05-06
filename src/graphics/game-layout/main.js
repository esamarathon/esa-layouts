import Vue from 'vue';
import VueRouter from 'vue-router';
import SpeedcontrolUtil from 'speedcontrol-util';

import Layout1 from './4_3-1p.vue';

Vue.use(VueRouter);

// auto-injected by NodeCG server
// eslint-disable-next-line no-undef
Vue.prototype.$sc = new SpeedcontrolUtil(nodecg);

const routes = [
  { path: '/4_3-1p', component: Layout1 },
  { path: '*', redirect: '/4_3-1p' },
];

const router = new VueRouter({
  routes,
});

// eslint-disable-next-line no-unused-vars
const app = new Vue({
  router,
}).$mount('#App');
