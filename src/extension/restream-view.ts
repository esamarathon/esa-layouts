import SpeedcontrolUtil from 'speedcontrol-util';
import { get as nodecg } from './util/nodecg';
import * as mq from './util/rabbitmq';
import { restreamViewerTool } from './util/replicants';

const sc = new SpeedcontrolUtil(nodecg());

// Received when we need to tweak the OBS source for the stream.
mq.evt.on('rvtServerStarted', (data) => {
  // tweak OBS source here
});

sc.runDataActiveRun.on('change', (newVal, oldVal) => {
  if (newVal?.id !== oldVal?.id) {
    let channel;
    if (newVal && newVal.teams.length && newVal.teams[0].players.length
      && newVal.teams[0].players[0].social.twitch) {
      channel = newVal.teams[0].players[0].social.twitch;
    }
    restreamViewerTool.value.overridden = false;
    restreamViewerTool.value.channel = channel;
  }
});
