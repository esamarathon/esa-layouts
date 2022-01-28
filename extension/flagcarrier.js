"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const clone_1 = __importDefault(require("clone"));
const lodash_1 = require("lodash");
const uuid_1 = require("uuid");
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
const buttonIds = [
    '1',
    '2',
    '3',
    '4',
];
// Function used if all player tags have been scanned, or a tech has forced this to run.
function mapScannedPlayersToTeams(run, players) {
    const teams = (0, clone_1.default)(run.teams);
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
    // If any teams left over, fill in button mapping with fake data,
    // and just push their names in current order back into the run data.
    if (teams.length) {
        const newMap = (0, clone_1.default)(replicants_1.bigbuttonPlayerMap.value);
        teams.forEach((team) => {
            newTeams.push(team);
            buttonIds.some((id) => {
                var _a;
                if (!((_a = newMap[id]) === null || _a === void 0 ? void 0 : _a.length)) {
                    newMap[id] = team.players.map((p) => ({
                        flagcarrier: {
                            id,
                            group: 'stream1',
                            time: {
                                iso: (new Date()).toISOString(),
                                unix: Date.now() / 1000,
                            },
                            uid: (0, uuid_1.v4)(),
                        },
                        user: {
                            displayName: p.name,
                        },
                        raw: {
                            pronouns: (0, helpers_1.formatSrcomPronouns)(p.pronouns) || '',
                        },
                    }));
                    return true;
                }
                return false;
            });
        });
        replicants_1.bigbuttonPlayerMap.value = (0, clone_1.default)(newMap);
    }
    // Replace Twitch username, country code and pronouns if any are found on the tags.
    newTeams = newTeams.map((team) => (Object.assign(Object.assign({}, team), { players: team.players.map((p) => {
            var _a;
            const scanned = players
                .find((u) => u.user.displayName.toLowerCase() === p.name.toLowerCase());
            const countryCode = (_a = countries_1.default
                .find((c) => c.code === (scanned === null || scanned === void 0 ? void 0 : scanned.raw.country_code.toLowerCase()))) === null || _a === void 0 ? void 0 : _a.code;
            return Object.assign(Object.assign({}, p), { social: Object.assign(Object.assign({}, p.social), { twitch: (scanned === null || scanned === void 0 ? void 0 : scanned.raw.twitch_name) || p.social.twitch }), country: countryCode || p.country, pronouns: scanned ? (scanned.raw.pronouns || '') : p.pronouns });
        }) })));
    // Finally, set these teams to the currently active run.
    if (speedcontrol_1.sc.runDataActiveRun.value)
        speedcontrol_1.sc.runDataActiveRun.value.teams = newTeams;
    (0, nodecg_1.get)().log.debug('[FlagCarrier] All players from run scanned in and teams mapped');
}
function setup() {
    // RabbitMQ events from the "big red buttons", used for players/commentators.
    rabbitmq_1.mq.evt.on('bigbuttonTagScanned', async (data) => {
        var _a;
        if (config.event.thisEvent === 1 && data.flagcarrier.group === 'stream1') {
            // Stores a state for messages sent out at the bottom.
            let scanState;
            // str = await searchSrcomPronouns(str);
            // Get the original run from the array (before the teams were removed).
            const currentRunInRunArray = speedcontrol_1.sc.runDataArray.value
                .find((r) => { var _a; return r.id === ((_a = speedcontrol_1.sc.runDataActiveRun.value) === null || _a === void 0 ? void 0 : _a.id); });
            // Compile raw arrays of all players on the run for easy checking later.
            const allPlayersRun = currentRunInRunArray === null || currentRunInRunArray === void 0 ? void 0 : currentRunInRunArray.teams.reduce((prev, t) => prev.concat(...t.players), []);
            const player = allPlayersRun === null || allPlayersRun === void 0 ? void 0 : allPlayersRun.find((p) => p.name.toLowerCase() === data.user.displayName.toLowerCase());
            // Check if teams haven't been mapped yet and the user is a player in this run,
            // and that the timer is stopped.
            if (player && currentRunInRunArray && !((_a = speedcontrol_1.sc.getCurrentRun()) === null || _a === void 0 ? void 0 : _a.teams.length)
                && speedcontrol_1.sc.timer.value.state === 'stopped') {
                const playerTeam = currentRunInRunArray.teams.find((t) => t.id === (player === null || player === void 0 ? void 0 : player.teamID));
                const otherPlayersOnBtn = replicants_1.bigbuttonPlayerMap.value[data.flagcarrier.id] || [];
                const otherTeamPlayersOnBtn = otherPlayersOnBtn.filter((u) => playerTeam === null || playerTeam === void 0 ? void 0 : playerTeam.players.find((p) => p.name.toLowerCase() === u.user.displayName.toLowerCase()));
                if (otherPlayersOnBtn.length !== otherTeamPlayersOnBtn.length) {
                    // Error, player scanning into a button another team is already on.
                    (0, nodecg_1.get)().log.warn('[FlagCarrier] Scanned in user was player '
                        + 'but button already occupied by another team (ButtonID: %s, Name: %s)', data.flagcarrier.id, data.user.displayName);
                    scanState = 'fail_player';
                }
                else {
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
                    (0, nodecg_1.get)().log.debug('[FlagCarrier] Player successfully scanned in (ButtonID: %s, Name: %s)', data.flagcarrier.id, data.user.displayName);
                    scanState = 'success_player';
                    // All players scanned in?
                    const allScannedPlayers = Object.values(replicants_1.bigbuttonPlayerMap.value)
                        .reduce((prev, b) => prev.concat(...b), []);
                    const leftToScan = (0, lodash_1.differenceWith)(allPlayersRun, allScannedPlayers, (x, y) => x.name
                        .toLowerCase() === y.user.displayName.toLowerCase());
                    if (!leftToScan.length) {
                        mapScannedPlayersToTeams(currentRunInRunArray, allScannedPlayers);
                    }
                }
                // If not a player in the run and not already a commentator, adds them as one.
            }
            else if (!player) {
                const name = data.user.displayName;
                const pronouns = data.raw.pronouns;
                const str = pronouns ? `${name} (${pronouns})` : name;
                // We show a "success" message to users even if the tag was already scanned, for simplicity.
                scanState = 'success_comm';
                if (!replicants_1.commentators.value.includes(str)) {
                    replicants_1.commentators.value.push(str);
                    (0, nodecg_1.get)().log.debug('[FlagCarrier] Commentator successfully scanned in (ButtonID: %s, Name: %s)', data.flagcarrier.id, data.user.displayName);
                }
            }
            (0, nodecg_1.get)().sendMessage('bigbuttonTagScanned', {
                state: scanState,
                data,
            });
        }
    });
    // Clears/resets big button player mapping and removes teams from active run.
    // This mimics what happens when a run is changed, as a backup for tech.
    (0, nodecg_1.get)().listenFor('bigbuttonResetPlayers', () => {
        if (speedcontrol_1.sc.timer.value.state !== 'stopped')
            return; // Cannot make changes if timer is running.
        replicants_1.bigbuttonPlayerMap.value = {};
        if (!config.event.online && speedcontrol_1.sc.runDataActiveRun.value) {
            speedcontrol_1.sc.runDataActiveRun.value.teams = [];
        }
    });
    // Triggered via the dashboard to manually "finish" the scanning process,
    // which will fill in missing players/teams if needed.
    (0, nodecg_1.get)().listenFor('bigbuttonForceFillPlayers', () => {
        // Get the original run from the array (before the teams were removed).
        const currentRunInRunArray = speedcontrol_1.sc.runDataArray.value
            .find((r) => { var _a; return r.id === ((_a = speedcontrol_1.sc.runDataActiveRun.value) === null || _a === void 0 ? void 0 : _a.id); });
        const allScannedPlayers = Object.values(replicants_1.bigbuttonPlayerMap.value)
            .reduce((prev, b) => prev.concat(...b), []);
        if (currentRunInRunArray) {
            mapScannedPlayersToTeams(currentRunInRunArray, allScannedPlayers);
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
