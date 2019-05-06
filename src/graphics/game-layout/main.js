import Vue from 'vue';
import VueRouter from 'vue-router';

import Layout1 from './4_3-1p.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/4_3-1p', component: Layout1 },
];

const router = new VueRouter({
  routes,
});

// eslint-disable-next-line no-unused-vars
const app = new Vue({
  router,
}).$mount('#app');
