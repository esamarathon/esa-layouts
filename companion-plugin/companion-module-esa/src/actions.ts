import type ModuleInstance from './index';

/**
 * Called by module instance class when actions should be set up.
 * @param instance Copy of current module instance class
 */
function initActions(instance: ModuleInstance) {
  instance.setActionDefinitions({
    // Blank action that can be attached if connection status is needed but nothing else.
    // There may be another way of doing this, just not found it yet?
    blank: {
      name: 'Blank',
      description: 'Intentionally blank; can be used to show connection status.',
      options: [],
      callback: () => {},
    },
    // Timer Toggle
    // TODO: Add team support.
    timer_toggle: {
      name: 'Timer Toggle (nodecg-speedcontrol)',
      description: 'Can start/resume/stop/reset the nodecg-speedcontrol timer, '
        + 'depending on it\'s current state.',
      options: [
        // TODO: This does not show the value, and I don't know why.
        {
          type: 'static-text',
          id: 'warning',
          label: 'Warning',
          value: 'Currently this does not work fully with runs with multiple teams, '
            + 'and will only stop the first team (all other functionality works).',
        },
      ],
      callback: () => {
        instance.wsSend({ name: 'timer_toggle' });
      },
    },
    player_hud_trigger_toggle: {
      name: 'Player HUD Trigger Toggle',
      description: 'Toggles on/off the specified type, '
        + 'used for displaying things on the player HUD graphic.',
      options: [
        {
          id: 'type',
          type: 'dropdown',
          label: 'Type',
          choices: [
            { id: 'message', label: 'Message' },
          ],
          default: 'message',
        },
      ],
      callback: (action) => {
        instance.wsSend({ name: 'player_hud_trigger_toggle', value: action.options.type });
      },
    },
    twitch_commercials_disable: {
      name: 'Twitch Commercials Disable (esa-commercials)',
      description: 'Disables Twitch commercials for the remainder of a run, if applicable.',
      options: [],
      callback: () => {
        // We don't do any checks here in regards to if action is valid.
        instance.wsSend({ name: 'twitch_commercials_disable' });
      },
    },
  });
}
export default initActions;
