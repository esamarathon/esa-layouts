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
if (config.server.enabled) {
    replicants_1.horaroImportStatus.on('change', async (newVal, oldVal) => {
        var _a;
        if (oldVal && oldVal.importing && !newVal.importing) {
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
                        if (!userData && config.event.shorts === 'swcf') {
                            try {
                                // 500ms wait to not hammer the server
                                await new Promise((res) => { setTimeout(res, 500); });
                                userData = await lookupUsersByStr(player.name.toLowerCase());
                            }
                            catch (err) {
                                userData = null;
                            }
                        }
                        if (userData) {
                            // Fix some flags which use a different format (mostly GB).
                            let { country } = userDataArr[i];
                            if (country && country.includes('-'))
                                country = country.replace('-', '/');
                            teams[x].players[y].name = userDataArr[i].name;
                            teams[x].players[y].country = country || undefined;
                            teams[x].players[y].pronouns = userDataArr[i].pronouns || undefined;
                            teams[x].players[y].social.twitch = ((_a = userDataArr[i].twitch) === null || _a === void 0 ? void 0 : _a.displayName) || undefined;
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
    });
}
