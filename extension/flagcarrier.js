"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const misc_1 = require("./misc");
const helpers_1 = require("./util/helpers");
const nodecg_1 = require("./util/nodecg");
const rabbitmq_1 = require("./util/rabbitmq");
const replicants_1 = require("./util/replicants");
const router = (0, nodecg_1.get)().Router();
const config = (0, nodecg_1.get)().bundleConfig;
const allowedDevices = !Array.isArray(config.flagcarrier.allowedDevices)
    && typeof config.flagcarrier.allowedDevices === 'string'
    ? [config.flagcarrier.allowedDevices]
    : config.flagcarrier.allowedDevices || [];
function setup() {
    // RabbitMQ events from the "big red buttons", used for players/commentators.
    rabbitmq_1.mq.evt.on('bigbuttonTagScanned', async (data) => {
        if (config.event.thisEvent === 1 && data.flagcarrier.group === 'stream1') {
            const name = data.user.displayName;
            const pronouns = data.raw.pronouns;
            let str = pronouns ? `${name} (${pronouns})` : name;
            str = await (0, misc_1.searchSrcomPronouns)(str);
            (0, nodecg_1.get)().sendMessage('bigbuttonTagScanned', { id: data.flagcarrier.id, str });
            if (!replicants_1.commentators.value.includes(str)) {
                replicants_1.commentators.value.push(str);
                (0, nodecg_1.get)().log.debug('[FlagCarrier] Added new commentator:', str);
            }
        }
    });
    // HTTP endpoint, used for donation readers.
    router.post('/flagcarrier', async (req, res) => {
        const device = req.body.device_id;
        const action = req.body.action;
        if (allowedDevices.length && !allowedDevices.includes(device)) {
            (0, helpers_1.logError)('[FlagCarrier] Device ID "%s" tried to change users but was denied', req.body, device);
            return res.status(403).send('Device ID is not allowed to make changes.');
        }
        if (req.body.group_id !== config.flagcarrier.group) {
            return res.status(400).send('Group ID supplied not used on this endpoint.');
        }
        // clear, login_clear
        // Unfortunately currently flagcarrier's "clear" command is for an entire group,
        // but because we only serve donation reader here, we're OK.
        if (action.endsWith('clear')) {
            replicants_1.donationReader.value = null;
            (0, nodecg_1.get)().log.info('[FlagCarrier] Donation reader was cleared (DeviceID: %s)', device);
            // If not also a login command, will respond with this message.
            if (action !== 'login_clear') {
                return res.send('Donation reader has been cleared.');
            }
        }
        // Donation Reader: login, login_clear
        if (req.body.position === 'reader' && action.startsWith('login')) {
            const data = req.body.tag_data;
            const str = data.pronouns ? `${data.display_name} (${data.pronouns})` : data.display_name;
            replicants_1.donationReader.value = await (0, misc_1.searchSrcomPronouns)(str);
            (0, nodecg_1.get)().log.info('[FlagCarrier] Donation reader was updated (Name: %s, DeviceID: %s)', str, device);
            return res.send('You\'ve been logged in.');
        }
        // Reject other positions.
        if (req.body.position !== 'reader') {
            return res.status(400).send('Position not used on this endpoint.');
        }
        // Reject anything else.
        return res.status(400).send('Request not applicable to this endpoint.');
    });
    (0, nodecg_1.get)().mount(`/${(0, nodecg_1.get)().bundleName}`, router);
}
if (config.flagcarrier.enabled) {
    setup();
    (0, nodecg_1.get)().log.info('[FlagCarrier] Integration enabled (target URL: %s://%s/%s/flagcarrier)', ((_a = (0, nodecg_1.get)().config.ssl) === null || _a === void 0 ? void 0 : _a.enabled) ? 'https' : 'http', (0, nodecg_1.get)().config.baseURL, (0, nodecg_1.get)().bundleName);
}
