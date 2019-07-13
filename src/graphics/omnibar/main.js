import SpeedcontrolUtil from 'speedcontrol-util';
import Vue from 'vue';
import App from './main.vue';

Vue.prototype.$sc = new SpeedcontrolUtil(nodecg);

// eslint-disable-next-line no-new
new Vue({
  el: '#App',
  render: h => h(App),
});
