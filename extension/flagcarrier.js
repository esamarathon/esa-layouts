"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const clone_1 = __importDefault(require("clone"));
const lodash_1 = require("lodash");
const countries_1 = __importDefault(require("./util/countries"));
const helpers_1 = require("./util/helpers");
const nodecg_1 = require("./util/nodecg");
const rabbitmq_1 = require("./util/rabbitmq");
const replicants_1 = require("./util/replicants");
const speedcontrol_1 = require("./util/speedcontrol");
const router = (0, nodecg_1.get)().Router();
const config = (0, nodecg_1.get)().bundleConfig;
const allowedDevices = !Array.isArray(config.flagcarrier.allowedDevices)
    && typeof config.flagcarrier.allowedDevices === 'string'
    ? [config.flagcarrier.allowedDevices]
    : config.flagcarrier.allowedDevices || [];
function setup() {
    // RabbitMQ events from the "big red buttons", used for players/commentators.
    rabbitmq_1.mq.evt.on('bigbuttonTagScanned', async (data) => {
        var _a;
        if (config.event.thisEvent === 1 && data.flagcarrier.group === 'stream1') {
            const name = data.user.displayName;
            const pronouns = data.raw.pronouns;
            const str = pronouns ? `${name} (${pronouns})` : name;
            // str = await searchSrcomPronouns(str);
            (0, nodecg_1.get)().sendMessage('bigbuttonTagScanned', { id: data.flagcarrier.id, str });
            // Get the original run from the array (before the teams were removed).
            const currentRunInRunArray = speedcontrol_1.sc.runDataArray.value
                .find((r) => { var _a; return r.id === ((_a = speedcontrol_1.sc.runDataActiveRun.value) === null || _a === void 0 ? void 0 : _a.id); });
            // Check if scanned in user is a player in the active run.
            const player = currentRunInRunArray === null || currentRunInRunArray === void 0 ? void 0 : currentRunInRunArray.teams.find((t) => t.players
                .find((p) => p.name.toLowerCase() === data.user.displayName.toLowerCase()));
            // If a player is in the active run and the teams haven't been mapped yet.
            if (currentRunInRunArray && player && !((_a = speedcontrol_1.sc.getCurrentRun()) === null || _a === void 0 ? void 0 : _a.teams.length)) {
                const newMap = (0, clone_1.default)(replicants_1.bigbuttonPlayerMap.value);
                // Delete scanned user from big button player map if already in a slot.
                Object.entries(newMap).forEach(([key, value]) => {
                    const index = value.findIndex((p) => p.user.displayName === data.user.displayName);
                    if (index >= 0) {
                        newMap[key].splice(index, 1);
                    }
                });
                // Add the scanned user into the big button player map in the correct slot.
                if (!newMap[data.flagcarrier.id]) {
                    newMap[data.flagcarrier.id] = [];
                }
                newMap[data.flagcarrier.id].push(data);
                replicants_1.bigbuttonPlayerMap.value = (0, clone_1.default)(newMap);
                // See if all players have been scanned in yet.
                const allPlayersRun = currentRunInRunArray.teams
                    .reduce((prev, team) => prev.concat(...team.players), []);
                const allScannedPlayers = Object.values(replicants_1.bigbuttonPlayerMap.value)
                    .reduce((prev, button) => prev.concat(...button), []);
                // All players scanned in?
                const leftToScan = (0, lodash_1.differenceWith)(allPlayersRun, allScannedPlayers, (x, y) => x.name
                    .toLowerCase() === y.user.displayName.toLowerCase());
                if (!leftToScan.length) {
                    const teams = (0, clone_1.default)(currentRunInRunArray.teams);
                    let newTeams = [];
                    // Go through each button and sort the teams in the correct order.
                    // This assumes the button IDs can be sorted alphabetically.
                    Object.keys(replicants_1.bigbuttonPlayerMap.value).sort().forEach((id) => {
                        if (teams.length) {
                            // Find which team has a player in it from this button ID, if any.
                            const teamIndex = teams.findIndex((t) => t.players
                                .find((p) => replicants_1.bigbuttonPlayerMap.value[id]
                                .find((u) => u.user.displayName.toLowerCase() === p.name.toLowerCase())));
                            // If team found, remove from search array and push to new array.
                            if (teamIndex >= 0) {
                                newTeams.push((0, clone_1.default)(teams[teamIndex]));
                                teams.splice(teamIndex, 1);
                            }
                        }
                    });
                    // Replace Twitch username, country code and pronouns if any are found on the tags.
                    newTeams = newTeams.map((team) => (Object.assign(Object.assign({}, team), { players: team.players.map((p) => {
                            var _a;
                            const scanned = allScannedPlayers
                                .find((u) => u.user.displayName.toLowerCase() === p.name.toLowerCase());
                            const countryCode = (_a = countries_1.default
                                .find((c) => c.code === (scanned === null || scanned === void 0 ? void 0 : scanned.raw.country_code.toLowerCase()))) === null || _a === void 0 ? void 0 : _a.code;
                            return Object.assign(Object.assign({}, p), { social: Object.assign(Object.assign({}, p.social), { twitch: (scanned === null || scanned === void 0 ? void 0 : scanned.raw.twitch_name) || p.social.twitch }), country: countryCode || p.country, pronouns: scanned ? (scanned.raw.pronouns || '') : p.pronouns });
                        }) })));
                    // Finally, set these teams to the currently active run.
                    if (speedcontrol_1.sc.runDataActiveRun.value)
                        speedcontrol_1.sc.runDataActiveRun.value.teams = newTeams;
                }
                // If not a player in the run and not already a commentator, adds them as one.
            }
            else if (!replicants_1.commentators.value.includes(str)) {
                replicants_1.commentators.value.push(str);
                (0, nodecg_1.get)().log.debug('[FlagCarrier] Added new commentator:', str);
            }
        }
    });
    // Clears/resets big button player mapping and removes teams from active run.
    // This mimics what happens when a run is changed, as a backup for tech.
    (0, nodecg_1.get)().listenFor('bigbuttonResetPlayers', () => {
        replicants_1.bigbuttonPlayerMap.value = {};
        if (!config.event.online && speedcontrol_1.sc.runDataActiveRun.value) {
            speedcontrol_1.sc.runDataActiveRun.value.teams = [];
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
            // donationReader.value = await searchSrcomPronouns(str);
            replicants_1.donationReader.value = str;
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
