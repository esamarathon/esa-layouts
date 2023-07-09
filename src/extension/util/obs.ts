import OBS from '@shared/extension/obs';
import { logError } from './helpers';
import { get as nodecg } from './nodecg';
import { currentRunDelay, obsData } from './replicants';

const config = nodecg().bundleConfig.obs;
const obs = new OBS(nodecg(), config);
let sceneChangeCodeTriggered = 0;

export async function changeScene(
  { scene, force = false }: { scene: string, force?: boolean },
): Promise<boolean> {
  // Don't change scene if identical, we're currently transitioning, transitioning is disabled,
  // or if we triggered a scene change here in the last 2 seconds.
  if (sceneChangeCodeTriggered > (Date.now() - 2000)
    || obs.isCurrentScene(scene)
    || (!force && (obsData.value.transitioning
    || obsData.value.disableTransitioning))) {
    return false;
  }
  try {
    if (currentRunDelay.value.audio === 0
      || (!obs.isCurrentScene(config.names.scenes.gameLayout)
      && obs.findScene(scene) !== config.names.scenes.gameLayout)) {
      await obs.changeScene(scene);
      sceneChangeCodeTriggered = Date.now();
    } else {
      const delay = currentRunDelay.value.audio;
      obsData.value.disableTransitioning = true;
      obsData.value.transitionTimestamp = Date.now() + delay;
      // Simple server-to-server message we need.
      nodecg().sendMessage('obsTransitionQueued', scene);
      try {
        await new Promise((res) => { setTimeout(res, delay); });
        obsData.value.disableTransitioning = false;
        await obs.changeScene(scene);
        sceneChangeCodeTriggered = Date.now();
      } catch (err) {
        logError('[Layouts] Could not change scene (on delay) [name: %s]', err, scene);
      }
    }
  } catch (err) {
    logError('[Layouts] Could not change scene [name: %s]', err, scene);
  }
  return true;
}

nodecg().listenFor('obsChangeScene', changeScene);

export default obs;
