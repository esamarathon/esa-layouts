import type { MediaBox } from '@esa-layouts/types/schemas';
import type { NodeCG as mqTypes } from '@esamarathon/mq-events/types';
import type { RunData } from 'speedcontrol-util/types';
import mb from './mediabox';
import { mq } from './rabbitmq';
import { assetsMediaBoxImages, assetsVideos } from './replicants';
import { sc } from './speedcontrol';

/**
 * Logs OBS streaming status changes.
 * @param streaming If the streaming was started or stopped.
 */
export function logStreamingStatusChange(streaming: boolean): void {
  mq.send(
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
export function logSceneSwitch(name: string, action: 'end' | 'start', isGameScene: boolean): void {
  mq.send(
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
  mq.send(
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
  mq.send(
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
export function logSponsorLogoChange(logo?: MediaBox['current']): void {
  const logoInfo = mb.mediaBox.value.rotation.find((l) => l.id === logo?.id);
  const asset = assetsMediaBoxImages.value.find((a) => a.sum === logo?.mediaUUID);
  mq.send(
    'sponsor.logo.changed',
    {
      logo: logo?.type === 'image' ? asset?.name : undefined,
      length: logo?.type === 'image' ? logoInfo?.seconds : undefined,
    } as mqTypes.SponsorLogoChanged,
  );
}

export function logVideoPlay(sum: string): void {
  const asset = assetsVideos.value.find((a) => a.sum === sum);
  if (asset) {
    mq.send(
      'video.played',
      {
        name: asset.name,
      } as mqTypes.VideoPlayed,
    );
  }
}
