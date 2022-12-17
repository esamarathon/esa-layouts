/* eslint no-new: off, @typescript-eslint/explicit-function-return-type: off */

import { Configschema, UpcomingRunID } from '@esa-layouts/types/schemas';
import { setUpReplicantsComponent as setUpReplicantsMediabox } from '@shared/graphics/mediabox';
import { SpeedcontrolUtilBrowser } from 'speedcontrol-util';
import type { RunData } from 'speedcontrol-util/types';
import Vue from 'vue';
import '../_misc/common.css';
import '../_misc/theme';
import App from './main.vue';
import waitForReplicants from './store';

const sc = new SpeedcontrolUtilBrowser(nodecg);

// Gets next 4 runs based on the ID supplied.
function getNextRuns(id: UpcomingRunID): RunData[] {
  const runIndex = sc.findRunIndex(id);
  if (runIndex >= 0) {
    const amount = (nodecg.bundleConfig as Configschema).event.shorts === 'swcf'
      ? 2
      : 4;
    return sc.getRunDataArray().slice(runIndex, runIndex + amount);
  }
  return [];
}

waitForReplicants().then(async (store) => {
  await setUpReplicantsMediabox();
  store.watch(() => store.state.upcomingRunID, (val) => {
    store.commit('setNextRuns', getNextRuns(val));
  }, { immediate: true });

  new Vue({
    store,
    el: '#App',
    render: (h) => h(App),
  });
});
