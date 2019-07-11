import Vue from 'vue';
import App from './main.vue';

// eslint-disable-next-line import/prefer-default-export
export const serverBus = new Vue();

// This sends a tick event every 5s for synced changes.
setInterval(() => {
  serverBus.$emit('tick');
}, 5000);

// eslint-disable-next-line no-new
new Vue({
  el: '#App',
  render: h => h(App),
});
