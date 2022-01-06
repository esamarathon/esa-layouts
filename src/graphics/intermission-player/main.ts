/* eslint no-new: off, @typescript-eslint/explicit-function-return-type: off */

import { UpcomingRunID } from '@esa-layouts/types/schemas';
import { SpeedcontrolUtilBrowser } from 'speedcontrol-util';
import { RunData } from 'speedcontrol-util/types';
import Vue from 'vue';
import '../_misc/fonts/barlow-condensed.css';
import '../_misc/theme';
import './common.css';
import App from './main.vue';
import waitForReplicants from './store';

const sc = new SpeedcontrolUtilBrowser(nodecg);

// Gets next run based on the ID supplied.
function getNextRun(id: UpcomingRunID): RunData | null {
  const runIndex = sc.findRunIndex(id);
  if (runIndex >= 0) {
    return sc.getRunDataArray()[runIndex] ?? null;
  }
  return null;
}

waitForReplicants().then((store) => {
  store.watch(() => store.state.upcomingRunID, (val) => {
    store.commit('setNextRun', getNextRun(val));
  }, { immediate: true });

  new Vue({
    store,
    el: '#App',
    render: (h) => h(App),
  });
});
