// TODO: Rewrite this whole file I think!

import { Configschema } from 'configschema';
import { SponsorLogos } from 'schemas';
import SpeedcontrolUtil from 'speedcontrol-util';
import { getCurrentEventShort } from './util/helpers';
import { get as nodecg } from './util/nodecg';
import obs from './util/obs';
import { send as mqSend } from './util/rabbitmq';
import { assetsSponsorLogos, sponsorLogos } from './util/replicants';

const config = nodecg().bundleConfig as Configschema;
const sc = new SpeedcontrolUtil(nodecg());
const obsGameLayoutScene = config.obs.names.scenes.gameLayout;
const event = getCurrentEventShort();
let currentScene = '';
let lastScene: string | undefined;
let lastSponsorLogoSum: string | undefined;
let streaming = false;

function getTimeInfo(): { unix: number; iso: string } {
  const nowDate: Date = new Date();

  return {
    unix: nowDate.getTime() / 1000,
    iso: nowDate.toISOString(),
  };
}

function logSceneSwitch(name: string, action = 'start'): void {
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

function logTimerChange(desc: string, teamID?: string): void {
  const teamFix: string = teamID ? `team.${teamID}.` : '';

  mqSend(
    `timer.${teamFix}${desc}`,
    {
      desc,
      event,
      teamID: teamID || undefined,
      timer: sc.timer.value,
      time: getTimeInfo(),
    },
  );
}

export function logRunChange(): void {
  const run = sc.getCurrentRun();
  const data = {
    event,
    run,
    // stream: [] as { channel: string }[],
    time: getTimeInfo(),
  };
  /* if (restreamViewerTool.value.channel) {
    data.stream = [{ channel: restreamViewerTool.value.channel }];
  } */
  mqSend(
    'run.changed',
    data,
  );
}

function logSponsorLogoChange(logo?: SponsorLogos['rotation'][0]): void {
  // Don't log if the logo didn't actually change.
  const currentSum = (logo) ? logo.sum : undefined;
  if (lastSponsorLogoSum !== currentSum) {
    lastSponsorLogoSum = currentSum;
    const name = assetsSponsorLogos.value.find((a) => a.sum === logo?.sum)?.name;

    mqSend(
      'sponsor.logo.changed',
      {
        logo: name || undefined,
        length: (logo) ? logo.seconds : undefined,
        event,
        time: getTimeInfo(),
      },
    );
  }
}

// Currently check to see if the sponsor logo is visible is "hardcoded" to certain layouts.
function checkSponsorLogoVisibility(): void {
  if (streaming && currentScene) {
    const scene = currentScene.toLowerCase();
    const intermission = config.obs.names.scenes.intermission.toLowerCase();
    const gameLayout = config.obs.names.scenes.gameLayout.toLowerCase();
    if ((scene.includes(intermission) && !scene.includes('hosts')) || scene.includes(gameLayout)) {
      const logo = sponsorLogos.value.rotation.find((l) => l.id === sponsorLogos.value.current?.id);
      logSponsorLogoChange(logo);
    } else {
      logSponsorLogoChange();
    }
  }
}

// Currently also logs when the server starts up, do we need to change that?
sc.runDataActiveRun.on('change', logRunChange);

sc.on('timerStarted', () => logTimerChange('started'));
sc.on('timerPaused', () => logTimerChange('paused'));
sc.on('timerResumed', () => logTimerChange('resumed'));
sc.on('timerStopped', () => logTimerChange('finished'));
sc.on('timerReset', () => logTimerChange('reset'));
sc.on('timerEdited', () => logTimerChange('edited'));
sc.on('timerTeamStopped', (id) => logTimerChange('team_finished', id));
sc.on('timerTeamUndone', (id) => logTimerChange('team_undid_finish', id));

obs.conn.on('ConnectionOpened', async () => {
  try {
    const streamingData = await obs.conn.send('GetStreamingStatus');
    const scene = await obs.conn.send('GetCurrentScene');
    streaming = streamingData.streaming;
    currentScene = scene.name;
    if (lastScene === currentScene) {
      return;
    }
    if (lastScene) {
      logSceneSwitch(lastScene, 'end');
    }
    logSceneSwitch(currentScene, 'start');
    checkSponsorLogoVisibility();
  } catch (err) {
    // drop for now
  }
});
obs.conn.on('ConnectionClosed', () => {
  currentScene = '';
});
obs.conn.on('StreamStarted', () => {
  streaming = true;
  checkSponsorLogoVisibility();
});
obs.conn.on('StreamStopped', () => {
  streaming = false;
  checkSponsorLogoVisibility();
});
obs.conn.on('SwitchScenes', (data) => {
  lastScene = currentScene;
  currentScene = data['scene-name'];
  if (lastScene === currentScene) {
    return;
  }
  logSceneSwitch(lastScene, 'end');
  logSceneSwitch(currentScene, 'start');
  checkSponsorLogoVisibility();
});

// Checks if the current sponsor logo has changed, or if we just booted up and have one.
sponsorLogos.on('change', (newVal, oldVal) => {
  if ((!oldVal && newVal.current) || (oldVal && oldVal.current && newVal
    && newVal.current && newVal.current.id !== oldVal.current.id)) {
    checkSponsorLogoVisibility();
  }
});
