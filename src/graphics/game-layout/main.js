import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';

Vue.use(VueRouter);

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  render: h => h(App),
});
