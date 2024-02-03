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
    // Timer
    // TODO: Add team support.
    timer: {
      name: 'Timer Toggle (nodecg-speedcontrol)',
      description: 'Can start/resume/stop/reset the nodecg-speedcontrol timer, '
        + 'depending on it\'s current state.',
      options: [
        {
          type: 'static-text',
          id: 'warning',
          label: 'Warning',
          // not showing, why?
          value: 'Currently this does not work fully with runs with multiple teams, '
            + 'and will only stop the first team (all other functionality works).',
        },
      ],
      callback: () => {
        instance.wsSend({ name: 'timer_toggle' });
      },
    },
  });
}
export default initActions;
