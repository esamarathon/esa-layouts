/* eslint no-new: off, @typescript-eslint/explicit-function-return-type: off */

import { UpcomingRunID } from '@/types/schemas';
import SpeedcontrolUtil from 'speedcontrol-util/browser';
import type { RunData } from 'speedcontrol-util/types';
import Vue from 'vue';
import '../_misc/fonts/barlow-condensed.css';
import '../_misc/theme';
import './common.css';
import App from './main.vue';
import waitForReplicants from './store';

const sc = new SpeedcontrolUtil(nodecg);

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
