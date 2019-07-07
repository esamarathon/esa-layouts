import speedcontrolUtil from 'speedcontrol-util';
import * as nodecgApiContext from './util/nodecg-api-context';
import { bundleConfig } from './util/nodecg-bundleconfig';
import obs from './util/obs';
import { send as mqSend } from './util/rabbitmq';

const nodecg = nodecgApiContext.get();
const sc = new speedcontrolUtil(nodecg);
const currentSponsorLogo = nodecg.Replicant<string>('currentSponsorLogo', { persistent: false });

const obsGameLayoutScene = bundleConfig.obs.names.scenes.gameLayout;

let currentScene: string;
let lastScene: string;
let lastSponsorLogo: string | undefined;

// This will always be set due to there being a default in the configschema,
// make sure that is correct!
const evtString = (
  Array.isArray(bundleConfig.tracker.events)
) ? bundleConfig.tracker.events[bundleConfig.tracker.streamEvent - 1] : bundleConfig.tracker.events;

obs.on('ConnectionOpened', async () => {
  try {
    const data = await obs.send('GetCurrentScene');
    lastScene = currentScene;
    currentScene = data.name;
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

// Currently also logs when the server starts up, do we need to change that?
sc.runDataActiveRun.on('change', logRunChange);

sc.on('timerStarted', () => logTimerChange('started'));
sc.on('timerPaused', () => logTimerChange('paused'));
sc.on('timerResumed', () => logTimerChange('resumed'));
sc.on('timerFinished', () => logTimerChange('finished'));
sc.on('timerReset', () => logTimerChange('reset'));
sc.on('timerEdited', () => logTimerChange('edited'));
sc.on('timerTeamFinished', id => logTimerChange('team_finished', id));
sc.on('timerTeamUndidFinish', id => logTimerChange('team_undid_finish', id));

// Currently check to see if the sponsor logo is visible is "hardcoded" to certain layouts.
function checkSponsorLogoVisibility() {
  if (currentScene) {
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
    `obs.scene.${safeName}.${evtString}${gameSceneSuffix}`,
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
  const hasTeam: boolean = teamID !== undefined && teamID >= 0;
  const teamFix: string = hasTeam ? `team.${teamID}.` : '';

  mqSend(
    `timer.${teamFix}${desc}`,
    {
      desc,
      event: evtString,
      teamID: hasTeam ? teamID : undefined,
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

function logSponsorLogoChange(logo?: string) {
  // Don't log if the logo didn't actually change.
  if (lastSponsorLogo !== logo) {
    lastSponsorLogo = logo;
    console.log(logo);

    mqSend(
      'sponsor.logo.changed',
      {
        logo,
        event: evtString,
        time: getTimeInfo(),
      },
    );
  }
}
