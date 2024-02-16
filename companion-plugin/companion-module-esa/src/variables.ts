import { InstanceBase } from '@companion-module/base';
import { Config } from './config';

/**
 * Called by module instance class when variables should be set up.
 * @param instance Copy of current module instance class
 */
function initVariables(instance: InstanceBase<Config>) {
  instance.setVariableDefinitions([
    {
      variableId: 'timer_time',
      name: 'Timer (nodecg-speedcontrol): Time',
    },
    {
      variableId: 'timer_state',
      name: 'Timer (nodecg-speedcontrol): State',
    },
    {
      variableId: 'timer_changes_disabled',
      name: 'Timer (nodecg-speedcontrol): Changes Disabled',
    },
    {
      variableId: 'player_hud_trigger_type',
      name: 'Player HUD Trigger Type',
    },
    {
      variableId: 'twitch_commercial_timer_seconds_remaining',
      name: 'Twitch Commercial Timer (nodecg-speedcontrol): Seconds Remaining',
    },
    {
      variableId: 'twitch_commercials_disabled',
      name: 'Twitch Commercials Disabled (esa-commercials)',
    },
    // TODO: Use some OBS stuff from an OBS plugin instead?
    {
      variableId: 'obs_connected',
      name: 'OBS: Connected',
    },
    {
      variableId: 'obs_transitioning',
      name: 'OBS: Transitioning',
    },
    {
      variableId: 'obs_transitioning_disabled',
      name: 'OBS: Transitioning Disabled',
    },
    {
      variableId: 'obs_scene',
      name: 'OBS: Current Scene',
    },
    {
      variableId: 'obs_scene_list',
      name: 'OBS: Scene List (JSON stringified array)',
    },
  ]);
}
export default initVariables;
