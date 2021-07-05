import Vue from 'vue';
import '../_misc/common.css';
import '../_misc/defaults.css';
import '../_misc/theme';
import App from './main.vue';

// eslint-disable-next-line no-new
new Vue({
  el: '#App',
  render: (h) => h(App),
});
