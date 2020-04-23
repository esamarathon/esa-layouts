import type { NodeCG as mqTypes } from '@esamarathon/mq-events/types';
import type { Configschema } from 'configschema';
import type { SponsorLogos } from 'schemas';
import SpeedcontrolUtil from 'speedcontrol-util';
import type { RunData } from '../../../nodecg-speedcontrol/types';
import { get as nodecg } from './util/nodecg';
import { send as mqSend } from './util/rabbitmq';
import { assetsSponsorLogos, sponsorLogos } from './util/replicants';

const config = nodecg().bundleConfig as Configschema;
const sc = new SpeedcontrolUtil(nodecg());

/**
 * Logs OBS streaming status changes.
 * @param streaming If the streaming was started or stopped.
 */
export function logStreamingStatusChange(streaming: boolean): void {
  mqSend(
    `obs.stream.${streaming ? 'start' : 'stop'}`,
    {
      streaming,
    } as mqTypes.OBSStreamingStatusChanged,
  );
}

/**
 * Logs OBS scene changes.
 * @param name Name of scene.
 * @param action If this is the start or end of the scene being shown.
 */
export function logSceneSwitch(name: string, action: 'end' | 'start'): void {
  const isGameScene = name === config.obs.names.scenes.gameLayout;
  mqSend(
    `obs.scene.${name.replace(/[. ]/g, '_')}.${action}${isGameScene ? '.gamescene' : ''}`,
    {
      action,
      scene: name,
      gameScene: isGameScene,
    } as mqTypes.OBSSceneChanged,
  );
}

/**
 * Logs changes to the timer.
 * @param desc Description of change type.
 * @param teamID ID of team this change applies to, if applicable.
 */
export function logTimerChange(
  desc: mqTypes.SCTimerChanged['desc'],
  teamID?: mqTypes.SCTimerChanged['teamID'],
): void {
  mqSend(
    `timer.${teamID ? `team.${teamID}.` : ''}${desc}`,
    {
      desc,
      teamID: teamID || undefined,
      timer: sc.timer.value,
    } as mqTypes.SCTimerChanged,
  );
}

/**
 * Logs the current run when triggered.
 * @param run: Run Data object.
 */
export function logRunChange(run?: RunData): void {
  mqSend(
    'run.changed',
    {
      run,
    } as mqTypes.SCActiveRunChanged,
  );
}

// TODO: stuff that is logged needs changing to be more accurate
//       We should add sum in case the name cannot be found, just as a backup
/**
 * Logos the current sponsor logo when triggered.
 * @param logo Sponsor logo object.
 */
export function logSponsorLogoChange(logo?: SponsorLogos['current'] | null): void {
  const logoInfo = sponsorLogos.value.rotation.find((l) => l.id === logo?.id);
  const asset = assetsSponsorLogos.value.find((a) => a.sum === logo?.sum);
  mqSend(
    'sponsor.logo.changed',
    {
      logo: asset?.name,
      length: logoInfo?.seconds,
    } as mqTypes.SponsorLogoChanged,
  );
}
