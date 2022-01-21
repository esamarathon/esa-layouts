import { Configschema } from '@esa-layouts/types/schemas';
import { searchSrcomPronouns } from './misc';
import { logError } from './util/helpers';
import { get as nodecg } from './util/nodecg';
import { mq } from './util/rabbitmq';
import { commentators, donationReader } from './util/replicants';

const router = nodecg().Router();
const config = nodecg().bundleConfig as Configschema;
const allowedDevices = !Array.isArray(config.flagcarrier.allowedDevices)
  && typeof config.flagcarrier.allowedDevices === 'string'
  ? [config.flagcarrier.allowedDevices]
  : config.flagcarrier.allowedDevices || [];

function setup(): void {
  // RabbitMQ events from the "big red buttons", used for players/commentators.
  mq.evt.on('bigbuttonTagScanned', (data) => {
    if (config.event.thisEvent === 1 && data.flagcarrier.group === 'stream1') {
      const name = data.user.displayName;
      nodecg().sendMessage('bigbuttonTagScanned', data);
      if (!commentators.value.includes(name)) {
        commentators.value.push(name);
        nodecg().log.debug('[FlagCarrier] Added new commentator:', name);
      }
    }
  });

  // HTTP endpoint, used for donation readers.
  router.post('/flagcarrier', async (req, res) => {
    const device = req.body.device_id as string;
    const action = req.body.action as string;
    if (allowedDevices.length && !allowedDevices.includes(device)) {
      logError(
        '[FlagCarrier] Device ID "%s" tried to change users but was denied',
        req.body,
        device,
      );
      return res.status(403).send('Device ID is not allowed to make changes.');
    }
    if (req.body.group_id !== config.flagcarrier.group) {
      return res.status(400).send('Group ID supplied not used on this endpoint.');
    }

    // clear, login_clear
    // Unfortunately currently flagcarrier's "clear" command is for an entire group,
    // but because we only serve donation reader here, we're OK.
    if (action.endsWith('clear')) {
      donationReader.value = null;
      nodecg().log.info('[FlagCarrier] Donation reader was cleared (DeviceID: %s)', device);
      // If not also a login command, will respond with this message.
      if (action !== 'login_clear') {
        return res.send('Donation reader has been cleared.');
      }
    }

    // Donation Reader: login, login_clear
    if (req.body.position === 'reader' && action.startsWith('login')) {
      const data = req.body.tag_data;
      if (data.pronouns) donationReader.value = `${data.display_name} (${data.pronouns})`;
      else donationReader.value = await searchSrcomPronouns(data.display_name);
      nodecg().log.info(
        '[FlagCarrier] Donation reader was updated (Name: %s, DeviceID: %s)',
        req.body.tag_data.display_name,
        device,
      );
      return res.send('You\'ve been logged in.');
    }
    // Reject other positions.
    if (req.body.position !== 'reader') {
      return res.status(400).send('Position not used on this endpoint.');
    }

    // Reject anything else.
    return res.status(400).send('Request not applicable to this endpoint.');
  });

  nodecg().mount(`/${nodecg().bundleName}`, router);
}

if (config.flagcarrier.enabled) {
  setup();
  nodecg().log.info(
    '[FlagCarrier] Integration enabled (target URL: %s://%s/%s/flagcarrier)',
    nodecg().config.ssl?.enabled ? 'https' : 'http',
    nodecg().config.baseURL,
    nodecg().bundleName,
  );
}
