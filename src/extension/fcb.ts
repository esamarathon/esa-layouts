import { Configschema } from 'configschema';
import needle from 'needle';
import SpeedcontrolUtil from 'speedcontrol-util';
import { get as nodecg } from './util/nodecg';

const config = (nodecg().bundleConfig as Configschema).fcb;
const sc = new SpeedcontrolUtil(nodecg());

// Used to update the featured channels on the bridge running on an external server.
async function setChannels(usernames: string[]): Promise<void> {
  try {
    const resp = await needle(
      'post',
      `https://${config.address}/featured_channels?key=${config.postKey}`,
      JSON.stringify({
        channels: usernames,
      }),
      {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      },
    );
    if (resp.statusCode === 200) {
      nodecg().log.info('[FCB] Successfully sent channels');
    } else {
      nodecg().log.warn('[FCB] Failed to send channels (%s)', resp.statusCode);
    }
  } catch (err) {
    nodecg().log.warn('[FCB] Failed to send channels');
    nodecg().log.debug('[FCB] Failed to send channels', err);
  }
}

if (config.enable) {
  sc.listenFor('repeaterFeaturedChannels', setChannels);
}
