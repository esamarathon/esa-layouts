"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchSrcomPronouns = void 0;
const audio_normaliser_1 = __importDefault(require("@shared/extension/audio-normaliser"));
const server_1 = require("./server");
const helpers_1 = require("./util/helpers");
const mqLogging = __importStar(require("./util/mq-logging"));
const nodecg_1 = require("./util/nodecg");
const obs_1 = __importDefault(require("./util/obs"));
const rabbitmq_1 = require("./util/rabbitmq");
const replicants_1 = require("./util/replicants");
const speedcontrol_1 = require("./util/speedcontrol");
const config = (0, nodecg_1.get)().bundleConfig;
new audio_normaliser_1.default((0, nodecg_1.get)()); // eslint-disable-line no-new
// Increase max listeners on the nodecg-speedcontrol timer a bit to stop errors.
// This may want to be moved to that bundle directly in the future? It impacts all bundles!
speedcontrol_1.sc.timer.setMaxListeners(20);
replicants_1.serverTimestamp.value = Date.now();
setInterval(() => { replicants_1.serverTimestamp.value = Date.now(); }, 100);
// Screened data from our moderation tool.
rabbitmq_1.mq.evt.on('newScreenedSub', (data) => {
    (0, nodecg_1.get)().log.debug('[Misc] Received new subscription');
    (0, nodecg_1.get)().sendMessage('newSub', data);
});
rabbitmq_1.mq.evt.on('newScreenedCheer', (data) => {
    (0, nodecg_1.get)().log.debug('[Misc] Received new cheer');
    (0, nodecg_1.get)().sendMessage('newCheer', data);
});
// Information that should come from our 2nd stream.
rabbitmq_1.mq.evt.on('runChanged', (data) => {
    if ((0, helpers_1.getOtherStreamEventShort)() === data.event) {
        replicants_1.otherStreamData.value.runData = data.run || null;
        (0, nodecg_1.get)().log.debug('[Misc] Received modified run data from other stream');
    }
});
rabbitmq_1.mq.evt.on('gameSceneChanged', (data) => {
    if ((0, helpers_1.getOtherStreamEventShort)() === data.event) {
        (0, nodecg_1.get)().log.debug('[Misc] Received game scene change from other stream:', data.action);
        if (data.action === 'start') {
            replicants_1.otherStreamData.value.show = true;
        }
        else if (data.action === 'end') {
            replicants_1.otherStreamData.value.show = false;
        }
    }
});
let init = false;
speedcontrol_1.sc.runDataActiveRun.on('change', (newVal, oldVal) => {
    // Do some stuff when the run changes and not on the game layout scene (if OBS is connected).
    if ((oldVal === null || oldVal === void 0 ? void 0 : oldVal.id) !== (newVal === null || newVal === void 0 ? void 0 : newVal.id)
        && ((!obs_1.default.connected && init)
            || (obs_1.default.connected && !obs_1.default.isCurrentScene(config.obs.names.scenes.gameLayout)))) {
        // Only trigger these changes if the new run has a scheduled time, which means it was
        // imported from an external schedule. This stops manually added runs (like bonus runs)
        // having things erased.
        if (speedcontrol_1.sc.runDataActiveRun.value && newVal && newVal.scheduled) {
            if (config.event.shorts !== 'swcf')
                replicants_1.commentators.value.length = 0;
            // If not online and flagcarrier is enabled,
            // we also clear the teams and big button player map.
            if (!config.event.online && config.flagcarrier.enabled) {
                replicants_1.bigbuttonPlayerMap.value = {};
                // TODO: Reselecting the current run would overwrite these, but not much I can do right now!
                speedcontrol_1.sc.runDataActiveRun.value.teams = [];
                (0, nodecg_1.get)().log.debug('[Misc] Removed active run teams on run change');
            }
            (0, nodecg_1.get)().log.debug('[Misc] Cleared commentators and big button player mapping');
        }
    }
    // This will also be triggered on server start up.
    // TODO: Move this to the start,
    //       so changes are not taken into account (if that is actually happening)?
    mqLogging.logRunChange(newVal);
    init = true;
});
// Update replicant that stores the ID of the upcoming run,
// both on timer stopping, if you somehow have no current run
// (usually if you're at the start of the run list),
// and also via a "force" button on the dashboard.
speedcontrol_1.sc.on('timerStopped', () => {
    replicants_1.upcomingRunID.value = speedcontrol_1.sc.runDataActiveRunSurrounding.value.next || null;
});
speedcontrol_1.sc.runDataActiveRunSurrounding.on('change', (newVal) => {
    if (!newVal.current) {
        replicants_1.upcomingRunID.value = newVal.next || null;
    }
});
(0, nodecg_1.get)().listenFor('forceUpcomingRun', (id) => {
    // Check supplied run ID exists in our array.
    const run = speedcontrol_1.sc.runDataArray.value.find((r) => r.id === id);
    replicants_1.upcomingRunID.value = (run === null || run === void 0 ? void 0 : run.id) || null;
});
// Helper function to get pronouns of a specified user name from speedrun.com
// eslint-disable-next-line import/prefer-default-export
async function searchSrcomPronouns(val) {
    var _a;
    const name = val.replace(/\((.*?)\)/g, '').trim();
    let pronouns = (_a = (val.match(/\((.*?)\)/g) || [])[0]) === null || _a === void 0 ? void 0 : _a.replace(/[()]/g, '');
    if (!pronouns) {
        const data = await speedcontrol_1.sc.sendMessage('srcomSearchForUserDataMultiple', [
            { type: 'twitch', val: name },
            { type: 'name', val: name },
        ]);
        pronouns = (0, helpers_1.formatSrcomPronouns)((data === null || data === void 0 ? void 0 : data.pronouns) || '') || '';
    }
    // Allows the user to specify "(none)" and bypass a look-up.
    if (pronouns.toLowerCase().includes('none'))
        pronouns = '';
    return pronouns ? `${name} (${pronouns})` : name;
}
exports.searchSrcomPronouns = searchSrcomPronouns;
// Processes adding commentators from the dashboard panel.
(0, nodecg_1.get)().listenFor('commentatorAdd', async (val, ack) => {
    var _a;
    if (val) {
        if (config.server.enabled) {
            let user;
            try {
                [user] = (await (0, server_1.lookupUsersByStr)(val));
            }
            catch (err) {
                // catch
            }
            if (user) {
                // TODO: ALLOW PRONOUNS TO BE OVERRIDDEN!
                //       (Technically can be done now as a result won't return,
                //       but a flag won't be returned).
                // TODO: Stop someone adding the same person twice.
                // Fix some flags which use a different format (mostly GB).
                let { country } = user;
                if (country && country.includes('-'))
                    country = country.replace('-', '/');
                replicants_1.commentatorsNew.value.push({
                    name: user.name,
                    country: country || undefined,
                    pronouns: user.pronouns || undefined,
                });
                // Old way for backwards compatibility.
                replicants_1.commentators.value.push(user.pronouns ? `${user.name} (${user.pronouns})` : user.name);
            }
            else {
                // User not found, process string as NAME or NAME (PRONOUNS).
                replicants_1.commentatorsNew.value.push({
                    name: val.replace(/\((.*?)\)/g, '').trim(),
                    pronouns: (_a = (val.match(/\((.*?)\)/g) || [])[0]) === null || _a === void 0 ? void 0 : _a.replace(/[()]/g, ''),
                });
                // Old way for backwards compatibility.
                replicants_1.commentators.value.push(val);
            }
        }
        else {
            // TODO: IMPLEMENT WITH NEW CHANGES!
            /* const str = await searchSrcomPronouns(val);
            if (!commentators.value.includes(str)) {
              commentators.value.push(str);
            } */
        }
    }
    if (ack && !ack.handled) {
        ack(null);
    }
});
(0, nodecg_1.get)().listenFor('commentatorRemove', (val, ack) => {
    replicants_1.commentatorsNew.value.splice(val, 1);
    replicants_1.commentators.value.splice(val, 1);
    if (ack && !ack.handled) {
        ack(null);
    }
});
// Processes modifying the reader from the dasboard panel.
(0, nodecg_1.get)().listenFor('readerModify', async (val, ack) => {
    var _a;
    if (!val) {
        replicants_1.donationReaderNew.value = null;
        replicants_1.donationReader.value = null;
    }
    else if (config.server.enabled) {
        let user;
        try {
            [user] = (await (0, server_1.lookupUsersByStr)(val));
        }
        catch (err) {
            // catch
        }
        if (user) {
            // TODO: ALLOW PRONOUNS TO BE OVERRIDDEN!
            // Fix some flags which use a different format (mostly GB).
            let { country } = user;
            if (country && country.includes('-'))
                country = country.replace('-', '/');
            replicants_1.donationReaderNew.value = {
                name: user.name,
                country: country || undefined,
                pronouns: user.pronouns || undefined,
            };
            // Old way for backwards compatibility.
            replicants_1.donationReader.value = user.pronouns ? `${user.name} (${user.pronouns})` : user.name;
        }
        else {
            // User not found, process string as NAME or NAME (PRONOUNS).
            replicants_1.donationReaderNew.value = {
                name: val.replace(/\((.*?)\)/g, '').trim(),
                pronouns: (_a = (val.match(/\((.*?)\)/g) || [])[0]) === null || _a === void 0 ? void 0 : _a.replace(/[()]/g, ''),
            };
            // Old way for backwards compatibility.
            replicants_1.donationReader.value = val;
        }
    }
    else {
        // TODO: IMPLEMENT WITH NEW CHANGES!
        // donationReader.value = await searchSrcomPronouns(val);
    }
    if (ack && !ack.handled) {
        ack(null);
    }
});
async function changeTwitchMetadata(title, gameId) {
    try {
        let t = title || config.event.fallbackTwitchTitle;
        if (t) {
            // Lots below copied from nodecg-speedcontrol (with some minor modifications).
            // TODO: Expose a helper in that bundle to do this stuff instead.
            const runData = speedcontrol_1.sc.getCurrentRun();
            const mentionChannels = true;
            let players = 'Runs coming up!'; // "Fake" string to show when no runners active
            // OVERRIDE FOR RELAYS BECAUSE LOTS OF PEOPLE! ESAW24
            if ((runData === null || runData === void 0 ? void 0 : runData.relay) && runData.teams[0].name) {
                players = runData.teams[0].name;
            }
            else {
                players = (runData === null || runData === void 0 ? void 0 : runData.teams.map((team) => (team.players.map((player) => (mentionChannels && player.social.twitch
                    ? `@${player.social.twitch}` : player.name)).join(', '))).join(' vs. ')) || 'Runs coming up!'; // "Fake" string to show when no runners active
            }
            const additionalDonationsMapped = (0, nodecg_1.get)().bundleConfig.additionalDonations.map((d) => {
                var _a, _b;
                return ({
                    key: d.key,
                    description: d.description,
                    amount: d.amount,
                    active: (_b = (_a = replicants_1.additionalDonations.value.find((a) => a.key === d.key)) === null || _a === void 0 ? void 0 : _a.active) !== null && _b !== void 0 ? _b : false,
                });
            });
            const donationTotalAdditional = additionalDonationsMapped
                .filter((d) => d.active).reduce((partialSum, a) => partialSum + a.amount, 0);
            const fullDonationTotal = replicants_1.donationTotal.value + donationTotalAdditional;
            t = t
                .replace(/{{game}}/g, (runData === null || runData === void 0 ? void 0 : runData.game) || '') // Copied from SC
                .replace(/{{players}}/g, players) // Copied from SC
                .replace(/{{category}}/g, (runData === null || runData === void 0 ? void 0 : runData.category) || '') // Copied from SC
                .replace(/{{total}}/g, (0, helpers_1.formatUSD)(fullDonationTotal, true)); // Original to this bundle
        }
        else {
            throw new Error('no title found to update to');
        }
        (0, nodecg_1.get)().log.debug('[Misc] Decided Twitch title is: %s - Decided game ID is %s', t, gameId);
        if (config.event.shorts === 'swcf') {
            (0, nodecg_1.get)().sendMessageToBundle('twitchExternalMetadataAltMode', 'esa-commercials', { title: t === null || t === void 0 ? void 0 : t.slice(0, 140), gameId });
        }
        else {
            const data = { title: t === null || t === void 0 ? void 0 : t.slice(0, 140) };
            if (gameId)
                data.game_id = gameId;
            const resp = await speedcontrol_1.sc.sendMessage('twitchAPIRequest', {
                method: 'patch',
                endpoint: `/channels?broadcaster_id=${replicants_1.twitchAPIData.value.channelID}`,
                data,
                newAPI: true,
            });
            if (resp.statusCode !== 204) {
                throw new Error(JSON.stringify(resp.body));
            }
            // "New" API doesn't return anything so update the data with what we've got.
            replicants_1.twitchChannelInfo.value.title = (t === null || t === void 0 ? void 0 : t.slice(0, 140)) || '';
            if (gameId)
                replicants_1.twitchChannelInfo.value.game_id = gameId;
            // twitchChannelInfo.value.game_name = dir?.name || '';
        }
        (0, nodecg_1.get)().log.debug('[Misc] Twitch title/game updated');
    }
    catch (err) {
        (0, helpers_1.logError)('[Misc] Error updating Twitch channel information:', err);
    }
}
if (config.tracker.donationTotalInTitle) {
    // Used to change the Twitch title when requested by nodecg-speedcontrol.
    (0, nodecg_1.get)().listenFor('twitchExternalMetadata', 'nodecg-speedcontrol', async ({ title, gameID }) => {
        (0, nodecg_1.get)().log.debug('[Misc] Message received to change title/game, will attempt (title: %s, game id: %s)', title, gameID);
        await changeTwitchMetadata(title, gameID);
    });
    // Used to change the Twitch title when the donation total updates.
    let donationTotalInit = false;
    replicants_1.donationTotal.on('change', async (val) => {
        if (donationTotalInit && replicants_1.twitchAPIData.value.sync) {
            (0, nodecg_1.get)().log.debug('[Misc] Donation total updated to %s, will attempt to set title', val);
            await changeTwitchMetadata();
        }
        donationTotalInit = true;
    });
    let additionalDonationsInit = false;
    replicants_1.additionalDonations.on('change', async () => {
        if (additionalDonationsInit && replicants_1.twitchAPIData.value.sync) {
            (0, nodecg_1.get)().log.debug('[Misc] Additional donations updated, will attempt to set title');
            await changeTwitchMetadata();
        }
        additionalDonationsInit = true;
    });
}
async function formatScheduleImportedPronouns() {
    (0, nodecg_1.get)().log.info('[Misc] Schedule reimported, formatting pronouns');
    const runs = speedcontrol_1.sc.getRunDataArray();
    for (const run of runs) {
        const { teams } = run;
        teams.forEach((team, x) => {
            team.players.forEach((player, y) => {
                // Even though the function is named "Srcom", this should also work
                // fine with those from Oengus imports as well.
                teams[x].players[y].pronouns = (0, helpers_1.formatSrcomPronouns)(player.pronouns);
            });
        });
        await speedcontrol_1.sc.sendMessage('modifyRun', {
            runData: Object.assign(Object.assign({}, run), { teams }),
        });
    }
    (0, nodecg_1.get)().log.info('[Music] Schedule reimport pronoun formatting complete');
}
if (!config.server.enabled) {
    // If server integration is disabled, checks pronouns formatting on every schedule (re)import.
    replicants_1.horaroImportStatus.on('change', async (newVal, oldVal) => {
        if (oldVal && oldVal.importing && !newVal.importing) {
            await formatScheduleImportedPronouns();
        }
    });
    replicants_1.oengusImportStatus.on('change', async (newVal, oldVal) => {
        if (oldVal && oldVal.importing && !newVal.importing) {
            await formatScheduleImportedPronouns();
        }
    });
}
