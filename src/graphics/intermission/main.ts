/* eslint no-new: off, @typescript-eslint/explicit-function-return-type: off */

import { UpcomingRunID } from '@esa-layouts/types/schemas';
import { SpeedcontrolUtilBrowser } from 'speedcontrol-util';
import type { RunData } from 'speedcontrol-util/types';
import Vue from 'vue';
import '../_misc/fonts/barlow-condensed.css';
import '../_misc/theme';
import './common.css';
import App from './main.vue';
import waitForReplicants from './store';

const sc = new SpeedcontrolUtilBrowser(nodecg);

// Gets next 4 runs based on the ID supplied.
function getNextRuns(id: UpcomingRunID): RunData[] {
  const runIndex = sc.findRunIndex(id);
  if (runIndex >= 0) {
    return sc.getRunDataArray().slice(runIndex, runIndex + 4);
  }
  return [];
}

waitForReplicants().then((store) => {
  store.watch(() => store.state.upcomingRunID, (val) => {
    store.commit('setNextRuns', getNextRuns(val));
  }, { immediate: true });

  new Vue({
    store,
    el: '#App',
    render: (h) => h(App),
  });
});
