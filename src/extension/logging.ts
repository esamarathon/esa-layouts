import { Configschema } from 'configschema';
import SpeedcontrolUtil from 'speedcontrol-util';
import { getCurrentEventShort } from './util/helpers';
import { get as nodecg } from './util/nodecg';
import obs from './util/obs';
import { send as mqSend } from './util/rabbitmq';

const config = nodecg().bundleConfig as Configschema;
const sc = new SpeedcontrolUtil(nodecg());
const obsGameLayoutScene = config.obs.names.scenes.gameLayout;
const event = getCurrentEventShort();
let currentScene: string | undefined;
let lastScene: string;
let lastSponsorLogoSum: string | undefined;
let streaming = false;

obs.on('ConnectionOpened', async () => {
  try {
    const streamingData = await obs.send('GetStreamingStatus');
    const scene = await obs.send('GetCurrentScene');
    streaming = streamingData.streaming;
    currentScene = scene.name;
  } catch (err) {
    // drop for now
  }
});
obs.on('ConnectionClosed', () => {
  currentScene = undefined;
});
obs.on('StreamStarted', () => {
  streaming = true;
  // log the logo change
});
obs.on('StreamStopped', () => {
  streaming = false;
  // log the logo change
});
obs.on('SwitchScenes', (data) => {
  currentScene = data['scene-name'];
});

obs.on('ConnectionOpened', async () => {
  try {
    if (lastScene === currentScene) {
      return;
    }
    if (lastScene) {
      logSceneSwitch(lastScene, 'end');
    }
    // logSceneSwitch(currentScene, 'start');
    checkSponsorLogoVisibility();
  } catch (err) {
    // silently drop it for now
  }
});

obs.on('SwitchScenes', (data) => {
  // lastScene = currentScene;
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
sc.on('timerStopped', () => logTimerChange('finished'));
sc.on('timerReset', () => logTimerChange('reset'));
sc.on('timerEdited', () => logTimerChange('edited'));
sc.on('timerTeamStopped', id => logTimerChange('team_finished', id));
sc.on('timerTeamUndone', id => logTimerChange('team_undid_finish', id));

// Currently check to see if the sponsor logo is visible is "hardcoded" to certain layouts.
function checkSponsorLogoVisibility() {
  if (streaming && currentScene) {
    const scene = currentScene.toLowerCase();
    const intermission = config.obs.names.scenes.intermission.toLowerCase();
    const gameLayout = config.obs.names.scenes.gameLayout.toLowerCase();
    if ((scene.includes(intermission) && !scene.includes('hosts')) || scene.includes(gameLayout)) {
      // logSponsorLogoChange(currentSponsorLogo.value);
    } else {
      // logSponsorLogoChange();
    }
  }
}

/* currentSponsorLogo.on('change', () => {
  checkSponsorLogoVisibility();
}); */

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
      event,
      scene: name,
      gameScene: isGameScene,
      time: getTimeInfo(),
    },
  );
}

function logTimerChange(desc: string, teamID?: string) {
  const teamFix: string = teamID ? `team.${teamID}.` : '';

  mqSend(
    `timer.${teamFix}${desc}`,
    {
      desc,
      event: event,
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
      event: event,
      run: sc.getCurrentRun(),
      time: getTimeInfo(),
    },
  );
}

/* function logSponsorLogoChange(logo?: CurrentSponsorLogo) {
  // Don't log if the logo didn't actually change.
  const currentSum = (logo) ? logo.sum : undefined;
  if (lastSponsorLogoSum !== currentSum) {
    lastSponsorLogoSum = currentSum;

    mqSend(
      'sponsor.logo.changed',
      {
        logo: (logo) ? logo.name : undefined,
        length: (logo) ? logo.seconds : undefined,
        event: event,
        time: getTimeInfo(),
      },
    );
  }
} */
