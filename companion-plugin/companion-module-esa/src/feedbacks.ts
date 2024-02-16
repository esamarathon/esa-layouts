import { CompanionFeedbackDefinition, InstanceBase } from '@companion-module/base';
import { findBestMatch } from 'string-similarity';
import { Config } from './config';

let instance: InstanceBase<Config>;

// Defaults, will be overwritten!
// TODO: Store in variables? Maybe not?
let sceneKeys: { [k: string]: string } = {
  commercials: 'Intermission (commercials)',
  gameLayout: 'Game Layout',
  readerIntroduction: 'Reader Introduction',
  intermission: 'Intermission',
  intermissionPlayer: 'Intermission Player',
  countdown: 'Countdown',
};

// TODO: Replace this with Companion's "learn" feature?
export function setObsSceneKeys(val: typeof sceneKeys) {
  sceneKeys = val;
}

// COPIED FROM esa-layouts-shared FOR NOW!
/**
 * Find scene based on string; at least the start of the name should be supplied.
 * @param name Name of scene, at least starting of name.
 */
function findScene(name: string): string | undefined {
  let match: string | undefined;
  // Assumes that the obs_scene_list variable is a JSON stringified array.
  const matches = (JSON.parse(
    instance.getVariableValue('obs_scene_list')?.toString() || '[]',
  ) as string[]).filter((s) => s.startsWith(name));
  if (matches.length > 1) {
    const bestMatches = findBestMatch(name, matches);
    match = bestMatches.bestMatch.target;
  } else if (matches.length === 1) {
    [match] = matches;
  }
  return match;
}

// COPIED FROM esa-layouts-shared FOR NOW!
/**
 * Check if we are on a specified scene; at least the start of the name should be supplied.
 * @param name Name of scene to check we are on, at least starting of name.
 */
function isCurrentScene(name: string): boolean {
  return !!instance.getVariableValue('obs_scene')
  && instance.getVariableValue('obs_scene') === findScene(name);
}

// Defined as an additional function so we can update the choices dropdown on connection.
export const obsSceneFeedback = (): CompanionFeedbackDefinition => ({
  type: 'boolean',
  name: 'When OBS scene is active',
  defaultStyle: {},
  options: [
    {
      type: 'multidropdown',
      label: 'Scene(s)',
      id: 'scenes',
      choices: Object.entries(sceneKeys).map(([k, v]) => ({ id: k, label: v })),
      default: [],
    },
  ],
  callback: (feedback) => {
    const scenes = feedback.options.scenes as string[];
    return !!scenes.find((v) => isCurrentScene(sceneKeys[v]));
  },
});

/**
 * Called by module instance class when feedbacks should be set up.
 * @param instance Copy of current module instance class
 */
export function initFeedbacks(instance_: InstanceBase<Config>) {
  instance = instance_;
  instance.setFeedbackDefinitions({
    obsSceneFeedback: obsSceneFeedback(),
  });
}
