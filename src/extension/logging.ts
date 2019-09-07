import speedcontrolUtil from 'speedcontrol-util';
import { CurrentSponsorLogo } from '../../schemas';
import * as nodecgApiContext from './util/nodecg-api-context';
import { bundleConfig } from './util/nodecg-bundleconfig';
import obs from './util/obs';
import { send as mqSend } from './util/rabbitmq';

const nodecg = nodecgApiContext.get();
const sc = new speedcontrolUtil(nodecg);
const currentSponsorLogo = nodecg.Replicant<CurrentSponsorLogo>(
  'currentSponsorLogo',
  { persistent: false },
);

const obsGameLayoutScene = bundleConfig.obs.names.scenes.gameLayout;

let currentScene: string;
let lastScene: string;
let lastSponsorLogoSum: string | undefined;
let streaming: boolean = false;

// This will always be set due to there being a default in the configschema,
// make sure that is correct!
const evtString = (
  Array.isArray(bundleConfig.tracker.events)
) ? bundleConfig.tracker.events[bundleConfig.tracker.streamEvent - 1] : bundleConfig.tracker.events;

obs.on('ConnectionOpened', async () => {
  try {
    const sceneData = await obs.send('GetCurrentScene');
    const streamingData = await obs.send('GetStreamingStatus');
    streaming = streamingData.streaming;
    lastScene = currentScene;
    currentScene = sceneData.name;
    if (lastScene === currentScene) {
      return;
    }
    if (lastScene) {
      logSceneSwitch(lastScene, 'end');
    }
    logSceneSwitch(currentScene, 'start');
    checkSponsorLogoVisibility();
  } catch (err) {
    // silently drop it for now
  }
});

obs.on('SwitchScenes', (data) => {
  lastScene = currentScene;
  currentScene = data['scene-name'];
  if (lastScene === currentScene) {
    return;
  }
  logSceneSwitch(lastScene, 'end');
  logSceneSwitch(currentScene, 'start');
  checkSponsorLogoVisibility();
});

obs.on('StreamStarted', () => {
  streaming = true;
  checkSponsorLogoVisibility();
});
obs.on('StreamStopped', () => {
  streaming = false;
  logSponsorLogoChange();
});

// Currently also logs when the server starts up, do we need to change that?
sc.runDataActiveRun.on('change', logRunChange);

sc.on('timerStarted', () => logTimerChange('started'));
sc.on('timerPaused', () => logTimerChange('paused'));
sc.on('timerResumed', () => logTimerChange('resumed'));
sc.on('timerStopped', () => logTimerChange('finished'));
sc.on('timerReset', () => logTimerChange('reset'));
sc.on('timerEdited', () => logTimerChange('edited'));
sc.on('timerTeamStopped', id => logTimerChange('team_finished', id));
sc.on('timerTeamStopUndone', id => logTimerChange('team_undid_finish', id));

// Currently check to see if the sponsor logo is visible is "hardcoded" to certain layouts.
function checkSponsorLogoVisibility() {
  if (streaming && currentScene) {
    const scene = currentScene.toLowerCase();
    const intermission = bundleConfig.obs.names.scenes.intermission.toLowerCase();
    const gameLayout = bundleConfig.obs.names.scenes.gameLayout.toLowerCase();
    if ((scene.includes(intermission) && !scene.includes('hosts')) || scene.includes(gameLayout)) {
      logSponsorLogoChange(currentSponsorLogo.value);
    } else {
      logSponsorLogoChange();
    }
  }
}

currentSponsorLogo.on('change', () => {
  checkSponsorLogoVisibility();
});

function getTimeInfo() {
  const nowDate: Date = new Date();

  return {
    unix: nowDate.getTime() / 1000,
    iso: nowDate.toISOString(),
  };
}

function logSceneSwitch(name: string, action: string = 'start') {
  const isGameScene: boolean = name === obsGameLayoutScene;
  const safeName: string = name.replace(/[. ]/g, '_');
  const gameSceneSuffix: string = isGameScene ? '.gamescene' : '';

  mqSend(
    `obs.scene.${safeName}.${action}${gameSceneSuffix}`,
    {
      action,
      event: evtString,
      scene: name,
      gameScene: isGameScene,
      time: getTimeInfo(),
    },
  );
}

function logTimerChange(desc: string, teamID?: number) {
  const teamFix: string = teamID ? `team.${teamID}.` : '';

  mqSend(
    `timer.${teamFix}${desc}`,
    {
      desc,
      event: evtString,
      teamID: teamID || undefined,
      timer: sc.timer.value,
      time: getTimeInfo(),
    },
  );
}

function logRunChange() {
  mqSend(
    'run.changed',
    {
      event: evtString,
      run: sc.getCurrentRun(),
      time: getTimeInfo(),
    },
  );
}

function logSponsorLogoChange(logo?: CurrentSponsorLogo) {
  // Don't log if the logo didn't actually change.
  const currentSum = (logo) ? logo.sum : undefined;
  if (lastSponsorLogoSum !== currentSum) {
    lastSponsorLogoSum = currentSum;

    mqSend(
      'sponsor.logo.changed',
      {
        logo: (logo) ? logo.name : undefined,
        length: (logo) ? logo.seconds : undefined,
        event: evtString,
        time: getTimeInfo(),
      },
    );
  }
}
