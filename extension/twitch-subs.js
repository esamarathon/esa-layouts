"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const speedcontrol_util_1 = __importDefault(require("speedcontrol-util"));
const nodecg_1 = require("./util/nodecg");
const replicants_1 = require("./util/replicants");
const sc = new speedcontrol_util_1.default((0, nodecg_1.get)());
const refreshTime = 60 * 1000; // Update every 60s.
async function updateSubscriptionStats() {
    try {
        (0, nodecg_1.get)().log.debug('[Twitch Subs] Attempting to update stats');
        // eslint-disable-next-line camelcase
        const subs = [];
        let cursor;
        let nextPage = true;
        while (nextPage) {
            const endpoint = `/subscriptions?broadcaster_id=${replicants_1.twitchAPIData.value.channelID}&first=100`;
            const resp = await sc.sendMessage('twitchAPIRequest', {
                method: 'get',
                endpoint: `${endpoint}${cursor ? `&after=${cursor}` : ''}`,
                data: null,
                newAPI: true,
            });
            if (resp.body.data && resp.body.data.length > 0) {
                subs.push(...resp.body.data);
                cursor = resp.body.pagination.cursor;
            }
            else {
                nextPage = false;
            }
        }
        const filteredSubs = subs.reduce((prev, sub) => {
            // Either broadcaster or moobot should be filtered out.
            if (sub.user_id === sub.broadcaster_id || sub.user_id === '1564983') {
                return prev;
            }
            let points;
            if (sub.tier === '3000') {
                points = 6;
            }
            else if (sub.tier === '2000') {
                points = 2;
            }
            else {
                points = 1;
            }
            const match = prev.findIndex((s) => s.id === sub.user_id);
            if (match >= 0 && prev[match].points < points) {
                prev.splice(match, 1, { id: sub.user_id, points });
            }
            else {
                prev.push({ id: sub.user_id, points });
            }
            return prev;
        }, []);
        const pointCount = filteredSubs.reduce((p, c) => p + c.points, 0);
        replicants_1.twitchSubscribers.value.totalCount = filteredSubs.length;
        replicants_1.twitchSubscribers.value.totalPoints = pointCount;
        (0, nodecg_1.get)().log.debug('[Twitch Subs] Successfully updated stats');
    }
    catch (err) {
        (0, nodecg_1.get)().log.warn('[Twitch Subs] Error while updating stats');
        (0, nodecg_1.get)().log.debug('[Twitch Subs] Error while updating stats:', err);
    }
    setTimeout(updateSubscriptionStats, refreshTime);
}
let init = false;
replicants_1.twitchAPIData.on('change', (newVal) => {
    if (!init && newVal.state === 'on') {
        updateSubscriptionStats();
        init = true;
    }
});
