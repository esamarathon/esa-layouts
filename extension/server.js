"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lookupUsersByStr = exports.lookupUserByID = void 0;
const needle_1 = __importDefault(require("needle"));
const nodecg_1 = require("./util/nodecg");
const replicants_1 = require("./util/replicants");
const speedcontrol_1 = require("./util/speedcontrol");
const config = (0, nodecg_1.get)().bundleConfig;
async function lookupUserByID(id) {
    if (!config.server.enabled)
        throw new Error('server integration disabled');
    const resp = await (0, needle_1.default)('get', `${config.server.address}/users/${id}`, {
        headers: {
            Authorization: `Bearer ${config.server.key}`,
        },
    });
    return resp.body.data;
}
exports.lookupUserByID = lookupUserByID;
// TODO: The API used to do this kinda sucks, either needs improving here
//       or improving on the server-side.
async function lookupUsersByStr(str) {
    if (!config.server.enabled)
        throw new Error('server integration disabled');
    const resp = await (0, needle_1.default)('get', `${config.server.address}/users?search=${str}`, {
        headers: {
            Authorization: `Bearer ${config.server.key}`,
        },
    });
    return resp.body.data;
}
exports.lookupUsersByStr = lookupUsersByStr;
async function lookupScheduleUserInfo() {
    var _a;
    (0, nodecg_1.get)().log.info('[Server] Schedule reimported, looking up user information');
    const runs = speedcontrol_1.sc.getRunDataArray();
    for (const run of runs) {
        const userIds = run.customData.userIds ? run.customData.userIds.split(',') : [];
        const userDataArr = [];
        for (const id of userIds) {
            try {
                if (Number(id) > 0) {
                    // 500ms wait to not hammer the server
                    await new Promise((res) => { setTimeout(res, 500); });
                    const userData = await lookupUserByID(Number(id));
                    userDataArr.push(userData);
                }
                else {
                    userDataArr.push(null);
                }
            }
            catch (err) {
                // error
                userDataArr.push(null);
            }
        }
        let i = 0;
        const { teams } = run;
        for (const [x, team] of teams.entries()) {
            for (const [y, player] of team.players.entries()) {
                teams[x].players[y].customData.id = userIds[i];
                let userData = userDataArr[i];
                if (!userData && (config.event.shorts === 'swcf'
                    || (typeof config.event.shorts === 'string'
                        && config.event.shorts.toLowerCase().startsWith('uksg')))) {
                    try {
                        // 500ms wait to not hammer the server
                        await new Promise((res) => { setTimeout(res, 500); });
                        userData = (await lookupUsersByStr(player.name.toLowerCase()))[0] || null;
                    }
                    catch (err) {
                        userData = null;
                    }
                }
                teams[x].players[y].pronouns = undefined; // Erase pronouns, even if no user found
                if (userData) {
                    // Fix some flags which use a different format (mostly GB).
                    let { country } = userData;
                    if (country && country.includes('-'))
                        country = country.replace('-', '/');
                    teams[x].players[y].name = userData.name;
                    teams[x].players[y].country = country || undefined;
                    teams[x].players[y].pronouns = userData.pronouns || undefined;
                    const twitch = userData.twitch
                        && userData.twitch.displayName.toLowerCase() === userData.twitch.login
                        ? userData.twitch.displayName
                        : (_a = userData.twitch) === null || _a === void 0 ? void 0 : _a.login;
                    teams[x].players[y].social.twitch = twitch || undefined;
                }
                i += 1;
            }
        }
        await speedcontrol_1.sc.sendMessage('modifyRun', {
            runData: Object.assign(Object.assign({}, run), { teams }),
        });
    }
    (0, nodecg_1.get)().log.info('[Server] Schedule reimport user information lookup complete');
}
if (config.server.enabled) {
    replicants_1.horaroImportStatus.on('change', async (newVal, oldVal) => {
        if (oldVal && oldVal.importing && !newVal.importing) {
            await lookupScheduleUserInfo();
        }
    });
    replicants_1.oengusImportStatus.on('change', async (newVal, oldVal) => {
        if (oldVal && oldVal.importing && !newVal.importing) {
            await lookupScheduleUserInfo();
        }
    });
}
